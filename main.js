const { app, BrowserWindow, globalShortcut, Tray, Menu, nativeImage } = require('electron');
const path = require('path');

let win = null;
let tray = null;

// 自動起動を有効化
function enableAutoLaunch() {
  try {
    app.setLoginItemSettings({
      openAtLogin: true,
      path: process.execPath,
      args: ['--hidden']
    });
    console.log('AutoLaunch:', app.getLoginItemSettings());
  } catch (e) {
    console.error('Failed to set auto launch:', e);
  }
}

// トレイアイコンを取得
function getTrayIcon() {
  const file = path.join(__dirname, 'icon.png');
  let icon = nativeImage.createFromPath(file);
  if (icon.isEmpty()) {
    const size = 16;
    const buf = Buffer.alloc(size * size * 4, 0xff);
    icon = nativeImage.createFromBitmap(buf, { width: size, height: size });
  }
  return icon.isEmpty() ? nativeImage.createEmpty() : icon;
}

// メインウィンドウを作成
function createWindow() {
  const startHidden = process.argv.includes('--hidden');

  win = new BrowserWindow({
    width: 1400,
    height: 900,
    show: !startHidden,
    autoHideMenuBar: true,
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  });

  win.loadURL('https://chatgpt.com/');

  win.on('close', (e) => {
    if (!app.isQuitting) {
      e.preventDefault();
      win.hide();
    }
  });

  win.on('closed', () => { win = null; });
}

// ウィンドウの表示/非表示を切り替え
function toggleWindow() {
  if (!win) return;
  if (win.isVisible()) {
    win.hide();
  } else {
    win.show();
    win.focus();
  }
}

// トレイメニューを作成
function createTray() {
  tray = new Tray(getTrayIcon());
  tray.setToolTip('ChatGPT (Ctrl+Gで表示/非表示)');

  const menu = Menu.buildFromTemplate([
    { label: '表示/非表示', click: toggleWindow },
    { label: '再読み込み', click: () => win && win.webContents.reloadIgnoringCache() },
    { type: 'separator' },
    {
      label: '終了',
      click: () => {
        app.isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(menu);
  tray.on('click', toggleWindow);
}

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (win) {
      win.show();
      win.focus();
    }
  });

  app.whenReady().then(() => {
    if (app.isPackaged) {
      enableAutoLaunch();
    }

    createWindow();
    createTray();

    const accel = process.platform === 'darwin' ? 'Command+G' : 'Control+G';
    const ok = globalShortcut.register(accel, toggleWindow);
    if (!ok) console.error('globalShortcut register failed:', accel);

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });
}

app.on('window-all-closed', () => {});
app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

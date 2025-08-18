# chatgpt-windows-app

## ビルド方法

このプロジェクトは [electron-builder](https://www.electron.build/) を使用しています。  
Windows で以下のコマンドを実行してください。

```bash
npm install
```
```bash
npm run build
```

## インストール方法

1. `dist/ChatGPT Ctrl+G Setup <version>.exe` を実行します。  
2. 画面の指示に従ってインストールしてください。  
   - インストール後、スタートメニューに「ChatGPT Ctrl+G」が追加されます。  
3. 初回はスタートメニューからアプリを起動してみてください。  
   - このタイミングで Windows の自動起動が登録されるはずです。  
4. 次回以降は Windows ログオン時に自動でシステムトレイに常駐し、**Ctrl+G** のショートカットキーで、アプリを表示させたり、非表示にさせたりすることができます。

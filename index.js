const { app, BrowserWindow } = require('electron');
const path = require('node:path');

function createWindow () {
  let win = new BrowserWindow({
    width: 640,
    height: 480,
    useContentSize: true,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'out/main.js')
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();
});

const { app, BrowserWindow } = require("electron");
const path = require("node:path");

const viewer = app.commandLine.hasSwitch("viewer");

function createWindow() {
  let win = new BrowserWindow({
    width: 640,
    height: 480,
    useContentSize: true,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "out/main.js"),
    },
  });

  if (viewer) {
    win.loadFile("viewer.html");
  } else {
    win.loadFile("index.html");
  }
}

app.whenReady().then(() => {
  createWindow();
});

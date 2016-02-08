'use strict';

/* eslint no-console: 0 */

const globalShortcut = require('global-shortcut');

process.on('error', function (err) {
  console.log(err);
});

const app = require('app');
const BrowserWindow = require('browser-window');

let mainWindow;

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', function () {
  globalShortcut.register('CommandOrControl+Shift+i', () => {
    const w = BrowserWindow.getFocusedWindow();
    if (w) {
      w.toggleDevTools();
    }
  });

  mainWindow = new BrowserWindow({width: 1000, height: 800, icon: './icon.png'});
  mainWindow.setMenu(null);

  mainWindow.loadURL('file://' + __dirname + '/../index.html');
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

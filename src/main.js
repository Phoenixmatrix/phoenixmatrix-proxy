/* eslint no-console: 0 */

import globalShortcut from 'global-shortcut';

process.on('error', function(err) {
  console.log(err);
});

import app from 'app';
import BrowserWindow from 'browser-window';

let mainWindow;

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', function() {
  globalShortcut.register('CommandOrControl+Shift+i',() => {
    const w = BrowserWindow.getFocusedWindow();
    if (w) {
      w.toggleDevTools();
    }
  });

  mainWindow = new BrowserWindow({width: 1000, height: 800, icon: "./icon.png"});
  mainWindow.setMenu(null);

  mainWindow.loadURL('file://' + __dirname + '/../index.html');
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

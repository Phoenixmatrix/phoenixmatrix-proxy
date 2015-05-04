"use strict";

var globalShortcut = require('global-shortcut');

process.on('error', function(err) {
  console.log(err);
});

var app = require('app');
var BrowserWindow = require('browser-window');

var mainWindow;

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', function() {
  globalShortcut.register('ctrl+shift+i', function() {
    console.log('opening debugger')
    BrowserWindow.getFocusedWindow().toggleDevTools();
  });

  mainWindow = new BrowserWindow({width: 1000, height: 800, icon: "./icon.png"});

  mainWindow.loadUrl('file://' + __dirname + '/index.html');
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});
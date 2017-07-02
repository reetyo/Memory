const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path');
const url = require('url');
const fs = require("fs");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

let wordData
let translationData
var wordArray
var translationArray

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 1920, height: 1080 })

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  //mainWindow.webContents.openDevTools();


  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  readFile();
}

function readFile() {
  fs.readFile(__dirname + '/word.txt', { flag: 'r+', encoding: 'utf8' }, function (err, data) {
    if (err) {
      console.error(err);
      return;
    }
    wordArray = data.split("\n");
  });

  fs.readFile(__dirname + '/translation.txt', { flag: 'r+', encoding: 'utf8' }, function (err, data) {
    if (err) {
      console.error(err);
      return;
    }
    translationArray = data.split("\n");
  });



}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
})

exports.getArrayContent = function () {
  return { word: wordArray, translation: translationArray };
}
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const { app, BrowserWindow } = require('electron');
const axios = require('axios');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    icon: __dirname + '/assets/images/logo.ico',

    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, '/javascript/preload.js')
    },
  });

  mainWindow.maximize();
  mainWindow.setMenuBarVisibility(false);

  axios.get('http://localhost:3000/state')
    .then(response => {
      const state = response.data;
      if (state.maintenanceMode) {
        mainWindow.loadFile('src/pages/MaintenanceWork.html');
      } else {
        mainWindow.loadFile('src/index.html');
      }
    })
    .catch(error => {
      console.error('Error fetching state from server:', error);
      mainWindow.loadFile('src/pages/Error.html');
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
const { app, BrowserWindow, ipcMain } = require('electron');
const axios = require('axios');
const path = require('path');

let mainWindow;
let maintenanceMode = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    icon: __dirname + '/assets/images/logo.ico',

    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, '/javascript/preload.js')
    },
  });

  mainWindow.maximize();
  mainWindow.setMenuBarVisibility(false);

  axios.get('https://servon-app-api.vercel.app/state')
  .then(response => {
    const state = response.data;
    if (state.maintenanceMode) {
      mainWindow.loadFile('src/pages/MaintenanceWork.html');
      maintenanceMode = true;
    } else {
      mainWindow.loadFile('src/index.html');
      maintenanceMode = false;
    }
  })
  .catch(error => {
    console.error('Error fetching state from server:', error);
    mainWindow.loadFile('src/pages/Error.html');
  });
  
  MainWindowHandler();
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

function MainWindowHandler(){
  while (true) {
    axios.get('https://servon-app-api.vercel.app/state')
    .then(response => {
      const state = response.data;
      if (state.maintenanceMode && maintenanceMode == false) {
        mainWindow.loadFile('src/pages/MaintenanceWork.html');
        maintenanceMode = true;
      } else if (state.maintenanceMode == false && maintenanceMode == true) {
        mainWindow.loadFile('src/index.html');
        maintenanceMode = false;
      }
    })
    .catch(error => {
      console.error('Error fetching state from server:', error);
      mainWindow.loadFile('src/pages/Error.html');
    });

    setTimeout(MainWindowHandler, 1000);
    return; 
  }
}
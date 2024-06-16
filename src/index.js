const { app, BrowserWindow } = require('electron');
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
  
  checkForUpdates();
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

//Custom//
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

async function checkForUpdates() {
  try {
    const response = await axios.get('https://servon-app-api.vercel.app/update-info');
    const latestVersion = response.data.version;
    const updateUrl = response.data.url;

    const currentVersion = app.getVersion();
    if (latestVersion !== currentVersion) {
      const downloadResponse = await axios({
        url: updateUrl,
        method: 'GET',
        responseType: 'stream',
      });

      const updatePath = path.join(app.getPath('userData'), `servonapp-${latestVersion} Setup`);
      const writer = fs.createWriteStream(updatePath);

      downloadResponse.data.pipe(writer);

      writer.on('finish', () => {
        dialog.showMessageBox({
          type: 'info',
          title: 'Update available',
          message: 'A new update is available. The application will now close and install the update.',
        }).then(() => {
          installUpdate(updatePath);
        });
      });

      writer.on('error', () => {
        console.error('Error downloading the update');
      });
    }
  } catch (error) {
    console.error('Error checking for updates:', error);
  }
}

function installUpdate(updatePath) {
  exec(`"${updatePath}"`, (error) => {
    if (error) {
      console.error('Error running the installer:', error);
    } else {
      app.quit();
    }
  });
}
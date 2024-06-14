const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  fetchState: () => ipcRenderer.invoke('fetch-state')
});
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('SueChefDesktop', {
  platform: process.platform,
  isElectron: true,
  version: '1.0.0',
});

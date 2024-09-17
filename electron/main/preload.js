const { contextBridge, ipcRenderer } = require("electron");

// Expose ipcRenderer to the renderer process
contextBridge.exposeInMainWorld("ipcRenderer", {
  appRestart: () => {
    return ipcRenderer.invoke("app-restart");
  },
  appMinimize: () => {
    return ipcRenderer.invoke("minimize-App")
  },
  appReload: () => {
    return ipcRenderer.invoke('reload');
  },
  appClose: () => {
    return ipcRenderer.invoke('close-App')
  },
  isOnline: () => {
    return ipcRenderer.invoke('online-status')
  },
  getMachineId: () => {
    return ipcRenderer.invoke('get-machineid')
  },
  getUniqueMachineId: () => {
    return ipcRenderer.invoke('get-unique-machine-id')
  },
  serverAvailability: () => {
    return ipcRenderer.invoke('check-server-availability')
  },
  // decrypt: (data) => {
  //   return ipcRenderer.invoke('decrypt', data)
  // },
  tallyOpen: () => {
    return ipcRenderer.invoke("is-tally-open")
  },
  connectedToGivenPort: (data) => {
    return ipcRenderer.invoke('check-tally-connected-on-given-port', data)
  },
  syncComplete: (data) => {
    return ipcRenderer.invoke('sync-complete', data)
  },
  fetchCompanyInfo: (data) => {
    return ipcRenderer.invoke('fetch-company-info', data)
  },
  fetchTallyInfo: (data) => {
    return ipcRenderer.invoke('fetch-tally-info', data)
  },
  syncCompany: (data) => {
    return ipcRenderer.invoke('sync-company', data)
  },
  getCurrentVersion: () => {
    return ipcRenderer.invoke('current-version')
  },
  getLatestVersion: () => {
    return ipcRenderer.invoke('check-latest-version')
  },
  getLatestVersionURL: () => {
    return ipcRenderer.invoke('latest-version-url')
  },
  updateAvailable: () => {
    return ipcRenderer.invoke("update-can-available")
  },
  syncProgressCheck: async  () => {
    // return ipcRenderer.invoke('sync-progress-check')
    try{
      const ans = await ipcRenderer.invoke('sync-progress-check');
      const ans2 = ipcRenderer.on('sync-progress-result')
      console.log(ans2, 'ans in preload.js');
      return ans;
    }catch(error){
      console.log(error, 'error in preload.js');
      return null;
    }
  },
  syncProgressError: async  () => {
    return ipcRenderer.invoke('connector-noissue')
  },
  sendToMain: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  // Add this method to access webContents
  getWebContents: () => {
    return require('electron').remote.getCurrentWebContents();
  }
});

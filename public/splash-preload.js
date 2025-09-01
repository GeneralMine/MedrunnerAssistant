const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('splash', {
    startAudio: () => ipcRenderer.send('splash:start-audio'),
    ended:      () => ipcRenderer.send('splash:ended'),
});
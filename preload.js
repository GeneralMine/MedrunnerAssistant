const { contextBridge, ipcRenderer } = require('electron');

/* --- Splash Audio plumbing --- */
let splashPlayQueued = false;

function tryPlaySplashAudio() {
  const el = document.getElementById('splashAudio');
  if (!el) return false;
  el.play().catch(() => {});
  return true;
};

ipcRenderer.on('main:play-splash-audio', () => {
  if (!tryPlaySplashAudio()) splashPlayQueued = true;
});

window.addEventListener('DOMContentLoaded', () => {
  if (splashPlayQueued) {
    tryPlaySplashAudio();
    splashPlayQueued = false;
  };
});

contextBridge.exposeInMainWorld('assistant', {
  // API
  validateKey: (key) => ipcRenderer.invoke('api:validate', key),

  // Assistant controls
  start:  (key) => ipcRenderer.invoke('assistant:start', key),
  stop:   ()    => ipcRenderer.invoke('assistant:stop'),
  status: ()    => ipcRenderer.invoke('assistant:status'),

  // Logs
  subscribeLogs: (cb) => {
    const handler = (_e, line) => cb(line);
    ipcRenderer.on('log:line', handler);
    ipcRenderer.send('log:subscribe');
    return () => ipcRenderer.off('log:line', handler);
  },

  // Alerts
  testAlert: (payload) => ipcRenderer.invoke('alerts:test', payload),

  // simple local storage passthrough
  saveLocal: (k,v) => localStorage.setItem(k,v),
  loadLocal: (k)   => localStorage.getItem(k)
});

const { app, BrowserWindow, ipcMain, Notification, ipcRenderer } = require('electron');
const path = require('path');
const bridge = require('./bridge');

let win, splash;

function createWindow () {
  win = new BrowserWindow({
    width: 1280,
    height: 830,
    show: false,
    backgroundColor: '#0b1020',
    title: 'Medrunner Assistant',
    icon: path.join(__dirname, 'public', 'assets', 'icon.ico'),
    webPreferences: {
      contextIsolation: true,
      sandbox: false,
      preload: path.join(__dirname, 'preload.js'),
      webviewTag: true
    }
  });

  win.loadFile(path.join(__dirname, 'public', 'index.html'));

  splash = new BrowserWindow({
    width: 720,
    height: 420,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    center: true,
    skipTaskbar: true,
    webPreferences: {
      backgroundThrottling: false,
      contextIsolation: true,
      sandbox: false,
      preload: path.join(__dirname, 'public', 'splash-preload.js')
    }
  });

  splash.loadFile(path.join(__dirname, 'public', 'splash.html'));
}

ipcMain.on('splash:start-audio', () => {
  if (win && !win.isDestroyed()) {
    win.webContents.send('main:play-splash-audio');
  };
});

ipcMain.on('splash:ended', () => {
  if (splash && !splash.isDestroyed()) splash.close();
  if (win && !win.isDestroyed()) win.show();
})

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

/* ---------- IPC: API key check (main-process fetch avoids CORS) ---------- */
ipcMain.handle('api:validate', async (_e, key) => {
  const result = await bridge.validateApiKey(key);
  return result;
});


/* ---------- IPC: Assistant controls via bridge ---------- */
ipcMain.handle('assistant:start', async (_evt, key) => {
  return bridge.startAssistant(String(key || '').trim());
});

ipcMain.handle('assistant:stop',  async ()     => bridge.stopAssistant());
ipcMain.handle('assistant:status',async ()     => bridge.getStatus());

/* ---------- IPC: Logs subscription ---------- */
ipcMain.on('log:subscribe', (e) => {
  bridge.subscribeLogs((line) => {
    try { e.sender.send('log:line', line); } catch {}
  });
});

/* ---------- Optional: test alert ---------- */
ipcMain.handle('alerts:test', async (_e, { title, body }) => {
  if (Notification.isSupported()) new Notification({ title, body }).show();
  return true;
});

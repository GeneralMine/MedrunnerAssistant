const { app, BrowserWindow, ipcMain, Notification, globalShortcut } = require('electron');
const path = require('path');
const fs = require('fs');
const bridge = require('./bridge');

let win, splash;

function loadEnvFile(file = path.join(__dirname, '.env')) {
  try {
    const txt = fs.readFileSync(file, 'utf8');
    for (const rawLine of txt.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;
      const i = line.indexOf('=');
      if (i === -1) continue;
      const key = line.slice(0, i).trim();
      let val = line.slice(i + 1).trim().replace(/^['"]|['"]$/g, '');
      if (!(key in process.env)) process.env[key] = val;
    }
  } catch {  }
}
loadEnvFile();

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
});

function notifyAssistantNotRunning() {
  new Notification({
    title: 'Medrunner Assistant',
    body: 'Assistant is not running — please click "Start" within the Dashboard Tab first.'
  }).show();
}

app.whenReady().then(() => {
  createWindow();

  globalShortcut.register('Num0', () => {
    const child = bridge.getChildProcess();
    if (child && child.stdin && !child.killed) {
      child.stdin.write('status:0\n');
    } else {
      console.warn('[Hotkey] Assistant process is not running — cannot send status:0');
      notifyAssistantNotRunning();
    }
  });

  globalShortcut.register('Num1', () => {
    const child = bridge.getChildProcess();
    if (child && child.stdin && !child.killed) {
      child.stdin.write('status:1\n');
    } else {
      console.warn('[Hotkey] Assistant process is not running — cannot send status:1');
      notifyAssistantNotRunning();
    }
  });

  globalShortcut.register('Num2', () => {
    const child = bridge.getChildProcess();
    if (child && child.stdin && !child.killed) {
      child.stdin.write('status:2\n');
    } else {
      console.warn('[Hotkey] Assistant process is not running — cannot send status:2');
      notifyAssistantNotRunning();
    }
  });

  globalShortcut.register('Num3', () => {
    const child = bridge.getChildProcess();
    if (child && child.stdin && !child.killed) {
      child.stdin.write('status:3\n');
    } else {
      console.warn('[Hotkey] Assistant process is not running — cannot send status:3');
      notifyAssistantNotRunning();
    }
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

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

// bridge.js — spawns your assistant as a child process, pipes logs back to UI
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');
const { TokenManager } = require('@medrunner/api-client');

let child = null;
let running = false;
const subs = new Set();
function emit(line){ for (const fn of subs) { try{ fn(line) }catch{} } }

function resolveEntry(){
  const base = path.join(__dirname, 'core', 'MedrunnerAssistant-main');
  const candidates = [
    path.join(base, 'cli.js'),
    path.join(base, 'index.js'),
    path.join(base, 'dist', 'index.js'),
    path.join(base, 'main.js')
  ];
  for (const p of candidates) { if (fs.existsSync(p)) return p; }
  return null;
}

/*async function validateApiKey(key){
  // Quick HTTP ping. If your API needs different header/URL, tell me and I’ll swap this line.
  try {
    const token = String(key||'').trim();
    if (!token) return false;
    const res = await fetch('https://api.medrunner.space/auth/apiTokens', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.ok; // 200/204 => valid
  } catch {
    return false;
  }
}*/

async function validateApiKey(key) {
  const token = String(key || '').trim();
  if (!token) return false

  try {
    const tm = new TokenManager({ 
      accessToken: token,
      baseUrl: 'https://api.medrunner.space',
      cookieAuth: false
    });
    const result = await tm.getAccessToken("validation");
    return typeof result === "string";
  } catch (err) {
    console.error('[Bridge] TokenManager threw an error:', err);
    return false;
  }
}

async function startAssistant(key){
  if (running) return { ok:true, already:true };

  const entry = resolveEntry();
  if (!entry){
    emit('[error] Could not find an entry file in core/MedrunnerAssistant-main (tried cli.js, index.js, dist/index.js, main.js)');
    return { ok:false, error:'entry-not-found' };
  }

  const env = {
    ...process.env, 
    MEDRUNNER_API_KEY: String(key || '').trim(),
    ELECTRON_RUN_AS_NODE: '1'
  };

  // Spawn with Node; add CLI args here if your assistant expects them.
  child = spawn(process.execPath, [entry], {
    cwd: path.dirname(entry),
    env,
    stdio: ['pipe', 'pipe', 'pipe']
  });

  child.stdout.on('data', d => emit(String(d).trimEnd()));
  child.stderr.on('data', d => emit(String(d).trimEnd()));
  child.on('exit', (code, sig) => {
    emit(`[assistant] exited (code=${code} sig=${sig||''})`);
    running = false;
    child = null;
  });

  running = true;
  emit('[assistant] started');
  return { ok:true };
}

async function stopAssistant(){
  if (!running || !child) return { ok:true, already:true };
  try { child.kill(); } catch {}
  running = false;
  child = null;
  emit('[assistant] stopped');
  return { ok:true };
}

function getStatus(){ return { running }; }

function subscribeLogs(cb){
  subs.add(cb);
  cb('[log] subscription ready');
  return () => subs.delete(cb);
}

function getChildProcess() {
  return child;
};

module.exports = {
  validateApiKey,
  startAssistant,
  stopAssistant,
  getStatus,
  subscribeLogs,
  getChildProcess
};

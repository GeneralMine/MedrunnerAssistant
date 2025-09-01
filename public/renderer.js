// Tab switching
const tabs = {
  portal:   { btn: 'tab-portal',    pane: 'pane-portal' },
  dash:     { btn: 'tab-dashboard', pane: 'pane-dashboard' },
  settings: { btn: 'tab-settings',  pane: 'pane-settings' },
  logs:     { btn: 'tab-logs',      pane: 'pane-logs' }
};

function show(which){
  Object.values(tabs).forEach(({btn,pane}) => {
    document.getElementById(btn).classList.remove('active');
    document.getElementById(pane).classList.add('hidden');
  });
  document.getElementById(tabs[which].btn).classList.add('active');
  document.getElementById(tabs[which].pane).classList.remove('hidden');
}

// Default: Staff Portal
show('portal');

document.getElementById('tab-portal').addEventListener('click',   ()=>show('portal'));
document.getElementById('tab-dashboard').addEventListener('click',()=>show('dash'));
document.getElementById('tab-settings').addEventListener('click', ()=>show('settings'));
document.getElementById('tab-logs').addEventListener('click',     ()=>show('logs'));

// Helper
const $ = s => document.querySelector(s);

// Sounds
function storeAudio(inputEl, key){
  const f = inputEl.files?.[0];
  if (!f) return;
  const url = URL.createObjectURL(f);
  localStorage.setItem(key, url);
}
$('#notifFile').addEventListener('change', ()=>storeAudio($('#notifFile'),'sound:notif'));
$('#pingFile' ).addEventListener('change', ()=>storeAudio($('#pingFile'), 'sound:ping'));
$('#notifPreview').addEventListener('click', ()=>{ const u=localStorage.getItem('sound:notif'); if(u) new Audio(u).play(); });
$('#pingPreview' ).addEventListener('click', ()=>{ const u=localStorage.getItem('sound:ping');  if(u) new Audio(u).play(); });
$('#notifClear').addEventListener('click', ()=>localStorage.removeItem('sound:notif'));
$('#pingClear' ).addEventListener('click', ()=>localStorage.removeItem('sound:ping'));

$('#btnTestAlert').addEventListener('click', async ()=>{
  const u = localStorage.getItem('sound:notif') || localStorage.getItem('sound:ping');
  if (u) new Audio(u).play();
  await window.assistant.testAlert({ title:'Medrunner Assistant', body:'This is a test alert.' });
});

// API (Settings)
const apiKeyInput = $('#apiKey');
const statusEl    = $('#apiStatus');
function setStatus(mode, text){
  statusEl.classList.remove('status--idle','status--checking','status--ok','status--bad');
  statusEl.classList.add(mode);
  statusEl.querySelector('.label').textContent = text;
  statusEl.title = text;
}
const saved = window.assistant.loadLocal('mr_api_key') || '';
if (saved) apiKeyInput.value = saved;

$('#btnSaveApi').addEventListener('click', ()=>{
  const key = apiKeyInput.value.trim();
  window.assistant.saveLocal('mr_api_key', key);
  setStatus('status--idle', 'Saved — Not checked');
});
$('#btnCheckApi').addEventListener('click', async ()=>{
  const key = apiKeyInput.value.trim();
  if (!key){ setStatus('status--bad','Invalid Key (empty)'); return; }
  setStatus('status--checking','Checking…');
  try {
    const ok = await window.assistant.validateKey(key);
    setStatus(ok ? 'status--ok' : 'status--bad', ok ? 'Connected' : 'Invalid Key');
  } catch {
    setStatus('status--bad','Invalid Key');
  }
});

// Dashboard: Start/Stop using saved key
const statusTxt = $('#statusTxt');
$('#btnStart').addEventListener('click', async ()=>{
  const key = (apiKeyInput?.value || window.assistant.loadLocal('mr_api_key') || '').trim();
  const res = await window.assistant.start(key);
  statusTxt && (statusTxt.textContent = res.ok ? 'running' : `error: ${res.error||'unknown'}`);
});
$('#btnStop').addEventListener('click', async ()=>{
  const res = await window.assistant.stop();
  statusTxt && (statusTxt.textContent = res.ok ? 'stopped' : `error: ${res.error||'unknown'}`);
});
// Poll status
(async function poll(){
  try {
    const s = await window.assistant.status();
    statusTxt && (statusTxt.textContent = s?.running ? 'running' : 'idle');
  } catch {}
  setTimeout(poll, 2000);
})();

// Logs
const logsEl = $('#logs');
window.assistant.subscribeLogs((line)=>{
  logsEl.textContent += line + '\n';
  logsEl.scrollTop = logsEl.scrollHeight;
});

const em = new Map();

const toDate = v => (v == null ? null : (typeof v === "number" ? new Date(v) : new Date(v)));

function formattedTime(date) {
  if (!date) return "unknown";
  return date.toLocaleString("en-GB", { hour12: false });
}

function formattedDuration(ms) {
  if (ms == null || isNaN(ms)) return "n/a";
  const s = Math.max(0, Math.floor(ms / 1000));
  const hh = String(Math.floor(s / 3600)).padStart(2, "0");
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

function ensure(emId) {
  if (!em.has(emId)) em.set(emId, { createdAt: null, acceptedAt: null, completedAt: null, logged: false });
  return em.get(emId);
}

export function onEmergencyCreate(e) {
  const s = ensure(e.id);
  s.createdAt = s.createdAt || toDate(e.creationTimestamp ?? e.created);
}

export function onEmergencyUpdate(e) {
  const s = ensure(e.id);

  s.createdAt  = s.createdAt  || toDate(e.creationTimestamp ?? e.created);
  s.acceptedAt = s.acceptedAt || toDate(e.acceptedTimestamp);
  s.completedAt = s.completedAt || toDate(e.completionTimestamp);

  if (!s.completedAt || s.logged) return;

  const responseDur = (s.createdAt && s.acceptedAt) ? formattedDuration(s.acceptedAt - s.createdAt) : "n/a";
  const totalDur    = (s.createdAt && s.completedAt) ? formattedDuration(s.completedAt - s.createdAt) : "n/a";

  console.log([
    `\n[SUMMARY] Emergency ${e.id} — "${e.missionName}"`,
    `  Emergency Call Created:   ${formattedTime(s.createdAt)}`,
    `  Team Deployed At:         ${formattedTime(s.acceptedAt)}  (response: ${responseDur})`,
    `  Team Returned to Base At: ${formattedTime(s.completedAt)}  (total: ${totalDur})`,
  ].join("\n"));

  s.logged = true;
}

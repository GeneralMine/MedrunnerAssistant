// Just using in-memory storage for mission data right now.
const em = new Map();

// Here I am converting the input to a Date object or returning 'null' if the input is invalid. (I think canceled / aborted missions cause a null - I haven't added guard cases for this yet)
const toDate = v => (v == null ? null : (typeof v === "number" ? new Date(v) : new Date(v)));

// This just returns a readable UTC string or 'unknown' if no date is provided. 
// I did originally have return date.toLocaleString("en-GB", { hour12: false }); so that users could change their own times. But I think UTC is just generally better and can be improved later.
function formattedTime(date) {
  if (!date) return "unknown";
  return date.toUTCString(); 
}

// Just converting milliseconds into hh:mm:ss format. Nothing special.
// I think there is an easier way of doing this, but I just converted this from an old python project and turned it into JS...
function formattedDuration(ms) {
  if (ms == null || isNaN(ms)) return "n/a";
  const s = Math.max(0, Math.floor(ms / 1000));
  const hh = String(Math.floor(s / 3600)).padStart(2, "0");
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

// This ensures that our map has an entry for a given emergency ID. If it doesn't, it just initialises it.
function ensure(emId, teamLeadId = null) {
  if (!em.has(emId)) em.set(emId, { createdAt: null, acceptedAt: null, completedAt: null, logged: false, teamLeadId });
  return em.get(emId);
}

// Handler for when an emergency is created.
export function onEmergencyCreate(e, teamLeadId) {
  const s = ensure(e.id, teamLeadId);
  s.teamLeadId = s.teamLeadId || teamLeadId;
  s.createdAt = s.createdAt || toDate(e.creationTimestamp ?? e.created);
}

// Handler for when an emergency is updated.
export function onEmergencyUpdate(e, teamLeadId) {
  const s = ensure(e.id);

  // Guard clause: skip if this emergency doesn't belong to this team lead
  if (s.teamLeadId && s.teamLeadId !== teamLeadId) return;

  // If the timestamps haven't already been set, we fill in timestamps.
  s.createdAt  = s.createdAt  || toDate(e.creationTimestamp ?? e.created);
  s.acceptedAt = s.acceptedAt || toDate(e.acceptedTimestamp);
  s.completedAt = s.completedAt || toDate(e.completionTimestamp);

  // exit early if the emergency isn't completed or has already been logged.
  if (!s.completedAt || s.logged) return;

  // Here I am just calculating durations from creation to acceptance and to completion.
  const responseDur = (s.createdAt && s.acceptedAt) ? formattedDuration(s.acceptedAt - s.createdAt) : "n/a";
  const totalDur    = (s.createdAt && s.completedAt) ? formattedDuration(s.completedAt - s.createdAt) : "n/a";

  // Finally, here is the final console output of the emergency's overall lifecycle. 
  console.log([
    `\n[SUMMARY] Emergency ${e.id} — "${e.missionName}"`,
    `  Emergency Call Created:   ${formattedTime(s.createdAt)}`,
    `  Team Deployed At:         ${formattedTime(s.acceptedAt)}  (response: ${responseDur})`,
    `  Team Returned to Base At: ${formattedTime(s.completedAt)}  (total: ${totalDur})`,
  ].join("\n"));

  s.logged = true;

  // Deleting the mission from the map to prevent any risk of memory leak and stale data etc etc.
  em.delete(e.id);
}

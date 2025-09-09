const timestamps = {
  alertReceived: null,
  mustered: null,
  onGrid: null,
  rtb: null
};

const MS_PER_MIN = 60_000;
const formattedTime = (ms, digits = 2) => (ms / MS_PER_MIN).toFixed(digits);

function handleStatusInput(code) {
  const now = new Date();
  if (code === '0') {
    timestamps.alertReceived = now;
    console.log(`[Alert Received] ${now.toLocaleTimeString()} - Alert Recieved and Team Mustering`);
  } else if (code === '1') {
    timestamps.mustered = now;
    console.log(`[MUSTERED] ${now.toLocaleTimeString()} - Team Mustered and Deployed`);
  } else if (code === '2') {
    timestamps.onGrid = now;
    console.log(`[ON-GRID] ${now.toLocaleTimeString()} - Team on Grid and With Client`);
  } else if (code == '3') {
    timestamps.rtb = now;
    console.log(`[RTB] ${now.toLocaleTimeString()} - Team RTB'd to Pyro Gateway`);
    logSummary();
  };
};

function logSummary() {
  const { alertReceived, mustered, onGrid, rtb} = timestamps;
  const summary = [];

  if (alertReceived && mustered) {
    const alertToMuster = formattedTime(mustered - alertReceived);
    summary.push(`-> Alert Recieved and Team Mustering: ${alertToMuster} minutes`);
  }
  if (mustered && onGrid) {
    const toGrid = formattedTime(onGrid - mustered);
    summary.push(`-> Time from Mustering to On Grid: ${toGrid} minutes`);
  };

  if (onGrid && rtb) {
    const toRTB = formattedTime(rtb - onGrid);
    summary.push(`-> Time From On Grid To RTB: ${toRTB} minutes`);
  };

  if (mustered && rtb) {
    const total = formattedTime(rtb - mustered);
    summary.push(`-> Total Response Time: ${total} minutes`);
  };

  console.log(`--- Response Summary ---\n${summary.join('\n')}`);
};

export { handleStatusInput };
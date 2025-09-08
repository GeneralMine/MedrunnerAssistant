import dotenv from "dotenv";
dotenv.config({ quiet: true });

import { getApi, getSelf, getWebSocket } from "./lib/medrunnerAPI.js";

import { handleStatusInput } from "./features/trackLeadResponseTime.js";
import { customAlertSound } from "./features/customAlertSound.js";
import { customChatMessageSound } from "./features/customChatMessageSound.js";
import { customTeamJoinSound } from "./features/customTeamJoinSound.js";
import { printTeamJoinOrder } from "./features/printTeamJoinOrder.js";
import { setup as setupDiscordStatus, callback as discordStatusCallback, event as discordStatusEvent } from "./features/discordStatus.js";

import readline from "readline";

const api = getApi();
const self = getSelf();
const ws = getWebSocket();

// Add event listeners for the WebSocket

if (process.env.ENABLE_CUSTOM_ALERT_SOUND === "true") {
	ws.on("EmergencyCreate", customAlertSound);
}

if (process.env.ENABLE_CUSTOM_CHATMESSAGE_SOUND === "true") {
	ws.on("ChatMessageCreate", customChatMessageSound);
}

if (process.env.ENABLE_CUSTOM_TEAMJOIN_SOUND === "true") {
	ws.on("TeamUpdate", customTeamJoinSound);
}

if (process.env.ENABLE_PRINT_TEAMJOINORDER === "true") {
	ws.on("TeamUpdate", printTeamJoinOrder);
}

if (process.env.ENABLE_DISCORD_STATUS === "true") {
  await setupDiscordStatus();
  ws.on(discordStatusEvent, discordStatusCallback);
}

ws.onreconnected(async () => {
	console.log("Reconnected to the WebSocket");

  if (process.env.ENABLE_DISCORD_STATUS === "true") {
    try { await setupDiscordStatus(); } catch {}
  }
});

ws.onclose(async () => {
	console.log("Connection has been lost");
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on("line", (line) => {
  if (line.startsWith("status:")) {
    const code = line.split(":")[1].trim();
    handleStatusInput(code);
  }
});
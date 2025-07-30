import dotenv from "dotenv";
dotenv.config({quiet: true});

import { getApi, getSelf, getWebSocket } from "./lib/medrunnerAPI.js";
import { updateDiscordStatus, setupDiscordAPI } from "./features/discordStatus.js";

import { customAlertSound } from "./features/customAlertSound.js";
import { customChatMessageSound } from "./features/customChatMessageSound.js";
import { customTeamJoinSound } from "./features/customTeamJoinSound.js";
import { printTeamJoinOrder } from "./features/printTeamJoinOrder.js";

const api = getApi();
const self = getSelf();
const ws = getWebSocket();

await setupDiscordAPI();

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
	ws.on("TeamUpdate", updateDiscordStatus);
}

ws.onreconnected(async () => {
	console.log("Reconnected to the WebSocket");
});

ws.onclose(async () => {
	console.log("Connection has been lost");
});

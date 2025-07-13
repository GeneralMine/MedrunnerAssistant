import dotenv from "dotenv";
dotenv.config();

import { MedrunnerApiClient } from "@medrunner/api-client";
import { playAudio } from "./playAudio.js";

const apiConfig = {
	refreshToken: process.env.TOKEN,
};

const api = MedrunnerApiClient.buildClient(apiConfig);

const self = await api.client.get();

console.log("Authenticated as " + self.data.rsiHandle);

// Initialize the websocket connection
const ws = await api.websocket.initialize();
await ws.start();

console.log("Socket is " + ws.state);

// Add event listeners for the WebSocket

if (process.env.ENABLE_ALERTS === "true") {
	ws.on("EmergencyCreate", async (alert) => {
		console.log("New alert received: " + JSON.stringify(alert));

		try {
			await playAudio(process.env.ALERT_SOUND);
			console.log("Playback finished for alert.");
		} catch (e) {
			console.error("Failed to play audio:", e);
		}
	});
}

if (process.env.ENABLE_CHATMESSAGE === "true") {
	ws.on("ChatMessageCreate", async (chatMessage) => {
	
		console.log("New chat message received: " + JSON.stringify(chatMessage));
		
		if(process.env.USERID != chatMessage.senderId){
			try {
				await playAudio(process.env.CHATMESSAGE_SOUND);
				console.log("Playback finished for chatmessage.");
			} catch (e) {
				console.error("Failed to play audio:", e);
			}
		}
	});
}

if (process.env.ENABLE_TEAMUPDATE === "true") {
	ws.on("TeamUpdate", async (teamUpdate) => {
	
		console.log("New team update received: " + JSON.stringify(teamUpdate));
		
//		if(teamUpdate.waitList && teamUpdate.waitList.length > 0){
			teamUpdate.waitList.forEach(element => {
				console.log(element.rsiHandle + " has requested to join the team");
				console.log("After accepting this request, the team will be " + (teamUpdate.members.length+1) + " people big")
			});
			try {
				await playAudio(process.env.TEAMUPDATE_SOUND);
				console.log("Playback finished for teamupdate.");
			} catch (e) {
				console.error("Failed to play audio:", e);
			}
//		}
	});
}

ws.onreconnected(async () => {
	console.log("Reconnected to the WebSocket");
});

ws.onclose(async () => {
	console.log("Connection has been lost");
});

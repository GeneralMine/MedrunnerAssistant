import { getSelf } from "../lib/medrunnerAPI.js";
import { playAudio } from "../lib/playAudio.js";

export const event = "ChatMessageCreate";

export const name = "Custom_ChatMessage_Sound";

export async function callback(chatMessage) {
	if (process.env.DEBUG_MODE === "true") {
		console.log("New chat message received: " + JSON.stringify(chatMessage.contents));
		console.log(JSON.stringify(teamUpdate, null, 4));
	}

	const self = await getSelf();

	if (self.data.id !== chatMessage.senderId && self.data.activeClass == 4) {
		try {
			await playAudio(process.env.CUSTOM_CHATMESSAGE_SOUND);
			console.log("Playback finished for chatmessage.");
		} catch (e) {
			console.error("Failed to play audio:", e);
		}
	}
}

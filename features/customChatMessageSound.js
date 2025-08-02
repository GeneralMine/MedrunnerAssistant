import { getSelf } from "../lib/medrunnerAPI.js";
import { playAudio } from "./playAudio.js";

export async function customChatMessageSound(chatMessage) {
	if (process.env.DEBUG_MODE === "true") {
		console.log("New chat message received: " + JSON.stringify(chatMessage.contents));
	}

	const self = await getSelf();

	if (self.data.id !== chatMessage.senderId) {
		try {
			await playAudio(process.env.CUSTOM_CHATMESSAGE_SOUND);
			console.log("Playback finished for chatmessage.");
		} catch (e) {
			console.error("Failed to play audio:", e);
		}
	}
}

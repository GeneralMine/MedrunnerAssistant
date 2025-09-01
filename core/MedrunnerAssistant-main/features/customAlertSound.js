import { playAudio } from "./playAudio.js";

export async function customAlertSound(alert) {
	if (process.env.DEBUG_MODE === "true") {
		console.log("New alert received: " + alert.missionName);
	}

	try {
		await playAudio(process.env.CUSTOM_ALERT_SOUND);
		console.log("Playback finished for alert.");
	} catch (e) {
		console.error("Failed to play audio:", e);
	}
}

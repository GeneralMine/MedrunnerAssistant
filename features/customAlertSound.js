import { playAudio } from "./playAudio.js";

export async function customAlertSound(alert) {
	if (process.env.DEBUG_MODE === "true") {
		console.log("New alert received: " + alert.missionName);
	}

	// Don't play the sound if the alert is an academy lesson
	if (alert.origin === 3) {
		return;
	}

	try {
		await playAudio(process.env.CUSTOM_ALERT_SOUND);
		console.log("Playback finished for alert.");
	} catch (e) {
		console.error("Failed to play audio:", e);
	}
}

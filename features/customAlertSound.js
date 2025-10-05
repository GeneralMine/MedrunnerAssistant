import { playAudio } from "../lib/playAudio.js";

export const event = "EmergencyCreate";

export const name = "Custom_Alert_Sound";

export async function callback(alert) {
	if (process.env.DEBUG_MODE === "true") {
		console.log("New alert received: " + alert.missionName);
		console.log(JSON.stringify(teamUpdate, null, 4));
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

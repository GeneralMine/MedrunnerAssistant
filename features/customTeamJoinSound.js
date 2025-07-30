import { getSelf } from "../lib/medrunnerAPI.js";
import { playAudio } from "./playAudio.js";

export async function customTeamJoinSound(teamUpdate) {
	if (process.env.DEBUG_MODE === "true") {
		console.log("TeamJoinSound: New team update received");
	}

	const self = await getSelf();

	if (self.data.activeClass == 4 && self.data.activeTeam == teamUpdate.id) {
		if (teamUpdate.waitList && teamUpdate.waitList.length > 0) {
			teamUpdate.waitList.forEach((element) => {
				console.log(element.rsiHandle + " has requested to join the team");
				console.log("After accepting this request, the team will be " + (teamUpdate.members.length + teamUpdate.waitList.length) + " people big");
			});
			try {
				await playAudio(process.env.CUSTOM_TEAMJOIN_SOUND);
				console.log("Playback finished for teamupdate.");
			} catch (e) {
				console.error("Failed to play audio:", e);
			}
		}
	}
}

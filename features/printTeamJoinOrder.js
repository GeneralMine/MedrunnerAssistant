import { getSelf } from "../lib/medrunnerAPI.js";

export const event = "TeamUpdate";

export const name = "Print_TeamJoinOrder";

export async function callback(teamUpdate) {
	console.log("--- Team Join Order ---");
	if (process.env.DEBUG_MODE === "true") {
		console.log("TeamJoinOrder: New team update received");
		console.log(JSON.stringify(teamUpdate, null, 4));
	}

	const self = await getSelf();

	if (self.data.activeClass == 4 && self.data.activeTeam == teamUpdate.id) {
		let i = 1;
		teamUpdate.members.forEach((element) => {
			console.log(i + ". " + element.rsiHandle);
			i++;
		});
	}
}

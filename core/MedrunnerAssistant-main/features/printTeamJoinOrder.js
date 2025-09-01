import { getSelf } from "../lib/medrunnerAPI.js";

export async function printTeamJoinOrder(teamUpdate) {
	if (process.env.DEBUG_MODE === "true") {
		console.log("TeamJoinOrder: New team update received");
	}

	const self = await getSelf();

	if (self.data.activeClass == 4 && self.data.activeTeam == teamUpdate.id) {
		console.log("Current join order for your team is:");
		let i = 1;
		teamUpdate.members.forEach((element) => {
			console.log(i + ". " + element.rsiHandle);
			i++;
		});
	}
}

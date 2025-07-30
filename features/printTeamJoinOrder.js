export async function printTeamJoinOrder(teamUpdate) {
	if (process.env.DEBUG_MODE === "true") {
		console.log("New team update received");
	}

	if (self.data.activeClass == 4 && self.data.activeTeam == teamUpdate.id) {
		console.log("Current join order for your team is:");
		let i = 1;
		teamUpdate.members.forEach((element) => {
			console.log(i + ". " + element.rsiHandle);
			i++;
		});
	}
}

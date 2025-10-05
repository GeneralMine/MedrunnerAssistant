let teamMap = {};

export function updateTeamOnMap(team) {
	teamMap[team.id] = team;
	console.log(`Team ${team.teamName} updated.`);
}

export function removeTeamFromMap(team) {
	delete teamMap[team.id];
	console.log(`Team ${team.teamName} removed.`);
}

export function getTeamPosition(id) {
	const teamOrderList = [];
	for (const [id, team] of Object.entries(teamMap)) {
		teamOrderList.push({ id: id, order: team.order });
	}
	teamOrderList.sort((a, b) => a.order - b.order);
	for (let index = 0; index < teamOrderList.length; index++) {
		const element = teamOrderList[index];
		if (element.id === id) {
			return index + 1;
		}
	}
	return null; // Team not found
}

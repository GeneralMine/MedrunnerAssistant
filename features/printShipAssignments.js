import { getCurrentHammertimeAgo } from "../lib/hammertime.js";
import { getSelf } from "../lib/medrunnerAPI.js";

export const event = "TeamUpdate";

export const name = "Print_ShipAssignments";

export async function callback(teamUpdate) {
	if (process.env.DEBUG_MODE === "true") {
		console.log("ShipAssignments: New team update received");
		console.log(JSON.stringify(teamUpdate, null, 4));
	}

	const self = await getSelf();

	if (self.data.activeClass == 4 && self.data.activeTeam == teamUpdate.id) {
		console.log("--- Ship Assignments ---");
		const pilot = teamUpdate.members.find((member) => member.class == 3) || self;
		const medics = teamUpdate.members.filter((member) => member.class == 1) || [];
		const lead = teamUpdate.members.find((member) => member.class == 4) || self;
		const securities = teamUpdate.members.filter((member) => member.class == 2) || [];
		const cap = teamUpdate.members.filter((member) => member.class == 9) || [];

		console.log(`# **__Ship Assignments__**
*Updated: ${getCurrentHammertimeAgo()}*
__**Gunship**__ *${pilot.rsiHandle} Hangar*
:MRS_Pilot:  -  ${pilot.rsiHandle}
:MRS_Teamlead:  -  ${lead.rsiHandle}`);
		if (medics.length >= 2) console.log(`:MRS_Medical:  -  ${medics[1].rsiHandle}`);
		if (securities.length >= 1) console.log(`:MRS_Security:  -  ${securities[0].rsiHandle}`);
		if (securities.length >= 2) console.log(`:MRS_Security:  -  ${securities[1].rsiHandle}`);

		console.log(`
__**Medship**__ *${medics[0].rsiHandle} Hangar*
:MRS_Medical:  -  ${medics[0].rsiHandle}`);
		if (securities.length >= 3) console.log(`:MRS_Security:  -  ${securities[2].rsiHandle}`);

		if (cap.length >= 1) {
			console.log("\n__**Combat Aerospace Patrol**__");
			console.log(`:CAP:  -  ${cap[0].rsiHandle}`);
		}
		if (cap.length >= 2) console.log(`:CAP:  -  ${cap[1].rsiHandle}`);
	}
}

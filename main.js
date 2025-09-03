import dotenv from "dotenv";
dotenv.config({ quiet: true });

import { getApi, getSelf, getWebSocket } from "./lib/medrunnerAPI.js";
import fs from "fs";
import path from "path";

const api = getApi();
const self = getSelf();
const ws = getWebSocket();

ws.onreconnected(async () => {
	console.log("MedrunnerSocket: Reconnected to the WebSocket");
});

ws.onclose(async () => {
	console.log("MedrunnerSocket: Connection has been lost");
});

// Load features and add them to websockets event listeners

const __dirname = path.dirname(".");

const files = fs.readdirSync(path.join(__dirname, "features"));

for (const file of files) {
	if (file.endsWith(".js")) {
		const module = await import(`./features/${file}`);
		if (process.env["ENABLE_" + module.name.toUpperCase()] === "true") {
			if (module.setup) {
				await module.setup();
			}
			if (module.event && module.callback) {
				ws.on(module.event, module.callback);
				console.log(`Registered event listener ${module.name} for ${module.event} from ${file}`);
			}
		}
	}
}

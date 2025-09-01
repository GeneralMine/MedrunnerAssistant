import dotenv from "dotenv";
dotenv.config({ quiet: true });

/**
 * Initialize the Medrunner API client
 */
import { MedrunnerApiClient } from "@medrunner/api-client";

const apiConfig = {
	refreshToken: process.env.MEDRUNNER_TOKEN,
};

const api = MedrunnerApiClient.buildClient(apiConfig);

let self = await api.client.get();

console.log("MedrunnerAPI: Authenticated as " + self.data.rsiHandle);

export function getApi() {
	return api;
}

export async function getSelf() {
	self = await api.client.get();
	return self;
}

// Initialize the websocket connection
const ws = await api.websocket.initialize();
await ws.start();

console.log("MedrunnerSocket: " + ws.state);

export function getWebSocket() {
	return ws;
}

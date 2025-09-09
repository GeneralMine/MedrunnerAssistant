export function getCurrentHammertimeAgo() {
	return `<t:${Math.floor(Date.now() / 1000)}:R>`;
}

// playAudio.js
import { exec } from "child_process";
import path from "path";

export function playAudio(filePath) {
	return new Promise((resolve, reject) => {
		const fullPath = path.resolve(filePath);

		// PowerShell command to play audio synchronously
		const command = `powershell -c (New-Object Media.SoundPlayer '${fullPath}').PlaySync();`;

		exec(command, (err, stdout, stderr) => {
			if (err) {
				console.error("PowerShell error:", stderr);
				reject(err);
			} else {
				resolve();
			}
		});
	});
}

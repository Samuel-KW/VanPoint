import { Addon } from "../../../addons/Addon";
import type AddonManager from "../../../core/manager";
import "./loader.css";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface AddonMap {
	[id: string]: (new () => Addon)[];
}

// Register and enable all addons
export async function loadInitialAddons(manager: AddonManager, addons: AddonMap, debug = false) {
	
	const container = document.createElement("div");
	const progressHeader = document.createElement("h3");
	const progressDetails = document.createElement("h4")
	const progressBar = document.createElement("progress");

	container.classList.add("load-container");
	container.appendChild(progressHeader);
	container.appendChild(progressDetails);
	container.appendChild(progressBar);
	document.body.appendChild(container);
	
	// Each addon has register and enable operations
	progressBar.value = 0;
	progressBar.max = Object.values(addons)
		.reduce((sum, array) => sum + array.length, 0) * 2; 

	const start = Date.now();

	for (const [category, addonArray] of Object.entries(addons)) {
		
		if (category === "debug" && !debug) {
			continue; // Skip debug addons if not in debug mode
		}

		progressHeader.textContent = `Loading ${category} addons...`;

		for (const addonClass of addonArray) {
			const addon = new addonClass();

			progressDetails.textContent = `[1/2] Enabling ${addon.name}`;
			await manager.register(addon);
			progressBar.value += 1;
			if (debug) await sleep(100);

			progressDetails.textContent = `[2/2] Enabling ${addon.name}`;
			await manager.enable(addon);
			progressBar.value += 1;
			if (debug) await sleep(100);
		}
	}

	progressHeader.textContent = "Finished loading!";
	progressDetails.textContent = `Took ${Math.round((Date.now() - start) / 10) / 100}s`;
	progressBar.value = progressBar.max;

	container.style.animation = "fade-out 1s ease-in-out forwards 1s";
	await sleep(3000);

	container.remove();
}
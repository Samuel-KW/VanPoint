import { Addon } from "../../../addons/Addon";
import type AddonManager from "../../../core/manager";
import "./loader.css";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface AddonMap {
	[id: string]: (new () => Addon)[];
}

const progressHeader = document.getElementById("load-header") as HTMLElement;
const progressDetails = document.getElementById("load-details") as HTMLElement
const progressBar = document.getElementById("load-progress") as HTMLProgressElement;

// Register and enable all addons
export async function loadInitialAddons(manager: AddonManager, addons: AddonMap, debug = false) {
	
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
			if (debug) await sleep(1000);

			progressDetails.textContent = `[2/2] Enabling ${addon.name}`;
			await manager.enable(addon);
			progressBar.value += 1;
			if (debug) await sleep(1000);
		}
	}

	progressHeader.textContent = "Finished loading!";
	progressDetails.textContent = `Took ${Math.round((Date.now() - start) / 10) / 100}s`;
	progressBar.value = progressBar.max;
}
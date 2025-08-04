import { Addon } from "../../../addons/Addon";
import type AddonManager from "../../../core/manager";
import "./loader.css";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const debugDelay = false;

interface AddonMap {
	[id: string]: (new () => Addon)[];
}

interface AddonInstanceMap {
	[id: string]: Addon[];
}

// Register and enable all addons
export async function loadInitialAddons(manager: AddonManager, addons: AddonMap, debug = false) {
	const instanceMap: AddonInstanceMap = {};
	
	const container = document.getElementById("load-container") as HTMLDivElement;
	const progressHeader = document.getElementById("load-header") as HTMLHeadingElement;
	const progressDetails = document.getElementById("load-details") as HTMLHeadingElement;
	const progressBar = document.getElementById("load-progress") as HTMLProgressElement;
	
	// Each addon has register and enable operations
	progressBar.max = Object.values(addons)
		.reduce((sum, array) => sum + array.length, 0) * 2; 

	const start = Date.now();

	for (const [category, addonArray] of Object.entries(addons)) {
		
		instanceMap[category] = [];
		if (category === "debug" && !debug) {
			continue; // Skip debug addons if not in debug mode
		}

		progressHeader.textContent = `Loading ${category} addons...`;

		for (const addonClass of addonArray) {
			const addon = new addonClass();

			progressDetails.textContent = `[1/2] Enabling ${addonClass.name}`;
			await manager.register(addon);
			progressBar.value += 1;
			if (debug && debugDelay) await sleep(debugDelay);

			progressDetails.textContent = `[2/2] Enabling ${addonClass.name}`;
			await manager.enable(addon);
			progressBar.value += 1;
			if (debug && debugDelay) await sleep(debugDelay);

			instanceMap[category].push(addon);
		}
	}

	progressHeader.textContent = "Finished loading!";
	progressDetails.textContent = `Took ${Math.round((Date.now() - start) / 10) / 100}s`;
	progressBar.value = progressBar.max;

	container.style.pointerEvents = "none";
	container.style.animation = "fade-out 1s ease-in-out forwards 0.5s";
	setTimeout(() => container.remove(), 3000);

	return instanceMap;
}
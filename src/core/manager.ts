import type { Addon } from "../addons/Addon";
import type { AddonContext } from "./context";
import { EventBus } from "./events";

export class AddonManager {
	private addons: Addon[] = [];
	private context: AddonContext;

	constructor() {
		this.context = {
			viewport: {
				scene: null,
				camera: null,
				renderer: null
			},
			ui: {
				toolbar: document.getElementById("toolbar") as HTMLDivElement,
				propertyPanel: document.getElementById("property-panel") as HTMLDivElement,
			},
			events: new EventBus()
		}
	}

	/**
	 * Register an addon
	 * @remarks This method will call the `onRegister` method of the addon
	 * @param addon The addon to register
	 */
	async register(addon: Addon) {
		try {
			if (typeof addon.onRegister === "function") {
				await addon.onRegister(this.context);
				this.addons.push(addon);
			}
			console.log(`[Addon] Registered: ${addon.name}`);
		} catch (e) {
			console.error(`[Addon] Failed to register: ${addon.name}`, e);
		}
	}

	/**
	 * Remove an addon
	 * @remarks This method will call the `onDestroy` method of the addon
	 * @param addon The addon to remove
	 */
	async remove(addon: Addon) {
		try {
			if (typeof addon.onDestroy === "function") {
				await addon.onDestroy(this.context);
				this.addons = this.addons.filter(a => a.id !== addon.id);
			}
			console.log(`[Addon] Removed: ${addon.name}`);
		} catch (e) {
			console.error(`[Addon] Failed to remove: ${addon.name}`, e);
		}
		console.log(`[Addon] Removed: ${addon.name}`);
	}

	/**
	 * Enable an addon
	 * @remarks This method will call the `onEnable` method of the addon
	 * @param addon The addon to enable
	 */
	async enable(addon: Addon) {
		try {
			if (typeof addon.onEnable === "function") {
				await addon.onEnable(this.context);
			}
		} catch (e) {
			console.error(`[Addon] Failed to enable: ${addon.name}`, e);
		}
	}

	/**
	 * Disable an addon
	 * @remarks This method will call the `onDisable` method of the addon
	 * @param addon The addon to disable
	 */
	async disable(addon: Addon) {
		try {
			if (typeof addon.onDisable === "function") {
				await addon.onDisable(this.context);
			}
		} catch (e) {
			console.error(`[Addon] Failed to disable: ${addon.name}`, e);
		}
	}

	/**
	 * Enable all addons
	 * @remarks This method will call the `onEnable` method of each addon
	 */
	async enableAll() {
		for (const addon of this.addons) {
			await this.enable(addon);
		}
	}

	/**
	 * Disable all addons
	 * @remarks This method will call the `onDisable` method of each addon
	 */
	async disableAll() {
		for (const addon of this.addons) {
			await this.disable(addon);
		}
	}

	/**
	 * List all registered addons
	 * @returns An array of addon names
	 */
	listAddons(): string[] {
		return this.addons.map(a => a.name ?? "Unknown Addon");
	}
}
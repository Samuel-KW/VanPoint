import { Scene, PerspectiveCamera, WebGLRenderer } from "three";
import type { Addon, AddonContext } from "../addons/Addon";
import { EventBus } from "./events";

export default class AddonManager {
	private addons: Map<string, Addon> = new Map();
	private context: AddonContext;
	private exports: Record<string, any> = {};

	constructor() {
		this.context = {
			viewport: {
				scene:  new Scene(),
				camera: new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000),
				renderer: new WebGLRenderer({ antialias: true })
			},
			ui: {
				toolbar: document.getElementById("toolbar") as HTMLDivElement,
				propertyPanel: document.getElementById("properties") as HTMLDivElement,
				renderArea: document.getElementById("render-area") as HTMLDivElement
			},
			events: new EventBus(),
			get exports() {
				return (id: string) => this._exports[id];
			},
			_exports: this.exports
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
				this.exports[addon.id] = addon.exports();
				this.addons.set(addon.id, addon);
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
				this.addons.delete(addon.id);
			}
			console.log(`[Addon] Removed: ${addon.name}`);
		} catch (e) {
			console.error(`[Addon] Failed to remove: ${addon.name}`, e);
		}
	}

	/**
	 * Enable an addon
	 * @remarks This method will call the `onEnable` method of the addon
	 * @param addon The addon to enable
	 */
	async enable(addon: Addon) {
		if (!this.addons.has(addon.id)) {
			console.warn(`[Addon] Cannot enable: ${addon.name} is not registered`);
			return;
		}
		if (addon.enabled) {
			return;
		}

		try {
			if (typeof addon.onEnable === "function") {
				await addon.onEnable(this.context);
				addon.enabled = true;
				console.log(`[Addon] Enabled: ${addon.name}`);
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
		if (!this.addons.has(addon.id)) {
			console.warn(`[Addon] Cannot disable: ${addon.name} is not registered`);
			return;
		}
		if (!addon.enabled) {
			return;
		}
		
		try {
			if (typeof addon.onDisable === "function") {
				await addon.onDisable(this.context);
				addon.enabled = false;
				console.log(`[Addon] Disabled: ${addon.name}`);
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
		for (const addon of this.addons.values()) {
			await this.enable(addon);
		}
	}

	/**
	 * Disable all addons
	 * @remarks This method will call the `onDisable` method of each addon
	 */
	async disableAll() {
		for (const addon of this.addons.values()) {
			await this.disable(addon);
		}
	}

	/**
	 * List all registered addons
	 * @returns An array of addon names
	 */
	listAddons(): string[] {
		return Array.from(this.addons.values()).map(addon => addon.name);
	}
}
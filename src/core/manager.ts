import { Scene, PerspectiveCamera, WebGLRenderer } from "three";
import type { Addon } from "../addons/Addon";
import { on, off, emit } from "./events";
import { context, type AddonContext } from "./context";

export default class AddonManager {
	private addons: Map<string, Addon> = new Map();
	private exports: Record<string, any> = {};

	constructor(debug = false) {
		context.debug = debug;
		context.exports = id => {
			return this.addons.get(id)?.exports();
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
				await addon.onRegister(context);
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
	 * @remarks This method will call the `onDisable` and `onDestroy` methods of the addon
	 * @param addon The addon to remove
	 */
	async remove(ref: Addon | string) {
		let addon = typeof ref === "string" ? this.addons.get(ref)! : ref;

		try {
			await this.disable(addon);
			if (typeof addon.onDestroy === "function") {
				await addon.onDestroy(context);
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
	async enable(ref: Addon | string) {
		let addon = typeof ref === "string" ? this.addons.get(ref)! : ref;

		if (!this.addons.has(addon.id)) {
			console.warn(`[Addon] Cannot enable: ${addon.name} is not registered`);
			return;
		}
		if (addon.enabled) {
			console.warn(`[Addon] Cannot enable: ${addon.name} is already enabled`);
			return;
		}

		try {
			if (typeof addon.onEnable === "function") {
				addon.enabled = true;
				await addon.onEnable(context);
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
	async disable(ref: Addon | string) {
		let addon = typeof ref === "string" ? this.addons.get(ref)! : ref;

		if (!this.addons.has(addon.id)) {
			console.warn(`[Addon] Cannot disable: ${addon.name} is not registered`);
			return;
		}
		if (!addon.enabled) {
			console.warn(`[Addon] Cannot disable: ${addon.name} is not enabled`);
			return;
		}
		
		try {
			if (typeof addon.onDisable === "function") {
				addon.enabled = false;
				await addon.onDisable(context);
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
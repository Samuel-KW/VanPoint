import type { AddonContext } from "../core/context";

export class Addon {
	id: string = "";
	name: string = "Unnamed Addon";
	description: string = "No description";
	enabled: boolean = false;

	onRegister(_: AddonContext): Promise<void> | void { throw new Error("onRegister() method not implemented"); }
	onEnable(_: AddonContext): Promise<void> | void { throw new Error("onEnable() method not implemented"); }
	onDisable(_: AddonContext): Promise<void> | void { throw new Error("onDisable() method not implemented"); }
	onDestroy(_: AddonContext): Promise<void> | void { throw new Error("onDestroy() method not implemented"); }
	exports(): any { throw new Error("exports() method not implemented"); }
}
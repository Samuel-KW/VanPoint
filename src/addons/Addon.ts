import { PerspectiveCamera, Scene, WebGLRenderer } from "three";
import type { EventBus } from "../core/events";

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

export interface AddonContext {
	viewport: {
		scene: Scene;
		camera: PerspectiveCamera;
		renderer: WebGLRenderer;
	};
	ui: {
		toolbar: HTMLElement;
		propertyPanel: HTMLElement;
		widgets: HTMLElement;
		viewport: HTMLElement;
	};
	debug: boolean;
	events: EventBus;
	exports: <T = any>(id: string) => T | undefined;
}
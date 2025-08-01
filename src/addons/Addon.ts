import { PerspectiveCamera, Scene, WebGLRenderer } from "three";
import type { EventBus } from "../core/events";

export class Addon {
	id: string = "";
	name: string = "Unnamed Addon";
	enabled: boolean = false;

	onRegister(_: AddonContext): Promise<void> | void { throw new Error("onRegister() method not implemented"); }
	onEnable(_: AddonContext): Promise<void> | void { throw new Error("onEnable() method not implemented"); }
	onDisable(_: AddonContext): Promise<void> | void { throw new Error("onDisable() method not implemented"); }
	onDestroy(_: AddonContext): Promise<void> | void { throw new Error("onDestroy() method not implemented"); }
	exports(): Record<string, unknown> { throw new Error("exports() method not implemented"); }
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
		renderArea: HTMLElement;
		widgets: HTMLElement;
		viewport: HTMLElement;
	};
	debug: boolean;
	events: EventBus;
	exports: <T = any>(id: string) => T;
	_exports: Record<string, any>; // internal reference for getter function
}
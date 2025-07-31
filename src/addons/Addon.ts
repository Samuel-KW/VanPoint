import { PerspectiveCamera, Scene, WebGLRenderer } from "three";
import type { EventBus } from "../core/events";

export abstract class Addon {
	abstract id: string;
	abstract name: string;
	enabled: boolean = false;

	abstract onRegister(context: AddonContext): Promise<void> | void;
	abstract onEnable(context: AddonContext): Promise<void> | void;
	abstract onDisable(context: AddonContext): Promise<void> | void;
	abstract onDestroy(context: AddonContext): Promise<void> | void;
	abstract exports(): Record<string, unknown>;
}

export interface AddonContext {
	viewport: {
		scene: Scene;
		camera: PerspectiveCamera;
		renderer: WebGLRenderer;
	};
	ui: {
		toolbar: HTMLDivElement;
		propertyPanel: HTMLDivElement;
	};
	events: EventBus;
	exports: <T = any>(id: string) => T;
	_exports: Record<string, any>; // internal reference for getter function
}
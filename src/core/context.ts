import type { Camera, Scene, WebGLRenderer } from "three";
import type { EventBus } from "./events";

export interface AddonContext {
	viewport: {
		scene: Scene;
		camera: Camera;
		renderer: WebGLRenderer;
	};
	ui: {
		toolbar: HTMLDivElement;
		propertyPanel: HTMLDivElement;
	};
	events: EventBus;
}
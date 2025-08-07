import { Scene, PerspectiveCamera, WebGLRenderer } from "three";
import { on, off, emit } from "./events";

export interface AddonContext {
	viewport: {
		scene: Scene;
		camera: PerspectiveCamera;
		renderer: WebGLRenderer;
		dragging: boolean;
	};
	ui: {
		toolbar: HTMLElement;
		propertyPanel: HTMLElement;
		widgets: HTMLElement;
		viewport: HTMLElement;
	};
	mouse: {
		x: number;
		y: number;
		button: {
			left: boolean;
			middle: boolean;
			right: boolean;
		};
	};
	keyboard: {
		shift: boolean;
		ctrl: boolean;
		alt: boolean;
	}
	debug: boolean;
	events: { on: typeof on; off: typeof off; emit: typeof emit };
	exports: <T = any>(id: string) => T | undefined;
}

export const context: AddonContext = {
	viewport: {
		scene: new Scene(),
		camera: new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000),
		renderer: new WebGLRenderer({ antialias: true, alpha: true, canvas: document.getElementById("canvas-3d") as HTMLCanvasElement }),
		dragging: false
	},
	ui: {
		toolbar: document.getElementById("toolbar") as HTMLDivElement,
		propertyPanel: document.getElementById("property-panel") as HTMLDivElement,
		widgets: document.getElementById("widgets") as HTMLDivElement,
		viewport: document.getElementById("viewport") as HTMLDivElement
	},
	mouse: {
		x: 0,
		y: 0,
		button: {
			left: false,
			middle: false,
			right: false
		}
	},
	keyboard: {
		shift: false,
		ctrl: false,
		alt: false
	},
	debug: false,
	events: { on, off, emit },
	exports() { throw new Error("exports() method not implemented"); }
};
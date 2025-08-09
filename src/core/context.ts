import { Scene, PerspectiveCamera, WebGLRenderer } from "three";
import { on, off, emit } from "./events";
import type { Line2D } from "../ui/components/viewport/Line2d";
import { Point2D } from "../ui/components/viewport/Point2d";
import RelPoint2D from "../ui/components/viewport/RelPoint2d";

export interface AddonContext {
	viewport: {
		scene: Scene;
		camera: PerspectiveCamera;
		renderer: WebGLRenderer;
		dragging: boolean;
		lines2d: Line2D[];
		points2d: Point2D[];
		mouse: RelPoint2D;
	};
	ui: {
		toolbar: HTMLElement;
		propertyPanel: HTMLElement;
		widgets: HTMLElement;
		viewport: HTMLElement;
		canvas2d: HTMLCanvasElement;
		canvas3d: HTMLCanvasElement;
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
		dragging: false,
		lines2d: [],
		points2d: [],
		mouse: new Point2D()
	},
	ui: {
		toolbar: document.getElementById("toolbar") as HTMLDivElement,
		propertyPanel: document.getElementById("property-panel") as HTMLDivElement,
		widgets: document.getElementById("widgets") as HTMLDivElement,
		viewport: document.getElementById("viewport") as HTMLDivElement,
		canvas2d: document.getElementById("canvas-2d") as HTMLCanvasElement,
		canvas3d: document.getElementById("canvas-3d") as HTMLCanvasElement
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
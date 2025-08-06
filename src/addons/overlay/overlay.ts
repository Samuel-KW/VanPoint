import { Addon, type AddonContext } from "../Addon";

type Annotation = {
	id: string;
	draw(ctx: CanvasRenderingContext2D, offset: { x: number, y: number }): void;
};

export class OverlayAddon extends Addon {
	id = "overlay";
	name = "Overlay Tools";
	description = "Viewport 2D overlay tools";

	private canvas?: HTMLCanvasElement;
	private context?: CanvasRenderingContext2D;
	private observer?: ResizeObserver;
	private annotations: Map<string, Annotation> = new Map();
	private animationFrame?: number;

	private offset = { x: 0, y: 0 };
	private dragListener?: (data: { x: number, y: number, dX: number, dY: number }) => void;

	async onRegister(ctx: AddonContext) {
		this.canvas = document.createElement("canvas");
		this.canvas.style.position = "absolute";
		this.canvas.style.top = "0";
		this.canvas.style.left = "0";
		this.canvas.style.pointerEvents = "none";
		this.canvas.style.zIndex = "10";

		const resize = () => {
			if (!this.canvas || !ctx.ui.viewport) return;
			this.canvas.width = ctx.ui.viewport.offsetWidth;
			this.canvas.height = ctx.ui.viewport.offsetHeight;
		};

		this.observer = new ResizeObserver(resize);
		this.observer.observe(ctx.ui.viewport);
		resize();
	}

	async onEnable(ctx: AddonContext) {
		if (!this.canvas) return;

		ctx.ui.viewport.appendChild(this.canvas);
		this.context = this.canvas.getContext("2d")!;
		this.animate();

		this.dragListener = data => this.onDrag(data, ctx);
		ctx.events.on("viewport:drag", this.dragListener);

		this.addAnnotation({
			id: "line1",
			draw(ctx, offset) {
				ctx.strokeStyle = "red";
				ctx.beginPath();
				ctx.moveTo(offset.x, offset.y);
				ctx.lineTo(offset.x + 100, offset.y + 100);
				ctx.stroke();
			}
		});
	}

	async onDisable(ctx: AddonContext) {
		if (!this.dragListener) {
			return;
		}

		if (this.canvas?.parentElement) {
			this.canvas.parentElement.removeChild(this.canvas);
		}
		if (this.animationFrame) {
			cancelAnimationFrame(this.animationFrame);
			this.animationFrame = undefined;
		}

		ctx.events.off("viewport:drag", this.dragListener);
	}

	async onDestroy(_: AddonContext) {
		this.observer?.disconnect();
		this.annotations.clear();
		this.canvas = undefined;
		this.context = undefined;
		this.animationFrame = undefined;
	}

	addAnnotation(annotation: Annotation) {
		this.annotations.set(annotation.id, annotation);
	}

	removeAnnotation(id: string) {
		this.annotations.delete(id);
	}

	private animate = () => {
		if (!this.enabled || !this.canvas || !this.context) return;
		this.animationFrame = requestAnimationFrame(this.animate);

		const ctx = this.context;
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		for (const annotation of this.annotations.values()) {
			annotation.draw(ctx, this.offset);
		}
	};

	exports() {
		return {
			addAnnotation: (a: Annotation) => this.addAnnotation(a),
			removeAnnotation: (id: string) => this.removeAnnotation(id),
		};
	}

	onDrag(data: { x: number, y: number, dX: number, dY: number }, ctx: AddonContext) {
		this.offset.x += data.dX;
		this.offset.y += data.dY;
	}
}
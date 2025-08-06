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
		this.canvas.style.zIndex = "5";

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
		if (!this.canvas) {
			return;
		}

		ctx.ui.viewport.appendChild(this.canvas);
		this.context = this.canvas.getContext("2d")!;
		this.animate();

		this.dragListener = data => this.onDrag(data, ctx);
		ctx.events.on("viewport:drag", this.dragListener);

		this.addAnnotation({
			id: "line1",
			draw: (ctx, offset) => {
				if (!this.canvas) {
					return;
				}
				this.drawExtendedLineToCanvasEdge([
					offset.x,
					offset.y,
					offset.x + 1,
					offset.y + 3,
				], this.canvas, ctx);
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

	drawExtendedLineToCanvasEdge(
		line: [number, number, number, number],
		canvas: HTMLCanvasElement,
		ctx: CanvasRenderingContext2D
	): void {
		const [x1, y1, x2, y2] = line;
		const width = canvas.width;
		const height = canvas.height;

		const dx = x2 - x1;
		const dy = y2 - y1;

		if (dx === 0 && dy === 0) {
			// Degenerate line (a point)
			return;
		}

		let points: [number, number][] = [];

		// Handle vertical lines
		if (dx === 0) {
			points.push([x1, 0], [x1, height]);
		}
		// Handle horizontal lines
		else if (dy === 0) {
			points.push([0, y1], [width, y1]);
		}
		// General case
		else {
			const m = dy / dx;
			const b = y1 - m * x1;

			const candidates: [number, number][] = [];

			// Left edge (x = 0)
			const y_at_x0 = b;
			if (y_at_x0 >= 0 && y_at_x0 <= height) {
				candidates.push([0, y_at_x0]);
			}

			// Right edge (x = width)
			const y_at_xw = m * width + b;
			if (y_at_xw >= 0 && y_at_xw <= height) {
				candidates.push([width, y_at_xw]);
			}

			// Top edge (y = 0)
			const x_at_y0 = -b / m;
			if (x_at_y0 >= 0 && x_at_y0 <= width) {
				candidates.push([x_at_y0, 0]);
			}

			// Bottom edge (y = height)
			const x_at_yh = (height - b) / m;
			if (x_at_yh >= 0 && x_at_yh <= width) {
				candidates.push([x_at_yh, height]);
			}

			// Deduplicate and pick at most 2 valid points
			for (const pt of candidates) {
				if (!points.some(p => Math.abs(p[0] - pt[0]) < 1e-5 && Math.abs(p[1] - pt[1]) < 1e-5)) {
					points.push(pt);
					if (points.length === 2) break;
				}
			}
		}

		if (points.length === 2) {
			ctx.beginPath();
			ctx.moveTo(points[0][0], points[0][1]);
			ctx.lineTo(points[1][0], points[1][1]);
			ctx.stroke();
		}
	}
}
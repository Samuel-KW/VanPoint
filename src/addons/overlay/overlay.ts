import { Addon, type AddonContext } from "../Addon";


class Line2D {
	static endpointRadius = 5;
	static endpointPadding = 5;

	private color = Math.floor(Math.random() * 16777215).toString(16);

	public x1;
	public y1;
	public x2;
	public y2;

	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;

	constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, x1 = 100, y1 = 150, x2 = 200, y2 = 300) {
		this.canvas = canvas;
		this.ctx = ctx;
		
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
	}

	drawLine(offset: { x: number, y: number }): void {
		const x1 = this.x1 + offset.x;
		const y1 = this.y1 + offset.y;
		const x2 = this.x2 + offset.x;
		const y2 = this.y2 + offset.y;

		const width = this.canvas.width;
		const height = this.canvas.height;

		const dx = x2 - x1;
		if (dx === 0) {
			this.ctx.beginPath();
			this.ctx.moveTo(x1, 0);
			this.ctx.lineTo(x1, height);
			this.ctx.stroke();
		}
		
		const slope = (y2 - y1) / dx;
		const intercept = y1 - slope * x1;

		this.ctx.strokeStyle = `#000`;
		this.ctx.lineWidth = 2;
		this.ctx.beginPath();
		this.ctx.moveTo(0, intercept);
		this.ctx.lineTo(width, slope * width + intercept);
		this.ctx.stroke();
	}

	drawEndpoints(offset: { x: number, y: number }) {
		const x1 = this.x1 + offset.x;
		const y1 = this.y1 + offset.y;
		const x2 = this.x2 + offset.x;
		const y2 = this.y2 + offset.y;

		this.ctx.fillStyle = `#${this.color}`;
		this.ctx.strokeStyle = `#000`;
		this.ctx.lineWidth = 2;
		this.ctx.beginPath();
		this.ctx.arc(x1, y1, Line2D.endpointRadius, 0, 2 * Math.PI);
		this.ctx.fill();
		this.ctx.stroke();
		this.ctx.beginPath();
		this.ctx.arc(x2, y2, Line2D.endpointRadius, 0, 2 * Math.PI);
		this.ctx.fill();
		this.ctx.stroke();
	}
}

export class OverlayAddon extends Addon {
	id = "overlay";
	name = "Overlay Tools";
	description = "Viewport 2D overlay tools";

	private canvas?: HTMLCanvasElement;
	private context?: CanvasRenderingContext2D;
	private observer?: ResizeObserver;
	private animationFrame?: number;
	private lines: Line2D[] = [];

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

		this.addLine(new Line2D(this.canvas, this.context));
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

	addLine(line: Line2D) {
		this.lines.push(line);
	}

	removeLine(line: Line2D) {
		this.lines = this.lines.filter(l => l !== line);
	}

	private animate = () => {
		if (!this.enabled || !this.canvas || !this.context) return;
		this.animationFrame = requestAnimationFrame(this.animate);

		const ctx = this.context;
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		for (const line of this.lines) {
			line.drawLine(this.offset);
			line.drawEndpoints(this.offset);
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
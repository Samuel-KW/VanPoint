import type { AddonContext } from "../../core/context";
import { Addon } from "../Addon";
import { Line2D } from "./Line2D";
import type { Point2D } from "./Point2D";

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
	private moveListener?: (event: MouseEvent | TouchEvent) => void;

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

		this.moveListener = event => this.onMove(event, ctx);
		window.addEventListener("mousemove", this.moveListener);
		window.addEventListener("touchmove", this.moveListener, { passive: false });

		this.addLine(new Line2D(this.canvas, this.context));
	}

	async onDisable(ctx: AddonContext) {
		if (!this.dragListener || !this.moveListener) {
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
		
		window.removeEventListener("mousemove", this.moveListener);
		window.removeEventListener("touchmove", this.moveListener);
	}

	async onDestroy(_: AddonContext) {
		this.observer?.disconnect();
		this.lines = [];
		this.canvas = undefined;
		this.context = undefined;
		this.animationFrame = undefined;
		this.dragListener = undefined;
		this.moveListener = undefined;
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
			line.setOffset(this.offset.x, this.offset.y);
			line.drawLine();
			line.drawEndpoints();
		}
	};

	exports() {
		return {};
	}

	onDrag(data: { x: number, y: number, dX: number, dY: number }, ctx: AddonContext) {
		this.offset.x += data.dX;
		this.offset.y += data.dY;
	}

	onMove(event: MouseEvent | TouchEvent, ctx: AddonContext) {
		let x, y;
		if (event instanceof TouchEvent) {
			x = event.touches[0].clientX;
			y = event.touches[0].clientY;
		} else {
			x = event.clientX;
			y = event.clientY;
		}
		
		x -= ctx.ui.viewport.offsetLeft;
		y -= ctx.ui.viewport.offsetTop;

		// Update radius of line points based on distance
		let closestDist = Infinity;
		let cloestPoint: Point2D | null = null;

		for (const line of this.lines) {
			const distStart = line.start.distanceApprox(x, y, this.offset);
			line.start.emphasis = Math.min(7, Math.max(0, -0.1 * distStart + 10));
			line.start.selected = false;
			
			const distEnd = line.end.distanceApprox(x, y, this.offset);
			line.end.emphasis = Math.min(7, Math.max(0, -0.1 * distEnd + 10));
			line.end.selected = false;

			if (distStart < distEnd) {
				if (distStart < closestDist) {
					closestDist = distStart;
					cloestPoint = line.start;
				}
			} else {
				if (distEnd < closestDist) {
					closestDist = distEnd;
					cloestPoint = line.end;
				}
			}
		}

		if (cloestPoint) {
			cloestPoint.selected = true;
		}
	}
}
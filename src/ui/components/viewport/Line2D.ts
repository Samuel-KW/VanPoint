
import { Point2D } from "./Point2d";

export class Line2D {
	
	start;
	end;

	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;

	constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, x1 = 100, y1 = 150, x2 = 200, y2 = 300, color = `#${Math.floor(Math.random() * 16777215).toString(16)}`) {
		this.canvas = canvas;
		this.ctx = ctx;
		
		this.start = new Point2D(x1, y1, color);
		this.end = new Point2D(x2, y2, color);
	}

	drawLine(): void {
		this.ctx.strokeStyle = `#000`;
		this.ctx.lineWidth = 1;

		const x1 = this.start.local.x;
		const y1 = this.start.local.y;
		const x2 = this.end.local.x;
		const y2 = this.end.local.y;

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

		this.ctx.beginPath();
		this.ctx.moveTo(0, intercept);
		this.ctx.lineTo(width, slope * width + intercept);
		this.ctx.stroke();
	}

	drawEndpoints() {
		this.start.draw(this.ctx);
		this.end.draw(this.ctx);
	}
}
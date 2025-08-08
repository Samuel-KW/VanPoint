import RelPoint2D from "./RelPoint2D";

export class Point2D extends RelPoint2D {
	radius = 6;
	padding = 5;
	selected = false;
	dragging = false;
	
	private emphasis = 0;
	private color;

	constructor(x = 0, y = 0, color = "#ff0000") {
		super(x, y);
		this.color = color;
	}

	draw(ctx: CanvasRenderingContext2D) {
		this.visualize(ctx, {
			radius: this.radius + this.emphasis,
			color: this.dragging ? undefined : this.color,
			stroke: this.selected ? "#ffffff" : "#000",
			strokeWidth: this.selected ? 1 : 2
		});
	}

	contains(px: number, py: number): boolean {
		const dx = this.local.x - px;
		const dy = this.local.y - py;
		return dx * dx + dy * dy < Math.pow(this.radius + this.padding + this.emphasis, 2);
	}

	setColor(color: string) {
		this.color = color;
	}

	emphasizeFromWorld(x: number, y: number) {
		const dist = this.distanceLocalApprox(x, y);
		this.emphasis = Math.min(7, Math.max(0, -0.1 * dist + 10));
		return dist;
	}
}
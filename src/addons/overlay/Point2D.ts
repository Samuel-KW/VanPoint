export class Point2D {
	x; y;
	radius = 6;
	padding = 5;
	emphasis = 0;
	
	dragging = false;
	selected = false;
	
	private color;

	constructor(x = 0, y = 0, color = "#ff0000") {
		this.x = x;
		this.y = y;
		this.color = color;
	}

	draw(ctx: CanvasRenderingContext2D, offset: { x: number, y: number }) {
		const radius = this.radius + this.emphasis;
		ctx.fillStyle = this.dragging ? `#fff` : this.color;
		ctx.strokeStyle = this.selected ? `#fff` : `#000`;
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(this.x + offset.x, this.y + offset.y, radius, 0, 2 * Math.PI);
		ctx.fill();
		ctx.stroke();
	}

	contains(px: number, py: number): boolean {
		const dx = this.x - px;
		const dy = this.y - py;
		return dx * dx + dy * dy <= this.radius * this.radius;
	}

	distance(px: number, py: number, offset: { x: number, y: number }): number {
		const dx = this.x + offset.x - px;
		const dy = this.y + offset.y - py;
		return Math.sqrt(dx * dx + dy * dy);
	}

	distanceApprox(px: number, py: number, offset: { x: number, y: number }): number {
		const dx = this.x + offset.x - px;
		const dy = this.y + offset.y - py;
		return Math.abs(dx) + Math.abs(dy);
	}

	setPosition(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	setColor(color: string) {
		this.color = color;
	}
}

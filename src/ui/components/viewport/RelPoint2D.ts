export default class RelPoint2D {
	private x; private y;
	static offset = { x: 0, y: 0 };
	static scale = 1;
	
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	/**
	 * Returns the Euclidean distance between this point and (px, py) in world space.
	 * @param {number} px The x coordinate of the other point
	 * @param {number} py The y coordinate of the other point
	 * @returns The distance between the two points in world space
	 */
	distanceWorld(px: number, py: number): number {
		const dx = this.x - px;
		const dy = this.y - py;
		return Math.sqrt(dx * dx + dy * dy);
	}

	/**
	 * Returns an approximate distance between this point and (px, py) in world space.
	 * This is a faster approximate version of `distanceWorld`.
	 * @param {number} px The x coordinate of the other point
	 * @param {number} py The y coordinate of the other point
	 * @returns The approximate distance between the two points in world space
	 */
	distanceWorldApprox(px: number, py: number): number {
		const dx = this.x - px;
		const dy = this.y - py;
		return Math.abs(dx) + Math.abs(dy);
	}

	/**
	 * Returns the Euclidean distance between this point and (px, py) in local space.
	 * @param {number} px The x coordinate of the other point
	 * @param {number} py The y coordinate of the other point
	 * @returns The Euclidean distance between the two points in local space
	 */
	distanceLocal(px: number, py: number): number {
		const dx = this.local.x - px;
		const dy = this.local.y - py;
		return Math.sqrt(dx * dx + dy * dy);
	}

	/**
	 * Returns an approximate distance between this point and (px, py) in local space.
	 * This is a faster approximate version of `distanceLocal`.
	 * @param {number} px The x coordinate of the other point
	 * @param {number} py The y coordinate of the other point
	 * @returns The approximate distance between the two points in local space
	 */
	distanceLocalApprox(px: number, py: number): number {
		const dx = this.local.x - px;
		const dy = this.local.y - py;
		return Math.abs(dx) + Math.abs(dy);
	}

	/**
	 * Sets the world position point.
	 * @param {Object} pos
	 * @param {number} pos.x The x coordinate of the point
	 * @param {number} pos.y The y coordinate of the point
	 */
	setPosition(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	setLocalPositionFromScreen(x: number, y: number) {
		this.x = (x - RelPoint2D.offset.x) / RelPoint2D.scale;
		this.y = (y - RelPoint2D.offset.y) / RelPoint2D.scale;
	}

	/**
	 * Visualizes this point in the given canvas context.
	 * @param {CanvasRenderingContext2D} ctx The context to draw in
	 * @param {Object} opts The options for the visualization
	 * @param {number} [opts.radius=6] The radius of the point
	 * @param {string} [opts.color] The color of the point
	 * @param {string} [opts.stroke] The color of the stroke
	 * @param {number} [opts.strokeWidth=2] The width of the stroke
	 */
	visualize(ctx: CanvasRenderingContext2D, { radius = 6, color, stroke, strokeWidth = 2 }: { radius: number, color?: string, stroke?: string, strokeWidth: number }) {
		ctx.lineWidth = strokeWidth;
		ctx.beginPath();
		ctx.arc(this.local.x, this.local.y, radius, 0, 2 * Math.PI);
		if (color) {
			ctx.fillStyle = color;
			ctx.fill();
		}
		if (stroke) {
			ctx.strokeStyle = stroke;
			ctx.stroke();
		}
	}

	/**
	 * Gets the world coordinates of the point.
	 * @returns An object with the x and y coordinates in world space.
	 */
	get world() {
		return { x: this.x, y: this.y };
	}

	/**
	 * Gets the local coordinates of the point, taking into account the offset and scale.
	 * @returns An object with the x and y coordinates in local space.
	 */
	get local() {
		return { x: this.x * RelPoint2D.scale + RelPoint2D.offset.x, y: this.y * RelPoint2D.scale + RelPoint2D.offset.y };
	}

	// TODO Validate
	getScreenPosition(viewport: HTMLElement) {
		return { x: this.x * RelPoint2D.scale + RelPoint2D.offset.x + viewport.offsetLeft, y: this.y * RelPoint2D.scale + RelPoint2D.offset.y + viewport.offsetTop };
	}
}
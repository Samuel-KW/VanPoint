import { context } from "../../../core/context";
import { Line2D } from "./Line2d";
import { Point2D } from "./Point2d";
import RelPoint2D from "./RelPoint2d";

let lines: Line2D[] = [];
let closestPoint: Point2D | null = null;

const canvas = context.ui.canvas2d;
const ctx = canvas.getContext("2d")!;

const viewport = context.ui.viewport;

let background = new Image();

context.events.on("image:load", ({ image }: { image: HTMLImageElement }) => {
	background = image;
});

export const addLine = (line: Line2D) => {
	lines.push(line);
};

export const removeLine = (line: Line2D) => {
	lines = lines.filter(l => l !== line);
};

const resize = () => {
	canvas.width = viewport.offsetWidth;
	canvas.height = viewport.offsetHeight;
};

const onDown = ({ event }: { event: MouseEvent | TouchEvent }) => {
	if (event.target !== context.ui.canvas2d && event.target !== context.ui.canvas3d) {
		return;
	}

	const mouseX = context.mouse.x;
	const mouseY = context.mouse.y;

	let tmpDist = Infinity;
	let tmpPoint: Point2D | null = null;
	for (const line of lines) {
		const distStart = line.start.distanceLocalApprox(mouseX, mouseY);
		const distEnd = line.end.distanceLocalApprox(mouseX, mouseY);

		if (distStart < distEnd) {
			if (distStart < tmpDist) {
				tmpDist = distStart;
				tmpPoint = line.start;
			}
		} else {
			if (distEnd < tmpDist) {
				tmpDist = distEnd;
				tmpPoint = line.end;
			}
		}
	}


	if (tmpPoint) {
		if (tmpPoint !== closestPoint) {
			if (closestPoint) {
				closestPoint.selected = false;
				closestPoint.dragging = false;
			}
			closestPoint = tmpPoint;
		}
		
		if (context.mouse.button.left) {
			tmpPoint.dragging = tmpPoint.contains(mouseX, mouseY);
			tmpPoint.selected = true;
		}
	}
};

const onUp = () => {
	if (closestPoint) {
		closestPoint.dragging = false;
	}
};

context.events.on("mouse:down", onDown);
context.events.on("mouse:up", onUp);

const observer = new ResizeObserver(resize);
observer.observe(viewport);

resize();

addLine(new Line2D(canvas, ctx));


export const draw2D = (offset: { x: number, y: number }, scale: number) => {
	const mouseX = context.mouse.x;
	const mouseY = context.mouse.y;

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.drawImage(background, 0, 0, background.width, background.height, offset.x, offset.y, background.width * scale, background.height * scale);
	
	if (context.keyboard.shift) {
		const margin = 10;
		const destSize = 150;
		const zoom = 5;
		const sourceSize = destSize / zoom;
		ctx.fillStyle = `#000`;
		ctx.strokeStyle = `#fff`;
		ctx.lineWidth = 1;

		// Draw zoomed in image
		ctx.fillRect(canvas.width - destSize - margin, margin, destSize, destSize);
		ctx.drawImage(
			canvas,
			mouseX - sourceSize / 2, mouseY - sourceSize / 2, sourceSize, sourceSize,
			canvas.width - destSize - margin, margin, destSize, destSize
		);

		// Draw crosshair
		ctx.beginPath();
		ctx.moveTo(canvas.width - destSize - margin, margin + destSize / 2);
		ctx.lineTo(canvas.width - margin, margin + destSize / 2);
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(canvas.width - destSize - margin + destSize / 2, margin);
		ctx.lineTo(canvas.width - destSize - margin + destSize / 2, margin + destSize);
		ctx.stroke();

		// Draw border
		ctx.strokeRect(canvas.width - destSize - margin, margin, destSize, destSize);
	}

	if (closestPoint && closestPoint.dragging) {
		closestPoint.setLocalPositionFromScreen(mouseX, mouseY);
	}

	for (const line of lines) {
		line.start.emphasizeFromWorld(mouseX, mouseY);
		line.end.emphasizeFromWorld(mouseX, mouseY);

		line.drawLine();
		line.drawEndpoints();
	}

	context.viewport.mouse.visualize(ctx, { color: "#fff", radius: 3, stroke: "#fff", strokeWidth: 1 });
};
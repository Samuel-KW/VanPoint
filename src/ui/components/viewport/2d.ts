import { context } from "../../../core/context";
import { Line2D } from "./Line2D";
import { Point2D } from "./Point2D";
import RelPoint2D from "./RelPoint2D";

let lines: Line2D[] = [];

const canvas = document.getElementById("canvas-2d") as HTMLCanvasElement;
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
resize();

const observer = new ResizeObserver(resize);
observer.observe(viewport);

addLine(new Line2D(canvas, ctx));

let selectedPoint: Point2D | null = null;

export const draw2D = (offset: { x: number, y: number }, scale: number) => {
	const mouseX = context.mouse.x;
	const mouseY = context.mouse.y;

	RelPoint2D.offset = offset;
	RelPoint2D.scale = scale;

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.drawImage(background, 0, 0, background.width, background.height, offset.x, offset.y, background.width * scale, background.height * scale);
	

	let closestDist = Infinity;
	let closestPoint: Point2D | null = null;

	for (const line of lines) {
		const distStart = line.start.emphasizeFromWorld(mouseX, mouseY);
		const distEnd = line.end.emphasizeFromWorld(mouseX, mouseY);

		if (distStart < distEnd) {
			if (distStart < closestDist) {
				closestDist = distStart;
				closestPoint = line.start;
			}
		} else {
			if (distEnd < closestDist) {
				closestDist = distEnd;
				closestPoint = line.end;
			}
		}

		line.drawLine();
		line.drawEndpoints();
	}

	if (closestPoint) {
		
		if (closestPoint !== selectedPoint) {
			if (selectedPoint) {
				selectedPoint.selected = false;
				selectedPoint.dragging = false;
			}
			selectedPoint = closestPoint;
		}

		closestPoint.selected = true;
		
		if (context.mouse.button.left && closestPoint.contains(mouseX, mouseY)) {
			
			// Set point position
			closestPoint.dragging = true;
			closestPoint.setLocalPositionFromScreen(mouseX, mouseY);
		} else {
			closestPoint.dragging = false;
		}
	}

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
};
import "./viewport.css";
import "./2d.ts";
import "./3d.ts";
import { context } from "../../../core/context.ts";
import { draw3D, updateScale3D } from "./3d.ts";
import { draw2D } from "./2d.ts";

let offset = { x: 0, y: 0 };
let scale = 1;
let dragging = false;

const viewport = context.ui.viewport;

viewport.oncontextmenu = () => false;

const updateScale = (delta: number) => {
	scale = Math.max(0.1, Math.min(3, scale + delta));
	updateScale3D(scale);
};

const animate = () => {
	requestAnimationFrame(() => animate());
	draw2D(offset, scale);
	draw3D(offset);
}

const onDrag = ({ dX, dY }: { dX: number, dY: number }) => {
	if (dragging && context.mouse.button.right) {
		if (context.keyboard.ctrl) {
			dX /= 5;
			dY /= 5;
		}
		offset.x += dX;
		offset.y += dY;
	}
};

const onUp = () => {
	dragging = false;
};

const onDown = () => {
	dragging = true;
};

const onWheel = (event: WheelEvent) => {

	const delta = -event.deltaY / 800;
	updateScale(delta);

	// Get scale pivot
	const pivotX = context.mouse.x - viewport.offsetLeft;
	const pivotY = context.mouse.y - viewport.offsetTop;

	// Transform to account for pivot
	// offset.x = (offset.x - pivotX) * scale + pivotX;
	// offset.y = (offset.y - pivotY) * scale + pivotY;

	event.preventDefault();
	event.stopImmediatePropagation();
};

context.events.on("image:load", ({ width, height }: { width: number, height: number }) => {
	const availWidth = context.ui.viewport.offsetWidth;
	const availHeight = context.ui.viewport.offsetHeight;

	scale = Math.min(availWidth / width, availHeight / height);
	updateScale(0);
});

context.events.on("mouse:move", onDrag);
viewport.addEventListener("mousedown", onDown);
viewport.addEventListener("touchstart", onDown, { passive: false });
window.addEventListener("mouseup", onUp);
window.addEventListener("touchend", onUp);
window.addEventListener("wheel", onWheel, { passive: false });

animate();

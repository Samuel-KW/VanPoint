import "./viewport.css";
import "./2d.ts";
import "./3d.ts";
import { context } from "../../../core/context.ts";
import { draw3D, updateScale3D } from "./3d.ts";
import { draw2D } from "./2d.ts";
import RelPoint2D from "./RelPoint2d.ts";

let offset = { x: 0, y: 0 };
let scale = 1;
let dragging = false;

const viewport = context.ui.viewport;

viewport.oncontextmenu = () => false;

const updateScale = (delta: number) => {
	const newScale = Math.max(0.1, Math.min(3, scale + delta));
	RelPoint2D.scale = newScale;
	updateScale3D(newScale);
	return newScale;
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
		RelPoint2D.offset = offset;
	}
};

const onUp = () => {
	dragging = false;
};

const onDown = () => {
	dragging = true;
};

const onWheel = (event: WheelEvent) => {

	const oldScale = scale;
	const delta = -event.deltaY / 800;
	scale = updateScale(delta);

	offset.x = context.mouse.x - ((context.mouse.x - offset.x) / oldScale) * scale;
	offset.y = context.mouse.y - ((context.mouse.y - offset.y) / oldScale) * scale;

	event.preventDefault();
	event.stopImmediatePropagation();
};

context.events.on("image:load", ({ width, height }: { width: number, height: number }) => {
	const availWidth = context.ui.viewport.offsetWidth;
	const availHeight = context.ui.viewport.offsetHeight;

	scale = Math.min(availWidth / width, availHeight / height);
	scale = updateScale(0);
});

context.events.on("mouse:move", onDrag);
viewport.addEventListener("mousedown", onDown);
viewport.addEventListener("touchstart", onDown, { passive: false });
window.addEventListener("mouseup", onUp);
window.addEventListener("touchend", onUp);
window.addEventListener("wheel", onWheel, { passive: false });

animate();

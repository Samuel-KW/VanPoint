import { context } from "../../../core/context";
import { emit } from "../../../core/events";

let x = 0;
let y = 0;

const move = (event: MouseEvent | TouchEvent) => {
	if (event instanceof TouchEvent) {
		context.mouse.x = event.touches[0].clientX - context.ui.viewport.offsetLeft;
		context.mouse.y = event.touches[0].clientY - context.ui.viewport.offsetTop;
		context.mouse.button = {
			left: event.touches.length === 1,
			right: event.touches.length === 2,
			middle: event.touches.length === 3
		};
	} else {
		context.mouse.x = event.clientX - context.ui.viewport.offsetLeft;
		context.mouse.y = event.clientY - context.ui.viewport.offsetTop;
		context.mouse.button = {
			left: event.buttons === 1,
			right: event.buttons === 2,
			middle: event.buttons === 3
		};
	}

	if (event.type !== "touchstart" && event.type !== "mousedown") {
		emit("mouse:move", { dX: context.mouse.x - x, dY: context.mouse.y - y });
	}
	
	x = context.mouse.x;
	y = context.mouse.y;

	event.preventDefault();
};

window.addEventListener("mousedown", move);
window.addEventListener("mousemove", move);
window.addEventListener("touchmove", move, { passive: false });
window.addEventListener("touchstart", move, { passive: false });
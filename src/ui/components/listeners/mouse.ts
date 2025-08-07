import { context } from "../../../core/context";

const move = (event: MouseEvent | TouchEvent) => {
	if (event instanceof TouchEvent) {
		context.mouse.x = event.touches[0].clientX;
		context.mouse.y = event.touches[0].clientY;
		context.mouse.button = {
			left: event.touches.length === 1,
			right: event.touches.length === 2,
			middle: event.touches.length === 3
		};
		event.preventDefault();
	} else {
		context.mouse.x = event.clientX;
		context.mouse.y = event.clientY;
		context.mouse.button = {
			left: event.buttons === 0,
			middle: event.buttons === 1,
			right: event.buttons === 2
		};
	}
};

const onUp = () => {
	context.viewport.dragging = false;
};

window.addEventListener("mousemove", move);
window.addEventListener("mousedown", move);
window.addEventListener("mouseup", onUp);

window.addEventListener("touchmove", move, { passive: false });
window.addEventListener("touchstart", move, { passive: false });
window.addEventListener("touchend", onUp);
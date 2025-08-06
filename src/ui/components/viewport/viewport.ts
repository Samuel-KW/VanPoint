import { emit } from "../../../core/events";
import "./viewport.css";

const viewport = document.getElementById("viewport") as HTMLDivElement;

let prevX = 0;
let prevY = 0;
let dragging = false;

const drag = (event: MouseEvent | TouchEvent) => {
	if (!dragging) {
		return;
	}

	let x, y;
	if (event instanceof TouchEvent) {
		if (event.touches.length !== 1) {
			return;
		}
		x = event.touches[0].clientX - viewport.offsetLeft;
		y = event.touches[0].clientY - viewport.offsetTop;	
	} else {
		if (event.buttons !== 1) {
			return;
		}
		x = event.clientX - viewport.offsetLeft;
		y = event.clientY - viewport.offsetTop;
	}

	emit("viewport:drag", { x, y, dX: x - prevX, dY: y - prevY });

	prevX = x;
	prevY = y;
};

const dragStart = (event: MouseEvent | TouchEvent) => {
	dragging = true;

	if (event instanceof TouchEvent) {
		prevX = event.touches[0].clientX - viewport.offsetLeft;
		prevY = event.touches[0].clientY - viewport.offsetTop;	
	} else {
		prevX = event.clientX - viewport.offsetLeft;
		prevY = event.clientY - viewport.offsetTop;
	}

	drag(event);
};

const dragEnd = () => {
	dragging = false;
};

viewport.addEventListener("mousedown", dragStart);
viewport.addEventListener("touchstart", dragStart);

window.addEventListener("mouseup", dragEnd);
window.addEventListener("touchend", dragEnd);

window.addEventListener("mousemove", drag);
window.addEventListener("touchmove", drag);

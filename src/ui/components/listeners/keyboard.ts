import { context } from "../../../core/context";

const onKey = (event: KeyboardEvent) => {
	context.keyboard.shift = event.shiftKey;
	context.keyboard.ctrl = event.ctrlKey;
	context.keyboard.alt = event.altKey;
};

window.addEventListener("keydown", onKey);
window.addEventListener("keyup", onKey);
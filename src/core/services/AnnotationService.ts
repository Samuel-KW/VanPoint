import { eventBus } from "../events";

export class AnnotationService {
	private lines: { start: [number, number], end: [number, number]; }[] = [];

	addLine(start: [number, number], end: [number, number]) {
		this.lines.push({ start, end });
		eventBus.emit("annotation:updated", this.lines);
	}

	clear() {
		this.lines = [];
		eventBus.emit("annotation:cleared");
	}

	getLines() {
		return this.lines;
	}
}
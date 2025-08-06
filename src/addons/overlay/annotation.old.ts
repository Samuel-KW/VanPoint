import { Addon, type AddonContext } from "../Addon";

class Line2D {
	private locked = false;
	private hidden = false;

	private parent: HTMLElement;
	private svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

	start: () => [number, number];
	end: () => [number, number];

	constructor(parent: HTMLElement) {
		this.parent = parent;

		const start = document.createElementNS("http://www.w3.org/2000/svg", "line");		
		start.setAttribute("stroke", "red");
		start.setAttribute("stroke-width", "2");
		this.svg.appendChild(start);
		
		const end = document.createElementNS("http://www.w3.org/2000/svg", "line");
		end.setAttribute("stroke", "red");
		end.setAttribute("stroke-width", "2");
		this.svg.appendChild(end);

		this.parent.appendChild(this.svg);

		this.start = this.draggable(start, ["x1", "y1"]);
		this.end = this.draggable(end, ["x2", "y3"]);
	}

	draggable (elem: Element, attrs: [string, string]): () => [number, number] {

		let dragging = false;
		let x = 0, y = 0;
		
		const update = (event: Event) => {
			if (!dragging) {
				return;
			}

			if (event instanceof TouchEvent) {
				x = event.touches[0].clientX;
				y = event.touches[0].clientY;
			} else if (event instanceof MouseEvent) {
				x = event.clientX;
				y = event.clientY;
			} else {
				return;
			}

			x -= this.parent.offsetLeft;
			y -= this.parent.offsetTop;

			elem.setAttribute(attrs[0], x.toString());
			elem.setAttribute(attrs[1], y.toString());
		}

		const dragStart = (event: Event) => {
			dragging = true;
			update(event);
		};

		const dragEnd = () => {
			dragging = false;
		};

		const drag = (event: Event) => {
			update(event);
		};

		elem.addEventListener("mousedown", dragStart);
		elem.addEventListener("touchstart", dragStart);
		window.addEventListener("mouseup", dragEnd);
		window.addEventListener("touchend", dragEnd);
		window.addEventListener("mousemove", drag);
		window.addEventListener("touchmove", drag);

		return () => [x, y];
	}

	toggleHidden() {
		this.hidden = !this.hidden;
		this.svg.style.display = this.hidden ? "none" : "block";
	}

	toggleLocked() {
		this.locked = !this.locked;
		this.svg.style.pointerEvents = this.locked ? "none" : "auto";
	}
}

export class AnnotationAddon extends Addon {
	id = "annotation";
	name = "Annotation Tools";
	description = "Tools to annotate images";

	private lines: Line2D[] = [];
	private button?: HTMLButtonElement;
	private properties?: HTMLDivElement;
	private hidden = false;

	async onRegister(ctx: AddonContext) {

		this.button = document.createElement("button");
		this.button.innerHTML = "✏️";
		this.button.addEventListener("click", () => {
			this.hidden = !this.hidden;
		});

		this.properties = document.createElement("div");
		this.properties.innerHTML = `<h3>Annotation Settings</h3>`;
	}

	async onEnable(ctx: AddonContext) {
		if (!this.button || !this.properties) {
			return;
		}

		this.lines.push(new Line2D(ctx.ui.viewport));

		ctx.ui.widgets.appendChild(this.button);
		ctx.ui.propertyPanel.appendChild(this.properties);
	}

	async onDisable(ctx: AddonContext) {
		if (!this.button || !this.properties) {
			return;
		}

		ctx.ui.widgets.removeChild(this.button);
		ctx.ui.propertyPanel.removeChild(this.properties);
	}

	async onDestroy(_: AddonContext) {
		if (!this.button || !this.properties) {
			return;
		}

		this.button = undefined;
		this.properties = undefined;
	}

	exports() {
		return {};
	}
}
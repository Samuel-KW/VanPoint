import { Addon, type AddonContext } from "../Addon";

export class PreviewAddon extends Addon {
	id = "previewImage";
	name = "Image Preview";
	description = "Adds a 3D preview of the uploaded image"

	private imgSrc?: String;
	private button?: HTMLButtonElement;
	private properties?: HTMLDivElement;

	private hidden = false;

	async onRegister(ctx: AddonContext) {
	
		const btn = document.createElement("button");
		btn.innerHTML = "🔎";
		
		btn.addEventListener("click", () => {
			this.hidden = !this.hidden;
			if (this.hidden) {
				btn.innerHTML = "X";
			} else {
				btn.innerHTML = "🔎";
			}
			ctx.viewport.renderer.domElement.style.background = this.bgStyle;
		});

		const properties = document.createElement("div");
		properties.innerHTML = `<h3>Image Preview Properties</h3>`;
		
		this.button = btn;
		this.properties = properties;
	}

	async onEnable(ctx: AddonContext) {
		if (!this.button || !this.properties) {
			return;
		}

		ctx.ui.widgets.appendChild(this.button);
		ctx.ui.propertyPanel.appendChild(this.properties);

		ctx.events.on("image:loaded", (image: HTMLImageElement) => {
			this.imgSrc = image.src;
			ctx.viewport.renderer.domElement.style.background = this.bgStyle;
		});

		if (ctx.debug) {
			const img = new Image();
			img.onload = () => {
				ctx.events.emit("image:loaded", img);
			};
			img.src = "assets/subway.avif";
		}
	}

	async onDisable(ctx: AddonContext) {
		if (!this.button || !this.properties) {
			return;
		}

		ctx.viewport.renderer.domElement.style.background = `var(--bg-color-3)`;
		ctx.ui.widgets.removeChild(this.button);
		ctx.ui.propertyPanel.removeChild(this.properties);
	}

	async onDestroy(_: AddonContext) {
		if (!this.button || !this.properties) {
			return;
		}

		this.imgSrc = undefined;
		this.properties = undefined;
		this.hidden = false;
	}

	exports() {
		return { demoStatus: this.enabled };
	}

	get bgStyle () {
		if (this.hidden || !this.imgSrc) {
			return `var(--bg-color-3)`;
		}
		return `var(--bg-color-3) url(${this.imgSrc}) no-repeat center center / contain`;
	}
}

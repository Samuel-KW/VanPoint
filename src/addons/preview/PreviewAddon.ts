import { Addon, type AddonContext } from "../Addon";

export class PreviewAddon extends Addon {
	id = "previewImage";
	name = "Image Preview";
	description = "Adds a 3D preview of the uploaded image"

	private file?: File;
	private src?: string;

	private button?: HTMLButtonElement;
	private properties?: HTMLDivElement;

	private hidden = false;

	async onRegister(ctx: AddonContext) {
	
		const btn = document.createElement("button");
		btn.innerHTML = "🔎";
		
		btn.addEventListener("click", () => {
			this.hidden = !this.hidden;
			this.updateBackground(ctx, this.hidden);
		});

		const properties = document.createElement("div");
		properties.innerHTML = `<h3>Image Preview Properties</h3>`;
		
		this.button = btn;
		this.properties = properties;
	}

	async onEnable(ctx: AddonContext) {
		if (!this.button || !this.properties) {
			console.warn("Button or properties not found");
			return;
		}

		ctx.ui.widgets.appendChild(this.button);
		ctx.ui.propertyPanel.appendChild(this.properties);

		ctx.events.on("image:load", ({ file, src }: { file: File, src: string }) => {
			if (this.src) {
				URL.revokeObjectURL(this.src);
			}
			this.file = file;
			this.src = src;
			this.updateBackground(ctx, false);
		});

		if (this.file) {
			this.updateBackground(ctx, false);
		}
	}

	async onDisable(ctx: AddonContext) {
		if (!this.button || !this.properties) {
			return;
		}

		ctx.ui.widgets.removeChild(this.button);
		ctx.ui.propertyPanel.removeChild(this.properties);
		this.updateBackground(ctx, true);
	}

	async onDestroy(_: AddonContext) {
		if (!this.button || !this.properties) {
			return;
		}

		this.file = undefined;
		this.properties = undefined;
		this.hidden = false;
	}

	exports() {
		return {
			file: this.file,
			src: this.src
		};
	}

	updateBackground (ctx: AddonContext, hidden: boolean) {
		if (!this.button) {
			return;
		}

		if (hidden) {
			this.button.innerHTML = "X";
		} else {
			this.button.innerHTML = "🔎";
		}

		const elem = ctx.viewport.renderer.domElement;
		if (hidden || !this.src) {
			elem.style.background = "";
		} else {
			elem.style.background = `var(--bg-color-3) url(${this.src}) no-repeat center center / contain`;
		}

		this.hidden = hidden;
	}
}

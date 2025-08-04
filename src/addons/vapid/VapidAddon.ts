/**
 * https://vgl.ict.usc.edu/Research/VaPiD/
 */

import { Addon, type AddonContext } from "../Addon";

export class VapidAddon extends Addon {
	id = "vapid";
	name = "VaPiD";
	description = "A rapid vanishing point detector via learned optimizers";

	private button?: HTMLButtonElement;
	private properties?: HTMLDivElement;

	async onRegister(ctx: AddonContext) {
		const btn = document.createElement("button");
		btn.innerHTML = "VaPiD";
		btn.title = "Run automated vanishing point detection using VaPiD";

		btn.onclick = async () => {
			const preview = ctx.exports<{ file: File }>("preview");
			const file = preview?.file;
			if (!file) {
				console.warn("VaPiD: Preview addon not found or not exporting preview file.");
				return;
			}

			btn.disabled = true;
			try {
				const body = { method: "POST", body: file };
				const req = await fetch("/vapid", body);
				const points = await req.json();

				if (points.length && points[0].length === 3) {
					ctx.events.emit("calibration:vanishingPoints", points);
				}
				btn.disabled = false;
			} catch(e) {
				console.error("Failed to send image to server:\n", e);
			}
		};

		const properties = document.createElement("div");
		properties.innerHTML = `<h3>VaPiD Properties</h3>`;

		this.button = btn;
		this.properties = properties;
	}

	async onEnable(ctx: AddonContext) {
		if (!this.button || !this.properties) return;

		ctx.ui.widgets.appendChild(this.button);
		ctx.ui.propertyPanel.appendChild(this.properties);
	}

	async onDisable(ctx: AddonContext) {
		if (!this.button || !this.properties) return;

		ctx.ui.widgets.removeChild(this.button);
		ctx.ui.propertyPanel.removeChild(this.properties);
	}

	async onDestroy(_: AddonContext) {
		this.button = undefined;
		this.properties = undefined;
	}

	exports() {
		return {};
	}
}

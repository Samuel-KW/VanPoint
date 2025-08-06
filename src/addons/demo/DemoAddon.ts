import * as THREE from "three";
import type { AddonContext } from "../../core/context";
import { Addon } from "../Addon";

export class DemoAddon extends Addon {
	id = "demo";
	name = "Demo Addon";
	description = "A demo addon";

	private cube?: THREE.Mesh;
	private inputs: HTMLInputElement[] = [];
	private button?: HTMLButtonElement;

	async onRegister(ctx: AddonContext) {
		const addon = ctx.exports("annotation");
		if (!addon) {
			console.warn("Annotation addon not found or not exporting.");
		}
	}

	async onEnable(ctx: AddonContext) {
		// Add cube to scene
		const geometry = new THREE.BoxGeometry();
		const material = new THREE.MeshNormalMaterial();
		this.cube = new THREE.Mesh(geometry, material);
		ctx.viewport.scene.add(this.cube);

		// Add toolbar button
		this.button = document.createElement("button");
		this.button.textContent = "Demo";
		this.button.onclick = () => alert("Demo clicked");
		ctx.ui.toolbar.appendChild(this.button);

		// Add x/y/z input controls
		["x", "y", "z"].forEach(axis => {
			const input = document.createElement("input");
			input.type = "number";
			input.placeholder = axis;
			input.step = "0.1";
			input.value = "0";
			input.oninput = () => {
				if (this.cube) this.cube.position[axis as "x" | "y" | "z"] = parseFloat(input.value);
			};
			ctx.ui.propertyPanel.appendChild(input);
			this.inputs.push(input);
		});
	}

	async onDisable(ctx: AddonContext) {
		if (this.cube) ctx.viewport.scene.remove(this.cube);
		this.inputs.forEach(input => input.remove());
		this.inputs = [];
		this.button?.remove();
	}

	async onDestroy(_: AddonContext) {
		alert("Sorry to see you go ):");
	}

	exports() {
		return { demoStatus: this.enabled };
	}
}

import * as THREE from "three";
import { Addon, type AddonContext } from "../Addon";

export class DirectionSphereAddon extends Addon {
	id = "debugDirectionSphere";
	name = "Vanishing Point Sphere";
	description = "Displays a unit sphere for vanishing point direction visualization";

	private sphere?: THREE.Mesh;
	private button?: HTMLButtonElement;
	private properties?: HTMLDivElement;
	private hidden = false;

	async onRegister(_: AddonContext) {
		const geometry = new THREE.SphereGeometry(1, 32, 16);
		const material = new THREE.MeshBasicMaterial({
			color: 0x00aaff,
			wireframe: true,
			transparent: true,
			opacity: 0.4,
			depthWrite: false
		});
		const sphere = new THREE.Mesh(geometry, material);

		const btn = document.createElement("button");
		btn.innerHTML = "⭕";

		btn.addEventListener("click", () => {
			this.hidden = !this.hidden;
			if (this.hidden) {
				sphere.visible = false;
				btn.innerHTML = "X";
			} else {
				sphere.visible = true;
				btn.innerHTML = "⭕";
			}
		});

		const properties = document.createElement("div");
		properties.innerHTML = `<h3>Vanishing Point Sphere</h3><p>Visualizes the unit sphere used for vanishing point direction hypotheses.</p>`;

		this.sphere = sphere;
		this.button = btn;
		this.properties = properties;
	}

	async onEnable(ctx: AddonContext) {
		if (!this.sphere || !this.button || !this.properties) return;

		ctx.viewport.scene.add(this.sphere);
		ctx.ui.widgets.appendChild(this.button);
		ctx.ui.propertyPanel.appendChild(this.properties);
	}

	async onDisable(ctx: AddonContext) {
		if (!this.sphere || !this.button || !this.properties) return;

		ctx.viewport.scene.remove(this.sphere);
		ctx.ui.widgets.removeChild(this.button);
		ctx.ui.propertyPanel.removeChild(this.properties);
	}

	async onDestroy(_: AddonContext) {
		if (!this.sphere || !this.button || !this.properties) return;

		this.sphere.geometry.dispose();
		if (Array.isArray(this.sphere.material)) {
			this.sphere.material.forEach(material => material.dispose());
		} else {
			this.sphere.material.dispose();
		}

		this.sphere = undefined;
		this.button = undefined;
		this.properties = undefined;
		this.hidden = false;
	}

	exports() {
		return {};
	}
}

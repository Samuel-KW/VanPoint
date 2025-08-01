import * as THREE from "three";
import { Addon, type AddonContext } from "../Addon";

export class GeometryAddon extends Addon {
	id = "demo";
	name = "Demo Addon";

	private cube?: THREE.Mesh;
	private grid?: THREE.GridHelper;
	private button?: HTMLButtonElement;
	private properties?: HTMLDivElement;
	private hidden = false;

	async onRegister(_: AddonContext) {
		const geometry = new THREE.BoxGeometry(1, 1, 1);
		const material = new THREE.MeshPhongMaterial({
			color: 0xff0000,
			flatShading: true,
			transparent: true,
			opacity: 0.5
		});
		const cube = new THREE.Mesh(geometry, material);
		
		const grid = new THREE.GridHelper(9, 9);
		grid.position.set(0, -0.5, 0);

		const btn = document.createElement("button");
		btn.textContent = "▢";
		btn.addEventListener("click", () => {
			if (this.hidden) {
				cube.visible = true;
				grid.visible = true;
			} else {
				cube.visible = false;
				grid.visible = false;
			}
			this.hidden = !this.hidden;
		});

		const properties = document.createElement("div");
		properties.innerHTML = `<h3>Geometry Properties</h3>`;
		
		this.cube = cube;
		this.grid = grid;
		this.button = btn;
		this.properties = properties;
	}

	async onEnable(ctx: AddonContext) {
		if (!this.cube || !this.grid || !this.button || !this.properties) {
			return;
		}

		ctx.viewport.scene.add(this.cube);
		ctx.viewport.scene.add(this.grid);
		
		ctx.ui.widgets.appendChild(this.button);
		ctx.ui.propertyPanel.appendChild(this.properties);
	}

	async onDisable(ctx: AddonContext) {
		if (!this.cube || !this.grid || !this.button || !this.properties) {
			return;
		}

		ctx.viewport.scene.remove(this.cube);
		ctx.viewport.scene.remove(this.grid);

		ctx.ui.widgets.removeChild(this.button);
		ctx.ui.propertyPanel.removeChild(this.properties);
	}

	async onDestroy(_: AddonContext) {
		if (!this.cube || !this.grid || !this.button || !this.properties) {
			return;
		}

		if (Array.isArray(this.cube.material)) {
			this.cube.material.forEach(material => material.dispose());
		} else {
			this.cube.material.dispose();
		}
		this.cube.geometry.dispose();
		this.grid.geometry.dispose();
		this.grid.material.dispose();

		this.cube = undefined;
		this.grid = undefined;
		this.button = undefined;
		this.properties = undefined;
		this.hidden = false;
	}

	exports() {
		return { demoStatus: this.enabled };
	}
}

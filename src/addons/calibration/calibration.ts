import * as THREE from "three";
import { Addon, type AddonContext } from "../Addon";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export class CalibrationAddon extends Addon {
	id = "calibration";
	name = "Camera Calibratino";
	description = "Tools to calibrate camera parameters";

	private camera?: THREE.PerspectiveCamera;
	private button?: HTMLButtonElement;
	private properties?: HTMLDivElement;

	async onRegister(ctx: AddonContext) {
		this.camera = ctx.viewport.camera

		this.button = document.createElement("button");
		this.button.innerHTML = "📷";
		this.button.addEventListener("click", () => {
			if (!this.camera) {
				return;
			}

			const pos = this.randomPointOnSphere([0, 0, 0], 10);
			this.camera.position.set(pos[0], pos[1], pos[2]);
			this.camera.lookAt(0, 0, 0);
			this.camera.updateProjectionMatrix();

			ctx.events.emit("calibration:reset");
		});

		this.properties = document.createElement("div");
		this.properties.innerHTML = `<h3>Camera Settings</h3>`;
	}

	async onEnable(ctx: AddonContext) {
		if (!this.button || !this.properties) {
			return;
		}

		this.camera = ctx.viewport.camera

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

		this.camera = undefined;
		this.button = undefined;
		this.properties = undefined;
	}

	exports() {
		return { camera: this.camera };
	}

	/**
	 * Returns a random point on the surface of a sphere.
	 * @param center A 3D point representing the center of the sphere [x, y, z].
	 * @param radius The radius of the sphere.
	 * @returns A point [x, y, z] on the surface of the sphere.
	 */
	randomPointOnSphere(center: [number, number, number], radius: number): [number, number, number] {
		const u = Math.random();
		const v = Math.random();

		const theta = 2 * Math.PI * u; // azimuthal angle
		const phi = Math.acos(2 * v - 1); // polar angle

		// Convert spherical coordinates to Cartesian
		const x = radius * Math.sin(phi) * Math.cos(theta);
		const y = radius * Math.sin(phi) * Math.sin(theta);
		const z = radius * Math.cos(phi);

		// Translate to the given center
		return [
			center[0] + x,
			center[1] + y,
			center[2] + z,
		];
	}
}

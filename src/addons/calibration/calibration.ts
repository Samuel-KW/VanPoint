import * as THREE from "three";
import { Addon, type AddonContext } from "../Addon";

export class CalibrationAddon extends Addon {
	id = "calibration";
	name = "Camera Calibratino";
	description = "Tools to calibrate camera parameters";

	private camera?: THREE.PerspectiveCamera;
	private button?: HTMLButtonElement;
	private properties?: HTMLDivElement;

	private vanishingPointsListener?: (points: [number, number, number][]) => void;

	async onRegister(ctx: AddonContext) {
		this.camera = ctx.viewport.camera;

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

		this.camera = ctx.viewport.camera;

		this.vanishingPointsListener = (points) => this.onVanishingPoints(points);
		ctx.events.on("calibration:vanishingPoints", this.vanishingPointsListener);

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

	onVanishingPoints(points: [number, number, number][]) {
		console.log(points);

		if (points.length === 1) {

		}
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

	leastSquaresIntersection(lines: [[number, number, number, number]]): [number, number] | null {
		let A = 0, B = 0, C = 0, D = 0, E = 0;

		for (const [x1, y1, x2, y2] of lines) {
			const dx = x2 - x1;
			const dy = y2 - y1;
			const lenSq = dx * dx + dy * dy;

			if (lenSq === 0) continue; // skip degenerate lines

			// Unit direction vector
			const ux = dx / Math.sqrt(lenSq);
			const uy = dy / Math.sqrt(lenSq);

			// Projection matrix: P = I - d*d^T
			// Applied to point difference: P(p - a)
			const nx = -uy;
			const ny = ux;

			// Coefficients for normal equation system
			const nxx = nx * nx;
			const nxy = nx * ny;
			const nyy = ny * ny;

			A += nxx;
			B += nxy;
			C += nyy;

			const dot = nx * x1 + ny * y1;
			D += nx * dot;
			E += ny * dot;
		}

		const det = A * C - B * B;
		if (Math.abs(det) < 1e-10) {
			return null; // Ill-conditioned system (all lines parallel)
		}

		const x = (C * D - B * E) / det;
		const y = (A * E - B * D) / det;

		return [x, y];
	}

	/**
	 * Computes the 3D direction vector from a vanishing point in image space.
	 * @param vp - Vanishing point [x, y] in pixels
	 * @param focalLength - Focal length in pixels (e.g., fx = fy = f)
	 * @param principalPoint - Principal point [cx, cy] in pixels
	 * @returns 3D direction vector (not normalized)
	 */
	vanishingPointToDirection(
		vp: [number, number],
		focalLength: number,
		principalPoint: [number, number]
	): [number, number, number] {
		const [x, y] = vp;
		const [cx, cy] = principalPoint;

		// Convert to normalized camera coordinates using inverse of K
		const dx = (x - cx) / focalLength;
		const dy = (y - cy) / focalLength;
		const dz = 1;

		return [dx, dy, dz];
	}
}

import * as THREE from "three";
import { Addon, type AddonContext } from "../Addon";

const tanHalfFov = (fov: number) => Math.tan((fov * Math.PI) / 360);

const hfovFromVfov = (vfovDeg: number, aspect: number) =>
	2 * Math.atan(Math.tan((vfovDeg * Math.PI) / 360) * aspect);

export class PreviewAddon extends Addon {
	id = "previewImage";
	name = "Image Preview";
	description = "Adds a 3D preview of the uploaded image"

	private geometry?: THREE.PlaneGeometry;
	private material?: THREE.MeshBasicMaterial;
	private mesh?: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;

	private button?: HTMLButtonElement;
	private properties?: HTMLDivElement;

	private hidden = false;

	async onRegister(_: AddonContext) {
		const geometry = new THREE.PlaneGeometry(0, 0);
		const material = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			transparent: true,
			opacity: 0.5,
			depthTest: false
		});
		const mesh = new THREE.Mesh(geometry, material);
		mesh.renderOrder = 1;
		mesh.frustumCulled = false;
		mesh.visible = true;

		const btn = document.createElement("button");
		btn.innerHTML = "🔎";
		
		btn.addEventListener("click", () => {
			if (this.hidden) {
				mesh.visible = true;
				btn.innerHTML = "🔎";
			} else {
				mesh.visible = false;
				btn.innerHTML = "X";
			}
			this.hidden = !this.hidden;
		});

		const properties = document.createElement("div");
		properties.innerHTML = `<h3>Image Preview Properties</h3>`;
		
		this.geometry = geometry;
		this.material = material;
		this.mesh = mesh;
		this.button = btn;
		this.properties = properties;
	}

	async onEnable(ctx: AddonContext) {
		if (!this.mesh || !this.button || !this.properties) {
			return;
		}

		ctx.viewport.scene.add(this.mesh);
		ctx.ui.widgets.appendChild(this.button);
		ctx.ui.propertyPanel.appendChild(this.properties);

		ctx.events.on("image:loaded", (image: HTMLImageElement) => {
			if (!this.geometry || !this.material || !this.mesh) {
				return;
			}

			if (this.mesh.material.map) {
				this.mesh.material.map.dispose();
			}
		
			const loader = new THREE.TextureLoader();
			loader.load(image.src, texture => {
				if (!this.material) {
					return;
				}

				const aspect = image.width / image.height;
				this.material.map = texture;
				this.material.needsUpdate = true;
		
				this.updateOverlay(ctx, aspect);
			});
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
		if (!this.mesh || !this.button || !this.properties) {
			return;
		}

		ctx.viewport.scene.remove(this.mesh);
		ctx.ui.widgets.removeChild(this.button);
		ctx.ui.propertyPanel.removeChild(this.properties);
	}

	async onDestroy(_: AddonContext) {
		if (!this.geometry || !this.material || !this.mesh || !this.button || !this.properties) {
			return;
		}

		this.geometry.dispose();
		this.material.dispose();

		this.geometry = undefined;
		this.material = undefined;
		this.mesh = undefined;
		this.button = undefined;
		this.properties = undefined;
		this.hidden = false;
	}

	exports() {
		return { demoStatus: this.enabled };
	}

	updateOverlay(ctx: AddonContext, aspect: number) {
		if (!this.geometry || !this.material || !this.mesh) {
			return;
		}

		const camera = ctx.viewport.camera;

		const viewAspect = ctx.ui.viewport.offsetWidth / ctx.ui.viewport.offsetHeight;
		const isContainFit = aspect <= viewAspect;
	
		const img = this.material.map!.image as HTMLImageElement;
		const width = img.naturalWidth;
		const height = img.naturalHeight;
	
		const distance = isContainFit
			? height / (2 * tanHalfFov(camera.fov))
			: width / (2 * Math.tan(hfovFromVfov(camera.fov, viewAspect) / 2));
	
		this.mesh.geometry.dispose();
		this.mesh.geometry = new THREE.PlaneGeometry(width, height);
	
		const camDir = new THREE.Vector3();
		camera.getWorldDirection(camDir);
		this.mesh.position.copy(camera.position).add(camDir.multiplyScalar(distance));
	
		// Align plane to face the same direction as camera
		this.mesh.quaternion.copy(camera.quaternion);

	}
}

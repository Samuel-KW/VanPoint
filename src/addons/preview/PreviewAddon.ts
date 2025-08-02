import * as THREE from "three";
import { Addon, type AddonContext } from "../Addon";

const tanHalfFov = (fov: number) => Math.tan((fov * Math.PI) / 360);

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
		const geometry = new THREE.PlaneGeometry(1, 1); // Placeholder, resized later
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

	/*
	setImage (imageUrl: string, data: HTMLImageElement) {
		if (!this.geometry || !this.material || !this.mesh) {
			return;
		}

		if (this.mesh.material.map) {
			this.mesh.material.map.dispose();
		}
	
		const loader = new THREE.TextureLoader();
		loader.load(imageUrl, (texture) => {
			if (!this.material) {
				return;
			}

			const aspect = data.width / data.height;
			this.material.map = texture;
			this.material.needsUpdate = true;
	
			this.updateOverlay(aspect);
		});
	}

	updateOverlay (imgAspect: number) {
		if (!this.geometry || !this.material || !this.mesh) {
			return;
		}

		const viewAspect = window.innerWidth / window.innerHeight;
		const isContainFit = imgAspect <= viewAspect;
	
		const img = this.material.map!.image as HTMLImageElement;
		const width = img.naturalWidth;
		const height = img.naturalHeight;
	
		const distance = isContainFit
			? height / (2 * tanHalfFov())
			: width / (2 * Math.tan(hfovFromVfov(camera.fov, viewAspect) / 2));
	
		mesh.geometry.dispose();
		mesh.geometry = new THREE.PlaneGeometry(width, height);
	
		const camDir = new THREE.Vector3();
		camera.getWorldDirection(camDir);
		mesh.position.copy(camera.position).add(camDir.multiplyScalar(distance));
	
		// Align plane to face the same direction as camera
		mesh.quaternion.copy(camera.quaternion);
	};
	*/
}

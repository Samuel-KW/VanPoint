import * as THREE from "three";
import { ViewHelper } from "three/addons/helpers/ViewHelper.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Addon, type AddonContext } from "../Addon";

export class ViewportAddon extends Addon {
	id = "viewport";
	name = "Core viewport addon";

	scene: THREE.Scene | null = null;
	camera: THREE.PerspectiveCamera | null = null;
	renderer: THREE.WebGLRenderer | null = null;
	controls: OrbitControls | null = null;
	helper: ViewHelper | null = null;

	enabled = false;

	async onRegister(_: AddonContext) {
	}

	async onEnable(ctx: AddonContext) {
		this.scene = ctx.viewport.scene;
		this.renderer = ctx.viewport.renderer;
		this.camera = ctx.viewport.camera;

		this.scene.background = new THREE.Color(0xf0f0f0);
		
		const ambientLight = new THREE.AmbientLight(0x222222, 3);
		this.scene.add(ambientLight);
		
		const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
		directionalLight.position.set(20, 20, 0);
		this.scene.add(directionalLight);

		this.camera.position.set(0, 10, 15);
		this.camera.lookAt(0, 0, 0);

		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.autoClear = false;
		ctx.ui.renderArea.appendChild(this.renderer.domElement);

		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.controls.enableRotate = false;
		this.controls.enableZoom = false;
		this.controls.enablePan = false;

		this.helper = new ViewHelper(this.camera, this.renderer.domElement);
		this.helper.setLabels("X", "Y", "Z");

		this.enabled = true;
		this.animate();
	}

	animate() {
		if (!this.enabled) {
			return;
		}
		requestAnimationFrame(() => this.animate());
		if (!this.scene || !this.camera || !this.renderer || !this.helper || !this.controls) {
			return;
		}
		this.renderer.clear();
		this.controls.update();
		this.renderer.render(this.scene, this.camera);
		this.helper.render(this.renderer);
	}

	async onDisable(_: AddonContext) {
		this.enabled = false;
		alert("Warning: You have disabled the core viewport addon. This may cause issues with the application.");
	}

	async onDestroy(ctx: AddonContext) {
		alert("Warning: You have removed the core viewport addon. This may cause issues with the application.");
		
		this.enabled = false;
		const renderArea = ctx.ui.renderArea;
		if (this.scene) {
			this.scene.clear();
		}
		if (this.renderer) {
			this.renderer.dispose();
			if (renderArea) {
				renderArea.innerHTML = "";
			}
		}
		if (this.controls) {
			this.controls.dispose();
		}
		if (this.helper) {
			this.helper.dispose();
		}
		if (renderArea && this.renderer) {
			renderArea.removeChild(this.renderer.domElement);
		}
	}

	exports() {
		return {};
	}
}

import * as THREE from "three";
import { ViewHelper } from "three/addons/helpers/ViewHelper.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Addon, type AddonContext } from "../Addon";
import Stats from "three/examples/jsm/libs/stats.module.js";

export class ViewportAddon extends Addon {
	id = "viewport";
	name = "Core viewport addon";

	scene?: THREE.Scene;
	camera?: THREE.PerspectiveCamera;
	renderer?: THREE.WebGLRenderer;
	controls?: OrbitControls;
	helper?: ViewHelper;
	stats?: Stats;

	ambientLight?: THREE.AmbientLight;
	directionalLight?: THREE.DirectionalLight;
	
	ui?: { [key: string]: HTMLElement };
	styles: CSSStyleDeclaration = getComputedStyle(document.documentElement);
	enabled = false;
	debug = false;

	async onRegister(ctx: AddonContext) {
		if (ctx.debug) {
			this.stats = new Stats();
			this.stats.dom.style = "position:absolute;cursor:pointer;opacity:0.9;top:0;right:0;"
			this.debug = true;
		}

		this.ui = ctx.ui;
		const width = window.innerWidth - this.ui.propertyPanel.offsetWidth;
		const height = window.innerHeight - this.ui.toolbar.offsetHeight;

		this.scene = ctx.viewport.scene;
		this.scene.background = new THREE.Color(this.styles.getPropertyValue("--bg-color-3"));

		this.renderer = ctx.viewport.renderer;
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(width, height);
		this.renderer.autoClear = false;

		this.camera = ctx.viewport.camera;
		this.camera.position.set(0, 10, 15);
		this.camera.lookAt(0, 0, 0);

		this.ambientLight = new THREE.AmbientLight(0x222222, 3);

		this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
		this.directionalLight.position.set(20, 20, 0);

		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.controls.enableRotate = false;
		this.controls.enableZoom = false;
		this.controls.enablePan = false;
		
		this.helper = new ViewHelper(this.camera, this.renderer.domElement);
		this.helper.setLabels("X", "Y", "Z");
	}

	async onEnable(ctx: AddonContext) {
		if (!this.scene || !this.camera || !this.renderer || !this.controls || !this.helper || !this.ambientLight || !this.directionalLight) {
			return;
		}

		if (ctx.debug && this.stats) {
			ctx.ui.renderArea.appendChild(this.stats.dom);
			this.debug = true;
		}

		window.addEventListener("resize", () => this.onResize());

		this.scene.add(this.ambientLight);
		this.scene.add(this.directionalLight);

		ctx.ui.renderArea.appendChild(this.renderer.domElement);

		this.ui = ctx.ui;
		this.enabled = true;
		this.animate();
	}	

	async onDisable(ctx: AddonContext) {
		if (!this.scene || !this.camera || !this.renderer || !this.ambientLight || !this.directionalLight) {
			return;
		}

		alert("Warning: You have disabled the core viewport addon. This may cause issues with the application.");
	
		if (ctx.debug && this.stats) {
			ctx.ui.renderArea.removeChild(this.stats.dom);
		}

		window.removeEventListener("resize", () => this.onResize());

		this.scene.remove(this.ambientLight);
		this.scene.remove(this.directionalLight);
		
		ctx.ui.renderArea.removeChild(this.renderer.domElement);
		this.enabled = false;
		this.viewport = undefined;
	}

	async onDestroy(_: AddonContext) {
		if (!this.scene || !this.camera || !this.renderer || !this.controls || !this.helper || !this.ambientLight || !this.directionalLight) {
			return;
		}
		this.enabled = false;
		alert("Warning: You have removed the core viewport addon. This may cause issues with the application.");
		
		this.scene.clear();
		this.renderer.dispose();
		this.ambientLight.dispose();
		this.directionalLight.dispose();
		this.controls.dispose();
		this.helper.dispose();

		this.scene = undefined;
		this.camera = undefined;
		this.renderer = undefined;
		this.controls = undefined;
		this.helper = undefined;
		this.stats = undefined;
		this.ambientLight = undefined;
		this.directionalLight = undefined;
		this.ui = undefined;
	}

	exports() {
		return {};
	}

	onResize() {
		if (!this.camera || !this.renderer || !this.ui) {
			return
		}
		const width = window.innerWidth - this.ui.propertyPanel.offsetWidth;
		const height = window.innerHeight - this.ui.toolbar.offsetHeight;
		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix()
		this.renderer.setSize(width, height);
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

		if (this.debug && this.stats) {
			this.stats.update();
		}
	}
}

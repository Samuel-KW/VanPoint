import * as THREE from "three";
import { ViewHelper } from "three/addons/helpers/ViewHelper.js";
import { Addon, type AddonContext } from "../Addon";
import Stats from "three/examples/jsm/libs/stats.module.js";

export class ViewportAddon extends Addon {
	id = "viewport";
	name = "3D viewport addon";
	description = "Adds the 3D viewport";

	private scene?: THREE.Scene;
	private camera?: THREE.PerspectiveCamera;
	private renderer?: THREE.WebGLRenderer;
	private helper?: ViewHelper;
	private stats?: Stats;

	private ambientLight?: THREE.AmbientLight;
	private directionalLight?: THREE.DirectionalLight;
	
	private position = { x: 0, y: 0 };
	private dragListener?: (data: { x: number, y: number, dX: number, dY: number }) => void;
	private imageLoadListener?: ({ width, height }: { width: number, height: number }) => void;
	
	private debug = false;

	async onRegister(ctx: AddonContext) {
		if (ctx.debug) {
			this.stats = new Stats();
			this.stats.dom.style = "position:absolute;cursor:pointer;opacity:0.9;top:0;left:5em;z-index:7;";
			this.debug = true;
		}

		const width = ctx.ui.viewport.offsetWidth;
		const height = ctx.ui.viewport.offsetHeight;

		this.scene = ctx.viewport.scene;

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
		
		this.helper = new ViewHelper(this.camera, this.renderer.domElement);
		this.helper.setLabels("X", "Y", "Z");
	}

	async onEnable(ctx: AddonContext) {
		if (!this.scene || !this.camera || !this.renderer || !this.helper || !this.ambientLight || !this.directionalLight) {
			return;
		}

		if (ctx.debug && this.stats) {
			ctx.ui.viewport.appendChild(this.stats.dom);
			this.debug = true;
		}

		this.dragListener = data => this.drag(data, ctx);
		ctx.events.on("viewport:drag", this.dragListener);

		this.imageLoadListener = ({ width, height }: { width: number, height: number }) => {
			const availWidth = ctx.ui.viewport.offsetWidth;
			const availHeight = ctx.ui.viewport.offsetHeight;

			const scale = Math.min(availWidth / width, availHeight / height);
			const scaledWidth = width * scale;
			const scaledHeight = height * scale;

			ctx.viewport.renderer.setSize(scaledWidth, scaledHeight);
			ctx.viewport.camera.aspect = scaledWidth / scaledHeight;
			ctx.viewport.camera.updateProjectionMatrix();
		}
		ctx.events.on("image:load", this.imageLoadListener);

		this.scene.add(this.ambientLight);
		this.scene.add(this.directionalLight);

		ctx.ui.viewport.appendChild(this.renderer.domElement);

		this.animate();
	}	

	async onDisable(ctx: AddonContext) {
		if (!this.scene || !this.camera || !this.renderer || !this.ambientLight || !this.directionalLight || !this.dragListener || !this.imageLoadListener) {
			return;
		}

		console.warn("Warning: You have disabled the core viewport addon. This may cause issues with the application.");
	
		if (ctx.debug && this.stats) {
			ctx.ui.viewport.removeChild(this.stats.dom);
		}

		ctx.events.off("image:load", this.imageLoadListener);
		ctx.events.off("viewport:drag", this.dragListener);

		this.scene.remove(this.ambientLight);
		this.scene.remove(this.directionalLight);
		
		ctx.ui.viewport.removeChild(this.renderer.domElement);
	}

	async onDestroy(_: AddonContext) {
		if (!this.scene || !this.camera || !this.renderer || !this.helper || !this.ambientLight || !this.directionalLight) {
			return;
		}
		console.warn("Warning: You have removed the core viewport addon. This may cause issues with the application.");
		
		this.scene.clear();
		this.renderer.dispose();
		this.ambientLight.dispose();
		this.directionalLight.dispose();
		this.helper.dispose();

		this.scene = undefined;
		this.camera = undefined;
		this.renderer = undefined;
		this.helper = undefined;
		this.stats = undefined;
		this.ambientLight = undefined;
		this.directionalLight = undefined;

		this.dragListener = undefined;
		this.imageLoadListener = undefined;
	}

	exports() {
		return { viewHelper: this.helper };
	}

	animate() {
		if (!this.enabled) {
			return;
		}
		requestAnimationFrame(() => this.animate());
		if (!this.scene || !this.camera || !this.renderer || !this.helper) {
			return;
		}

		this.renderer.clear();
		this.renderer.render(this.scene, this.camera);
		this.helper.render(this.renderer);

		if (this.debug && this.stats) {
			this.stats.update();
		}
	}

	drag(data: { x: number, y: number, dX: number, dY: number }, ctx: AddonContext) {
		if (!this.enabled) {
			return;
		}
		this.position.x += data.dX;
		this.position.y += data.dY;

		const parent = ctx.viewport.renderer.domElement;
		parent.style.left = `${this.position.x}px`;
		parent.style.top = `${this.position.y}px`;
	}
}

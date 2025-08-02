import * as THREE from "three";
import { ViewHelper } from "three/addons/helpers/ViewHelper.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Addon, type AddonContext } from "../Addon";
import Stats from "three/examples/jsm/libs/stats.module.js";

export class ViewportAddon extends Addon {
	id = "viewport";
	name = "Core viewport addon";
	description = "Adds the 3D viewport";

	private scene?: THREE.Scene;
	private camera?: THREE.PerspectiveCamera;
	private renderer?: THREE.WebGLRenderer;
	private controls?: OrbitControls;
	private helper?: ViewHelper;
	private stats?: Stats;

	private ambientLight?: THREE.AmbientLight;
	private directionalLight?: THREE.DirectionalLight;
	
	private offset = { x: 0, y: 0 };
	private position = { x: 0, y: 0 };
	private initialPos = { x: 0, y: 0 };
	private dragging = false;
	private dragEndListener?: (event: MouseEvent | TouchEvent) => void;
	private dragStartListener?: (event: MouseEvent | TouchEvent) => void;
	private dragListener?: (event: MouseEvent | TouchEvent) => void;
	private imageLoadListener?: (image: HTMLImageElement) => void;
	
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
			ctx.ui.viewport.appendChild(this.stats.dom);
			this.debug = true;
		}

		this.dragStartListener = (event: MouseEvent | TouchEvent) => this.dragStart(event, ctx);
		ctx.ui.viewport.addEventListener("mousedown", this.dragStartListener);
		ctx.ui.viewport.addEventListener("touchstart", this.dragStartListener);
		
		this.dragEndListener = () => this.dragEnd();
		window.addEventListener("mouseup", this.dragEndListener);
		window.addEventListener("touchend", this.dragEndListener);
		
		this.dragListener = (event: MouseEvent | TouchEvent) => this.drag(event, ctx);
		window.addEventListener("mousemove", this.dragListener);
		window.addEventListener("touchmove", this.dragListener);

		this.imageLoadListener = (image: HTMLImageElement) => {
			const availWidth = ctx.ui.viewport.offsetWidth;
			const availHeight = ctx.ui.viewport.offsetHeight;

			const imgWidth = image.naturalWidth;
			const imgHeight = image.naturalHeight;

			const scale = Math.min(availWidth / imgWidth, availHeight / imgHeight);
			const width = imgWidth * scale;
			const height = imgHeight * scale;

			ctx.viewport.renderer.setSize(width, height);
			ctx.viewport.camera.aspect = width / height;
			ctx.viewport.camera.updateProjectionMatrix();
		}
		ctx.events.on("image:loaded", this.imageLoadListener);

		this.scene.add(this.ambientLight);
		this.scene.add(this.directionalLight);

		ctx.ui.viewport.appendChild(this.renderer.domElement);

		this.animate();
	}	

	async onDisable(ctx: AddonContext) {
		if (!this.scene || !this.camera || !this.renderer || !this.ambientLight || !this.directionalLight || !this.dragEndListener || !this.dragStartListener || !this.dragListener || !this.imageLoadListener) {
			return;
		}

		console.warn("Warning: You have disabled the core viewport addon. This may cause issues with the application.");
	
		if (ctx.debug && this.stats) {
			ctx.ui.viewport.removeChild(this.stats.dom);
		}

		ctx.ui.viewport.removeEventListener("mousedown", this.dragStartListener);
		ctx.ui.viewport.removeEventListener("touchstart", this.dragStartListener);
		window.removeEventListener("mouseup", this.dragEndListener);
		window.removeEventListener("touchend", this.dragEndListener);
		window.removeEventListener("mousemove", this.dragListener);
		window.removeEventListener("touchmove", this.dragListener);
		ctx.events.off("image:loaded", this.imageLoadListener);

		this.scene.remove(this.ambientLight);
		this.scene.remove(this.directionalLight);
		
		ctx.ui.viewport.removeChild(this.renderer.domElement);
	}

	async onDestroy(_: AddonContext) {
		if (!this.scene || !this.camera || !this.renderer || !this.controls || !this.helper || !this.ambientLight || !this.directionalLight) {
			return;
		}
		console.warn("Warning: You have removed the core viewport addon. This may cause issues with the application.");
		
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

		this.dragStartListener = undefined;
		this.dragEndListener = undefined;
		this.dragListener = undefined;
		this.imageLoadListener = undefined;
	}

	exports() {
		return {};
	}

	animate() {
		if (!this.enabled) {
			return;
		}
		requestAnimationFrame(() => this.animate());
		if (!this.scene || !this.camera || !this.renderer || !this.helper || !this.controls) {
			return;
		}

		this.camera.position.x += 0.01;
		this.camera.position.y += 0.01;
		this.camera.lookAt(0, 0, 0);

		this.renderer.clear();
		this.controls.update();
		this.renderer.render(this.scene, this.camera);
		this.helper.render(this.renderer);

		if (this.debug && this.stats) {
			this.stats.update();
		}
	}

	dragStart(event: MouseEvent | TouchEvent, ctx: AddonContext) {
		if (!this.enabled) {
			return;
		}

		let posX, posY;

		if (event instanceof TouchEvent) {
			posX = event.touches[0].clientX;
			posY = event.touches[0].clientY;
		} else {
			posX = event.clientX;
			posY = event.clientY;
		}

		this.initialPos.x = posX - this.offset.x;
		this.initialPos.y = posY - this.offset.y;

		this.dragging = true;
		
		this.drag(event, ctx);
	}

	dragEnd() {
		if (!this.enabled) {
			return;
		}
		this.initialPos.x = this.position.x;
		this.initialPos.y = this.position.y;
		this.dragging = false;
	}

	drag(event: MouseEvent | TouchEvent, ctx: AddonContext) {
		if (!this.enabled || !this.renderer || !this.dragging) {
			return;
		}
		
		let currentX, currentY;
		if (event instanceof TouchEvent) {
			currentX = event.touches[0].clientX;
			currentY = event.touches[0].clientY;
		} else {
			currentX = event.clientX;
			currentY = event.clientY;
		}
		currentX -= this.initialPos.x;
		currentY -= this.initialPos.y;

		this.offset.x = currentX;
		this.offset.y = currentY;

		this.position.x = currentX;
		this.position.y = currentY;

		const parent = ctx.viewport.renderer.domElement;
		parent.style.left = `${this.position.x}px`;
		parent.style.top = `${this.position.y}px`;
	}
}

import * as THREE from "three";
import { Addon, type AddonContext } from "../Addon";

const svgShown = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="width:100%;height:100%;" viewBox="0 0 512 512"><defs><clipPath id="b"><rect width="512" height="512"/></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(-26.125 -38.216)"><path d="M217.749,110.608,25.625-.5-166.5,110.608V332.825L25.625,443.933V221.716" transform="translate(256.5 72.5)" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"/><path d="M25.625,332.828,217.749,204.8V-.5L25.625,110.608-166.5-.5" transform="translate(256.5 183.608)" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"/></g></g></svg>`;
const svgHidden = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="width:100%;height:100%;" viewBox="0 0 512 512"><defs><clipPath id="b"><rect width="512" height="512"/></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(-26.125 -38.216)"><path d="M217.749,110.608,25.625-.5-166.5,110.608V332.825L25.625,443.933V221.716" transform="translate(256.5 72.5)" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"/><path d="M217.749,221.716V-.5L25.625,110.608-166.5-.5" transform="translate(256.5 183.608)" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"/></g><g transform="translate(-23.3 2.491)"><g transform="translate(-3152 21.274)" stroke-linecap="round" stroke-linejoin="round"><path d="M 3514.85498046875 450.3437194824219 L 3513.0966796875 450.3305969238281 C 3432.60595703125 449.126953125 3382.580322265625 370.5726928710938 3380.489990234375 367.2292175292969 L 3378.17626953125 363.5281372070312 L 3380.251220703125 359.6881103515625 C 3382.125244140625 356.2200317382812 3427.175048828125 274.7507629394531 3516.603515625 274.6715087890625 C 3606.230712890625 274.6714782714844 3648.53662109375 356.3978576660156 3650.293701171875 359.876953125 L 3652.250244140625 363.7507629394531 L 3649.866455078125 367.3774719238281 C 3647.639892578125 370.7651062011719 3594.421142578125 450.3437194824219 3514.85498046875 450.3437194824219 Z" stroke="none"/><path d="M 3514.85498046875 442.8437805175781 C 3591.290283203125 442.8437805175781 3643.59912109375 363.258056640625 3643.59912109375 363.258056640625 C 3643.59912109375 363.258056640625 3602.6455078125 282.1714477539062 3516.731201171875 282.1714477539062 C 3516.694580078125 282.1714477539062 3516.64697265625 282.1714782714844 3516.610107421875 282.1715087890625 C 3430.62109375 282.2477722167969 3386.849609375 363.2535705566406 3386.849609375 363.2535705566406 C 3386.849609375 363.2535705566406 3435.87548828125 441.6750183105469 3513.208740234375 442.8314514160156 C 3513.760986328125 442.8397216796875 3514.30517578125 442.8437805175781 3514.85498046875 442.8437805175781 M 3514.85498046875 457.84375 L 3512.984619140625 457.8298034667969 C 3428.45751953125 456.5657653808594 3376.30908203125 374.6898193359375 3374.130615234375 371.2050170898438 C 3371.27001953125 366.6294555664062 3371.087646484375 360.8701171875 3373.653076171875 356.1227722167969 C 3375.61376953125 352.4941711425781 3422.751220703125 267.2546997070312 3516.596923828125 267.1715087890625 C 3610.792724609375 267.1714782714844 3655.146240234375 352.8484497070312 3656.98828125 356.4957275390625 C 3659.408935546875 361.28857421875 3659.083251953125 367.009765625 3656.134033203125 371.4967651367188 C 3653.816650390625 375.0224609375 3598.42041015625 457.84375 3514.85498046875 457.84375 Z" stroke="none" fill="#fff"/></g><ellipse cx="68.549" cy="58.756" rx="68.549" ry="58.756" transform="translate(295.49 325.008)" fill="#fff"/><ellipse cx="39.171" cy="40.022" rx="39.171" ry="40.022" transform="translate(324.442 344.594)"/><g transform="translate(446.698 279.546) rotate(45)" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="15"><rect width="30.542" height="266.641" rx="5" stroke="none"/><rect x="-7.5" y="-7.5" width="45.542" height="281.641" rx="12.5" fill="none"/></g></g></g></svg>`;

export class GeometryAddon extends Addon {
	id = "geometryFitting";
	name = "Geometry Fitting";
	description = "Adds reference geometry for camera fitting"

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
		btn.innerHTML = svgShown;
		
		btn.addEventListener("click", () => {
			if (this.hidden) {
				cube.visible = true;
				grid.visible = true;
				btn.innerHTML = svgShown;
			} else {
				cube.visible = false;
				grid.visible = false;
				btn.innerHTML = svgHidden;
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

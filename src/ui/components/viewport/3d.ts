import * as THREE from "three";
import { ViewHelper } from "three/addons/helpers/ViewHelper.js";
import { context } from "../../../core/context";

const canvas = context.viewport.renderer.domElement;
const viewport = context.ui.viewport;

const { scene, camera, renderer } = context.viewport;

const helper = new ViewHelper(camera, canvas);
helper.setLabels("X", "Y", "Z");

const ambientLight = new THREE.AmbientLight(0x222222, 3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(20, 20, 0);
scene.add(directionalLight);

camera.position.set(0, 10, 15);
camera.lookAt(0, 0, 0);

renderer.setPixelRatio(window.devicePixelRatio);
renderer.autoClear = false;
viewport.appendChild(canvas);

let width = 0;
let height = 0;

context.events.on("image:load", (data: { width: number, height: number }) => {
	width = data.width;
	height = data.height;
});

let wheelEndTimeout: NodeJS.Timeout;
let scaling = false;
export const updateScale3D = (scale: number) => {
	scaling = true;
	const w = width * scale;
	const h = height * scale;
	canvas.style.width = `${w}px`;
	canvas.style.height = `${h}px`;
	camera.aspect = w / h;
	camera.updateProjectionMatrix();

	clearTimeout(wheelEndTimeout);
    wheelEndTimeout = setTimeout(() => {
		scaling = false;
		renderer.setSize(w, h);
	}, 500);
};

export const draw3D = (offset: { x: number, y: number }) => {
	if (!scaling) {
		context.viewport.renderer.clear();
		context.viewport.renderer.render(scene, camera);
		helper.render(renderer);
	}

	canvas.style.top = `${offset.y}px`;
	canvas.style.left = `${offset.x}px`;
};

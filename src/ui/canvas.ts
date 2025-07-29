import * as THREE from "three";
import { ViewHelper } from "three/addons/helpers/ViewHelper.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshPhongMaterial({
	color: 0x00ffff,
	flatShading: true,
	transparent: true,
	opacity: 0.5
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const grid = new THREE.GridHelper(10, 10);
grid.position.set(-0.5, -0.5, -0.5);
scene.add(grid);

const ambientLight = new THREE.AmbientLight(0x222222, 3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(20, 20, 0);
scene.add(directionalLight);

export const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.set(0, 10, 15);
camera.lookAt(0, 0, 0);

export const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.autoClear = false;
document.getElementById("render-area")!.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableRotate = false;
controls.enableZoom = false;
controls.enablePan = false;

const helper = new ViewHelper(camera, renderer.domElement);

function animate() {
	requestAnimationFrame(animate);
	// cube.rotation.x += 0.01;
	// cube.rotation.y += 0.01;
	renderer.clear();
	controls.update();
	renderer.render(scene, camera);
	helper.render(renderer);
}
animate();

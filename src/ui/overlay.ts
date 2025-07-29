import * as THREE from "three";
import { scene, camera, renderer } from "./canvas";
import type { ImageLoadDetail } from "./load_image";

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
scene.add(mesh);

// Used for scale & position calculation
const tanHalfFov = () => Math.tan((camera.fov * Math.PI) / 360);

export const setImage = (imageUrl: string, data: ImageLoadDetail) => {
	if (mesh.material.map) {
		mesh.material.map.dispose();
	}

	const loader = new THREE.TextureLoader();
	loader.load(imageUrl, (texture) => {
		const aspect = data.width / data.height;

		material.map = texture;
		material.needsUpdate = true;

		updateOverlay(aspect);
	});
};

const updateOverlay = (imgAspect: number) => {
	const viewAspect = window.innerWidth / window.innerHeight;
	const isContainFit = imgAspect <= viewAspect;

	const img = material.map!.image as HTMLImageElement;
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

const hfovFromVfov = (vfovDeg: number, aspect: number) =>
	2 * Math.atan(Math.tan((vfovDeg * Math.PI) / 360) * aspect);

window.addEventListener("resize", () => {
	renderer.setSize(window.innerWidth, window.innerHeight, false);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	if (material.map) {
		const img = material.map.image as HTMLImageElement;
		const imgAspect = img.naturalWidth / img.naturalHeight;
		updateOverlay(imgAspect);
	}
});

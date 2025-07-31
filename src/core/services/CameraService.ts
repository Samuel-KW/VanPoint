import { eventBus } from "../events";

export interface CameraParameters {
	K: number[][]; // 3x3 intrinsic matrix
	R: number[][]; // 3x3 rotation matrix
	t: number[];   // translation vector (up to scale)
	fov: number;
	aspect: number;
}

export class CameraService {
	private params: CameraParameters | null = null;

	setParameters(params: CameraParameters) {
		this.params = params;
		eventBus.emit("camera:updated", params);
	}

	getParameters() {
		return this.params;
	}
}

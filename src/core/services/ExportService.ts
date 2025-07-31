import { CameraService } from "./CameraService";

export class ExportService {
	private camera: CameraService;

	constructor() { 
		this.camera = new CameraService();
	}

	exportJSON(): string {
		const params = this.camera.getParameters();
		return JSON.stringify({ camera: params }, null, 2);
	}
}

import { eventBus } from "../events";

export class ViewportService {
	private needsRender = false;

	markDirty() {
		this.needsRender = true;
		eventBus.emit("viewport:dirty");
	}

	clearDirty() {
		this.needsRender = false;
	}

	shouldRender() {
		return this.needsRender;
	}
}

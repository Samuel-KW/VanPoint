type EventCallback = (payload?: any) => void;

class EventBus {
	private listeners: Record<string, EventCallback[]> = {};

	on(event: string, callback: EventCallback) {
		if (!this.listeners[event]) {
			this.listeners[event] = [];
		}
		this.listeners[event].push(callback);
	}

	off(event: string, callback: EventCallback) {
		this.listeners[event] = (this.listeners[event] || []).filter(fn => fn !== callback);
	}

	emit(event: string, payload?: any) {
		(this.listeners[event] ?? []).forEach(fn => fn(payload));
	}
}

export const eventBus = new EventBus();
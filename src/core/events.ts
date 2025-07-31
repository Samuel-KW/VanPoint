type EventHandler<T> = (payload: T) => void;

export class EventBus {
	private handlers: Record<string, EventHandler<any>[]> = {};

	/**
	 * Subscribe to an event
	 * @param event The event name to subscribe to
	 * @param handler The event handler to invoke when the event is emitted
	 */
	on<T = unknown>(event: string, handler: EventHandler<T>): void {
		if (!this.handlers[event]) {
			this.handlers[event] = [];
		}
		this.handlers[event].push(handler);
	}

	/**
	 * Unsubscribe from an event
	 * @param event The event name to unsubscribe from
	 * @param handler The event handler to remove
	 */
	off<T = unknown>(event: string, handler: EventHandler<T>): void {
		this.handlers[event] = (this.handlers[event] || []).filter(h => h !== handler);
	}

	/**
	 * Emit an event
	 * @param event The event name to emit
	 * @param payload The event payload to pass to the handlers
	 */
	emit<T = unknown>(event: string, payload: T): void {
		(this.handlers[event] || []).forEach(handler => handler(payload));
	}
}

export const globalEventBus = new EventBus();
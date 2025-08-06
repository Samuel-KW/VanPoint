type EventHandler<T> = (payload: T) => void;


const handlers: Record<string, EventHandler<any>[]> = {};

/**
 * Subscribe to an event
 * @param event The event name to subscribe to
 * @param handler The event handler to invoke when the event is emitted
 */
const on = (event: string, handler: EventHandler<any>) => {
	if (!handlers[event]) {
		handlers[event] = [];
	}
	handlers[event].push(handler);
};

/**
 * Unsubscribe from an event
 * @param event The event name to unsubscribe from
 * @param handler The event handler to remove
 */
const off = (event: string, handler: EventHandler<any>) => {
	handlers[event] = (handlers[event] || []).filter(h => h !== handler);
};

/**
 * Emit an event
 * @param event The event name to emit
 * @param payload The event payload to pass to the handlers
 */
const emit = (event: string, payload?: any) => {
	(handlers[event] || []).forEach(handler => handler(payload));
};

export { on, off, emit };
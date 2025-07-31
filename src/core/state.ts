type Listener<T> = (state: T) => void;

export class ReactiveState<T extends object> {
	private state: T;
	private listeners: Set<Listener<T>> = new Set();

	constructor(initialState: T) {
		this.state = { ...initialState };
	}

	subscribe(listener: Listener<T>) {
		this.listeners.add(listener);
		listener(this.state);
		return () => this.listeners.delete(listener);
	}

	update(partial: Partial<T>) {
		Object.assign(this.state, partial);
		this.listeners.forEach(cb => cb(this.state));
	}

	get(): T {
		return this.state;
	}
}

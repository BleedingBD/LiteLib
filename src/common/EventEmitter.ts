export default class EventEmitter {
    listeners = new Map<string, Array<(...args: any[]) => void>>();

    on(event: string, listener: (...args: any[]) => void): this {
        this.listeners.has(event) || this.listeners.set(event, []);
        this.listeners.get(event)?.push?.(listener);
        return this;
    }

    off(event: string, listener: (...args: any[]) => void): this {
        if (this.listeners.has(event)) {
            const listeners = this.listeners.get(event);
            const index = listeners!.indexOf(listener);
            if (index > 0) {
                listeners!.splice(index, 1);
            }
        }
        return this;
    }
    
    emit(event: string, ...args: any[]): this {
        if (this.listeners.has(event)) {
            const listeners = this.listeners.get(event)!;
            for (const listener of listeners) {
                listener(...args);
            }
        }
        return this;
    }
}

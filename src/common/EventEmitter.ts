export default class EventEmitter {
    private readonly listeners = new Map<
        string,
        Array<(...args: any[]) => void>
    >();

    /**
     * Listen to an event.
     * @param event the name of the event to listen to
     * @param listener the callback function to be called when the event is emitted
     */
    on(event: string, listener: (...args: any[]) => void): this {
        this.listeners.has(event) || this.listeners.set(event, []);
        this.listeners.get(event)?.push?.(listener);
        return this;
    }

    /**
     * Stop listening to an event.
     * @param event the name of the event to stop listening to
     * @param listener the callback function to be removed
     */
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

    /**
     * Emit an event.
     * @param event the name of the event to emit
     * @param args the arguments to pass to the listeners
     */
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

export default class EventEmitter {
    private readonly listeners;
    /**
     * Listen to an event.
     * @param event the name of the event to listen to
     * @param listener the callback function to be called when the event is emitted
     */
    on(event: string, listener: (...args: any[]) => void): this;
    /**
     * Stop listening to an event.
     * @param event the name of the event to stop listening to
     * @param listener the callback function to be removed
     */
    off(event: string, listener: (...args: any[]) => void): this;
    /**
     * Emit an event.
     * @param event the name of the event to emit
     * @param args the arguments to pass to the listeners
     */
    emit(event: string, ...args: any[]): this;
}

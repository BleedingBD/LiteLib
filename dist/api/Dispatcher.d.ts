declare type UnsubscribeFn = () => void;
declare type Listener = (payload: any) => void;
interface DiscordDispatcher {
    subscribe(action: string, listener: Listener): void;
    unsubscribe(action: string, listener: Listener): void;
    dispatch(payload: any): void;
    dirtyDispatch(payload: any): void;
}
export default class Dispatcher implements DiscordDispatcher {
    readonly ActionTypes: Record<string, string>;
    constructor();
    private readonly subscriptions;
    /**
     * Subscribe to an action.
     * @param action The action to subscribe to
     * @param listener The callback to call when the action is dispatched
     * @returns A function to unsubscribe from the action
     */
    subscribe(action: string, listener: Listener): UnsubscribeFn;
    /**
     * Unsubscribe from an action.
     * @param action The action to unsubscribe from.
     * @param listener The callback to unsubscribe, if not provided all listeners will be unsubscribed.
     */
    unsubscribe(action: string, listener?: Listener): void;
    /**
     * Unsubscribe all listeners from all actions that were subscribed to using this dispatcher.
     */
    unsubscribeAll(): void;
    /**
     * Dispatch an action.
     * @param payload The payload to dispatch
     */
    dispatch(payload: any): void;
    /**
     * Dispatch an action dirtily.
     * @param payload The payload to dispatch
     */
    dirtyDispatch(payload: any): void;
}
export {};

import Logger from "../common/Logger";
import Modules from "../common/Modules";

type UnsubscribeFn = () => void;
type Listener = (payload: any) => void;

interface DiscordDispatcher {
    subscribe(action: string, listener: Listener): void;
    unsubscribe(action: string, listener: Listener): void;
    dispatch(payload: any): void;
    dirtyDispatch(payload: any): void;
}

const discordDispatcher: DiscordDispatcher =
    Modules.findByProps("subscribe", "unsubscribe") ||
    Modules.findByProps("dispatch", "dirtyDispatch");
export default class Dispatcher implements DiscordDispatcher {
    readonly ActionTypes: Record<string, string> =
        Modules.findByProps("ActionTypes")?.ActionTypes;

    constructor() {
        if (!this.ActionTypes) {
            Logger.warn(
                "Dispatcher",
                "ActionTypes not found, defaulting to identity proxy."
            );
            // at the time of writing this is equivalent to Discord's ActionTypes object
            this.ActionTypes = new Proxy(
                {},
                {
                    get: (_, prop) => prop,
                    set: () => false,
                }
            );
        }
    }

    private readonly subscriptions = new Map<string, Set<Listener>>();

    /**
     * Subscribe to an action.
     * @param action The action to subscribe to
     * @param listener The callback to call when the action is dispatched
     * @returns A function to unsubscribe from the action
     */
    subscribe(action: string, listener: Listener): UnsubscribeFn {
        if (!this.subscriptions.has(action)) {
            this.subscriptions.set(action, new Set<Listener>());
        }
        const actionSubscriptions = this.subscriptions.get(action)!;

        if (actionSubscriptions.has(listener)) {
            discordDispatcher.subscribe(action, listener);
            actionSubscriptions.add(listener);
        }

        return () => this.unsubscribe(action, listener);
    }

    /**
     * Unsubscribe from an action.
     * @param action The action to unsubscribe from.
     * @param listener The callback to unsubscribe, if not provided all listeners will be unsubscribed.
     */
    unsubscribe(action: string, listener?: Listener): void {
        if (!this.subscriptions.has(action)) {
            return;
        }

        const actionSubscriptions = this.subscriptions.get(action)!;
        if (listener) {
            if (actionSubscriptions.has(listener)) {
                discordDispatcher.unsubscribe(action, listener);
                actionSubscriptions.delete(listener);
            }
        } else {
            for (const listener of actionSubscriptions) {
                discordDispatcher.unsubscribe(action, listener);
            }
            actionSubscriptions.clear();
        }
    }

    /**
     * Unsubscribe all listeners from all actions that were subscribed to using this dispatcher.
     */
    unsubscribeAll() {
        for (const action of this.subscriptions.keys()) {
            this.unsubscribe(action as string);
        }
        this.subscriptions.clear();
    }

    /**
     * Dispatch an action.
     * @param payload The payload to dispatch
     */
    dispatch(payload: any) {
        return discordDispatcher.dispatch(payload);
    }
    /**
     * Dispatch an action dirtily.
     * @param payload The payload to dispatch
     */
    dirtyDispatch(payload: any) {
        return discordDispatcher.dirtyDispatch(payload);
    }
}

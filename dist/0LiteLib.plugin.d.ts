/// <reference types="react" />
import React from "react";
import { ReactNode } from "react";
import { ToastOptions, BdPlugin } from "../../@types/betterdiscord__bdapi";
declare module ModulesWrapper {
    export { Modules };
}
declare module ApiWrapper {
    export { Api };
}
declare namespace Utilities {
    type NodeChild = Node | string | number;
    type NodeChildren = (NodeChild | NodeChildren | null)[];
    /**
     * Creates a new HTML element in a similar way to React.createElement.
     * @param tag The tag name of the element to create
     * @param attrs The attributes to set on the element
     * @param children The children to append to the element
     * @returns A new HTML element with the given tag name and attributes
     */
    function createHTMLElement(tag: string, attrs?: null | {
        [key: string]: any;
    }, ...children: NodeChildren): HTMLElement;
    /**
     * Wraps a function in a try/catch block, runs it and logs any errors to the console.
     * If async is true and the function returns a Promise, the error will be caught and logged.
     * @param func The function to run
     * @param name An optional name to log the error with
     * @param async If true, returned Promises will be caught and logged
     */
    function suppressErrors(func: () => any, name?: string, async?: boolean): any;
    /**
     * Searches a React node for a child that matches the given predicate.
     * @param root The node to search in
     * @param predicate A function that returns true if the node is the one you want
     * @returns The node that matches the predicate, or undefined if none is found
     */
    function findInReactTree(root: any, predicate: (node: any) => boolean): any;
    /**
     * Turns space-separated class names into a single css selector.
     * @param classes Strings of space-separated class names
     * @returns A css selector that matches all the given classes
     */
    function selectorFromClasses(...classes: string[]): string;
    /**
     * Generic hook that can be used to add a listener to a React node.
     * @param on The function to call when the listener is added, will receive a forceUpdate function as its first argument.
     * @param off The function to call when the listener is removed, will receive a forceUpdate function as its first argument.
     * @param dependencies An array of dependencies that will cause the listener to be re-added when they change.
     * @returns The forceUpdate function that causes a re-render of the component.
     */
    function useGeneric(on: (forceUpdate: () => void) => void, off: (forceUpdate: () => void) => void, ...dependencies: any[]): () => void;
}
declare namespace Core {
    type Predicate = (module: any) => boolean;
    class Modules {
        /**
         * Find a Discord webpack module by its props.
         * This is a memoized version of `BdApi.findModuleByProps`.
         * @param props A list of props to search for, all must be present.
         * @returns The module, or undefined if not found.
         */
        static findByProps(...props: string[]): any;
        /**
         * Find a Discord webpack module by its display name.
         * This is a memoized version of `BdApi.findModuleByDisplayName`.
         * @param displayName The display name to search for.
         * @returns The module, or undefined if not found.
         */
        static findByDisplayName(displayName: string): any;
        static find: (filter: (module: any) => boolean) => any;
        static findAll: (filter: (module: any) => boolean) => any[];
    }
    import StaticModules = ModulesWrapper.Modules;
    class Modules$0 {
        private readonly findCache;
        private readonly findAllCache;
        findByProps: typeof StaticModules.findByProps;
        findByDisplayName: typeof StaticModules.findByDisplayName;
        /**
         * Find a Discord webpack module that matches the predicate.
         * This is a memoized version of the static find method.
         * @param name The name to memoize by
         * @param predicate The predicate to match
         * @returns The module that matches the predicate or undefined if none was found
         */
        find(name: string, predicate: Predicate): any;
        /**
         * Find all Discord webpack modules that match the predicate.
         * This is a memoized version of the static find method.
         * @param name The name to memoize by
         * @param predicate The predicate to match
         * @returns An array of modules that match the predicate or undefined if none was found
         */
        findAll(name: string, predicate: Predicate): any[] | undefined;
    }
    type PatcherBeforeCallback = (thisArg: any, args: any[]) => any;
    type PatcherAfterCallback = (thisArg: any, args: any[], result: any) => any;
    // eslint-disable-next-line @typescript-eslint/ban-types
    type PatcherInsteadCallback = (thisArg: any, args: any[], originalFn: Function) => any;
    type UnpatchFn = () => void;
    type PatcherOptions = {
        type?: "before" | "after" | "instead";
        displayName?: string;
        forcePatch?: boolean;
    };
    interface Patcher {
        /**
         * This method patches onto another function, allowing your code to run beforehand.
         * Using this, you are also able to modify the incoming arguments before the original method is run.
         * @param moduleToPatch Object with the function to be patched. Can also patch an object's prototype.
         * @param functionName Name of the method to be patched
         * @param callback Function to run before the original method
         * @param options Object used to pass additional options.
         * @param options.displayName You can provide meaningful name for class/object provided in `what` param for logging purposes. By default, this function will try to determine name automatically.
         * @param options.forcePatch Set to `true` to patch even if the function doesnt exist. (Adds noop function in place).
         * @return Function with no arguments and no return value that should be called to cancel (unpatch) this patch. You should save and run it when your plugin is stopped.
         */
        before(target: any, methodName: string, callback: PatcherBeforeCallback, options?: PatcherOptions): UnpatchFn;
        /**
         * This method patches onto another function, allowing your code to run after.
         * Using this, you are also able to modify the return value, using the return of your code instead.
         * @param moduleToPatch Object with the function to be patched. Can also patch an object's prototype.
         * @param functionName Name of the method to be patched
         * @param callback Function to run before the original method
         * @param options Object used to pass additional options.
         * @param options.displayName You can provide meaningful name for class/object provided in `what` param for logging purposes. By default, this function will try to determine name automatically.
         * @param options.forcePatch Set to `true` to patch even if the function doesnt exist. (Adds noop function in place).
         * @return Function with no arguments and no return value that should be called to cancel (unpatch) this patch. You should save and run it when your plugin is stopped.
         */
        after(target: any, methodName: string, callback: PatcherAfterCallback, options?: PatcherOptions): UnpatchFn;
        /**
         * This method patches onto another function, allowing your code to run instead.
         * Using this, you are also able to modify the return value, using the return of your code instead.
         * @param moduleToPatch Object with the function to be patched. Can also patch an object's prototype.
         * @param functionName Name of the method to be patched
         * @param callback Function to run before the original method
         * @param options Object used to pass additional options.
         * @param options.displayName You can provide meaningful name for class/object provided in `what` param for logging purposes. By default, this function will try to determine name automatically.
         * @param options.forcePatch Set to `true` to patch even if the function doesnt exist. (Adds noop function in place).
         * @return Function with no arguments and no return value that should be called to cancel (unpatch) this patch. You should save and run it when your plugin is stopped.
         */
        instead(target: any, methodName: string, callback: PatcherInsteadCallback, options?: PatcherOptions): UnpatchFn;
        /**
         * Removes all patches that were done with this Patcher instance.
         */
        unpatchAll(): void;
    }
    function Patcher(pluginName: string): Patcher;
    type RemoveFn = () => void;
    class Styler {
        pluginName: string;
        private styles;
        private index;
        constructor(pluginName: string);
        /**
         * Add a stylesheet to the document.
         * @param style The css string to add as a stylesheet.
         * @returns A function that removes the stylesheet from the document.
         */
        add(style: string): RemoveFn;
        /**
         * Add a stylesheet to the document.
         * @param name The name of the stylesheet, can be used to remove it later.
         * @param style The css string to add as a stylesheet.
         * @returns A function that removes the stylesheet from the document.
         */
        add(name: string, style: string): RemoveFn;
        /**
         * Remove a stylesheet with the given name from the document.
         * @param name The name of the stylesheet to remove.
         */
        remove(name: string): void;
        /**
         * Remove all stylesheets that were added by this Styler instance from the document.
         */
        removeAll(): void;
    }
    type UnsubscribeFn = () => void;
    type Listener = (payload: any) => void;
    interface DiscordDispatcher {
        subscribe(action: string, listener: Listener): void;
        unsubscribe(action: string, listener: Listener): void;
        dispatch(payload: any): void;
        dirtyDispatch(payload: any): void;
    }
    class Dispatcher implements DiscordDispatcher {
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
    class EventEmitter {
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
    class DataStore extends EventEmitter {
        private readonly key;
        private readonly configPath;
        private readonly data;
        constructor(configPath: string, key: string);
        /**
         * Checks if the given key exists in the data store.
         * @param key The key to check for.
         * @returns True if the key exists, false otherwise.
         */
        has(key: string): boolean;
        /**
         * Get the value of the given key, or undefined if it doesn't exist.
         * @param key The key to get the value of.
         * @returns The value of the key, or undefined if it doesn't exist.
         */
        get(key: string): any;
        /**
         * Get the value of the given key, or the default value if it doesn't exist.
         * @param key The key to get the value of.
         * @param defaultValue The default value to return if the key doesn't exist.
         * @returns The value of the key, or the default value if it doesn't exist.
         */
        get(key: string, defaultValue?: NonNullable<any>): NonNullable<any>;
        /**
         * Set the value of the given key.
         * @param key The key to set the value of.
         * @param value The value to set the key to.
         */
        set(key: string, value: any): void;
        /**
         * Modify the value for the target key by calling the given function.
         * The function will be called with the value as the first argument.
         * The return value of the function will be used as the new value.
         * @param key The key to transform the value of.
         * @param modifier The function to transform the value with.
         * @param defaultValue The default value to use if the key doesn't exist.
         */
        modify(key: string, modifier: (value: any) => any, defaultValue?: NonNullable<any>): void;
        /**
         * Delete the given key from the data store.
         * @param key The key to delete.
         */
        delete(key: string): void;
        /**
         * Listen for changes to the data store.
         * @param event The event to listen for.
         * @param listener The listener to call when the data store changes. Receives the key that changed and its new value.
         */
        on(event: "change", listener: (key: string, value: any) => void): this;
        private syncData;
    }
    interface Logger {
        debug(...args: any[]): void;
        info(...args: any[]): void;
        log(...args: any[]): void;
        warn(...args: any[]): void;
        error(...args: any[]): void;
        assert(condition: boolean, ...args: any[]): void;
        trace(...args: any[]): void;
    }
    function Logger(pluginName: string): Logger;
    type CloseFn = () => void;
    interface ButtonDefintion {
        label: string;
        onClick: (close: CloseFn) => void;
    }
    class Modals {
        static showConfirmationDialog: (title: string, content: string, options?: import("../@types/betterdiscord__bdapi").ConfirmationModalOptions | undefined) => void;
        static show(title: string, panel: Node | React.FC | React.Component | ReactNode, buttons?: ButtonDefintion[]): any;
        static showPluginSettings(pluginName: string): void;
        static showPluginChangelog(pluginName: string): void;
    }
    /**
     * This is directly taken from Strencher's Notices API pull request for BetterDiscord.
     * It will be removed and replaced with a thin wrapper around the API once it's merged.
     * As this code is taken from BetterDiscord the respective license applies.
     */
    type CloseFn$0 = (immediately?: boolean) => void;
    type NoticeOptions = {
        type?: "info" | "warning" | "error" | "success";
        buttons?: {
            label: string;
            onClick?: (closeFn: () => void) => void;
        }[];
        timeout?: number;
    };
    class Notices {
        private static get baseClass();
        /** Shorthand for `type = "info"` for {@link module:Notices.show} */
        static info(content: Node | string, options?: NoticeOptions): CloseFn$0 | undefined;
        /** Shorthand for `type = "warning"` for {@link module:Notices.show} */
        static warn(content: Node | string, options?: NoticeOptions): CloseFn$0 | undefined;
        /** Shorthand for `type = "error"` for {@link module:Notices.show} */
        static error(content: Node | string, options?: NoticeOptions): CloseFn$0 | undefined;
        /** Shorthand for `type = "success"` for {@link module:Notices.show} */
        static success(content: Node | string, options?: NoticeOptions): CloseFn$0 | undefined;
        static show(content: Node | string, options?: NoticeOptions): CloseFn$0 | undefined;
        private static ensureContainer;
    }
    class Toasts {
        static show: (content: string, options?: ToastOptions | undefined) => void;
        /** Shorthand for BdApi.showToast with type set to 'success' */
        static success(content: string, options?: ToastOptions): void;
        /** Shorthand for BdApi.showToast with type set to 'info' */
        static info(content: string, options?: ToastOptions): void;
        /** Shorthand for BdApi.showToast with type set to 'warn' */
        static warn(content: string, options?: ToastOptions): void;
        /** Shorthand for BdApi.showToast with type set to 'error' */
        static error(content: string, options?: ToastOptions): void;
    }
    interface API {
        /**
         * Use this to access Discord's internal modules.
         * @example
         * ```js
         * const { Modules } = API;
         * const Flex = Modules.findByDisplayName("Flex");
         */
        Modules: Modules$0;
        /**
         * The Patcher can be used to methods on Discord's modules.
         * @example
         * ```js
         * Patcher.before(DiscordModules.Message, 'sendMessage', (thisArg, [options]) => {
         *    options.content = "foobar";
         * });
         */
        Patcher: ReturnType<typeof Patcher>;
        /**
         * The Styler can be used to add stylesheets to the document.
         * @example
         * ```js
         * const { Styler } = API;
         * Styler.add(`
         * .my-class {
         *   color: red;
         * }
         * `);
         * ```
         */
        Styler: Styler;
        /**
         * The Dispatcher is used to subscribe to actions dispatched by Discord or to dispatch actions to Discord.
         */
        Dispatcher: Dispatcher;
        /**
         * Use this to manage your plugin's data. Changes will automatically be saved to disk.
         *
         * This will be saved to and read from the .config.json file in the plugin folder. The file location can be changed by setting the configPath property in the plugin's metadata.
         *
         * @example
         * ```js
         * const { Data, Toast } = API;
         * Data.modify("noOfLogins", (i) => i + 1, 0);
         * Toast.info(`Welcome back! You've logged in ${Data.get("noOfLogins")} times.`);
         * ```
         */
        Data: DataStore;
        /**
         * Use this to manage your plugin's settings. Changes will automatically be saved to disk.
         *
         * This will be saved to and read from the .config.json file in the plugin folder. The file location can be changed by setting the configPath property in the plugin's metadata.
         *
         * @example
         * ```js
         * const { Settings, Toast } = API;
         * Toast.info(`Welcome back, ${Settings.get("name", "User")}!`);
         * ```
         */
        Settings: DataStore;
        /**
         * Use this to log messages to the console. This makes logs look fancy by prefixing the messages with the name of the plugin.
         *
         * @example
         * ```js
         * const { Logger } = API;
         * Logger.debug("This is a debug message");
         * Logger.info("This is an info message");
         * Logger.log("This is a standard log message");
         * Logger.warn("This is a warning message");
         * Logger.error("This is an error message");
         * ```
         */
        Logger: ReturnType<typeof Logger>;
        // Completely static API parts
        /**
         * Use this to show modals to the user.
         *
         * This is a reference to the static Modals api, which will hopefully soon just be a thin wrapper around the BdApi.showModal method.
         * @example
         * ```js
         * const { Modals } = API;
         * Modals.show("Hello World", "This is a modal");
         * ```
         **/
        Modals: Modals;
        /**
         * Use this to show a notices to the user. Notices are small bars at the top of Discord's UI which can be dismissed by the user.
         *
         * This is a reference to the static Toasts api, which will hopefully soon just be a thin wrapper around the BdApi.showNotice method.
         * @example
         * ```
         * const { Notices } = Api;
         * Notices.success("You did it!");
         * Notices.info("Important information");
         * Notices.warning("This might not work");
         * Notices.error("You broke something");
         * ```
         **/
        Notices: Notices;
        /**
         * Use this to show a toast messages.
         *
         * This is a reference to the static Toasts api, which is a thin wrapper around the BdApi.showToast method.
         *
         * @example
         * ```
         * const {Toasts} = Api;
         * Toasts.success("You did it!");
         * Toasts.info("Important information");
         * Toasts.warning("This might not work");
         * Toasts.error("You broke something");
         * ```
         **/
        Toasts: Toasts;
        /**
         * Discord's instance of the React library. This can be used to create React components.
         *
         * @example
         * ```js
         * const { React, ReactDOM } = Api;
         * const Component = React.memo(() => {
         *    return React.createElement("div", null, "Hello World!");
         * });
         * ReactDOM.render(React.createElement(Component), document.getElementById("root"));
         * ```
         **/
        React: typeof BdApi.React;
        /**
         * Discord's instance of the React DOM library. This can be used to render React components.
         * @see {@link API.React}
         **/
        ReactDOM: typeof BdApi.ReactDOM;
    }
    class Api implements API {
        private readonly pluginMetadata;
        private readonly pluginName;
        get Modules(): Modules$0;
        get Patcher(): Patcher;
        get Styler(): Styler;
        get Dispatcher(): Dispatcher;
        get Data(): DataStore;
        get Settings(): DataStore;
        get Logger(): Logger;
        // Completely static API parts
        Modals: typeof Modals;
        Notices: typeof Notices;
        Toasts: typeof Toasts;
        React: typeof import("react");
        ReactDOM: any;
        constructor(pluginMetadata: Record<string, string>);
    }
    import API = ApiWrapper.Api;
    interface LiteLibPlugin extends BdPlugin {
        /**
         * The plugin's API instance. Automatically created on construction.
         */
        readonly API: API;
        /**
         * The plugin file's JSDoc metadata fields. Automatically assigned on construction.
         */
        readonly metadata: Record<string, string>;
        /**
         * The name of the plugin. Automatically assigned on construction.
         */
        readonly name: string;
        /**
         * Called once when the plugin is loaded.
         * Do your plugin initialization here.
         */
        initialize?(api: API): void;
        /**
         * Called once when the plugin is first loaded.
         * The first load will only count when this method is present,
         * so you may add this to do one time initialization even as an afterthought.
         */
        firstLoad?(api: API): void;
        /**
         * Called when the plugin is started.
         * Do stuff that should be done every time the plugin starts or restarts here.
         * This can for example be used to subscribe to Dispatcher actions.
         */
        setup?(api: API): void;
        /**
         * Called when the plugin is started, or the reloadPatches method is called.
         * Do your module patches using the Patcher in here.
         * Unless unpatch is unpatching should be taken care of automatically.
         */
        patch?(api: API): void;
        /**
         * Called when the plugin is started, or the reloadStyles method is called.
         * Add your style using the Styler in here.
         * Unless unstyle is removing the styles should be taken care of automatically.
         */
        style?(api: API): void;
        /**
         * Called when the plugin is stopped.
         * Do stuff that should be done every time the plugin stops here.
         * This can for example be used to unsubscribe from Dispatcher actions.
         */
        cleanup?(api: API): void;
        /**
         * Called when the plugin is stopped, or the reloadPatches method is called.
         * Remove your patches here. If not overridden this defaults unpatching all Patcher patches.
         */
        unpatch?(api: API): void;
        /**
         * Called when the plugin is stopped, or the reloadStyles method is called.
         * Remove your styles here. If not overridden this defaults removing all Styler styles.
         */
        unstyle?(api: API): void;
        /** Remove and reapply all patches. */
        reloadPatches(): void;
        /** Remove and reapply all styles. */
        reloadStyles(): void;
        /** A react hook that will automatically trigger a re-render when any plugin setting changes. */
        useSettings(): API;
        /** A react hook that will automatically trigger a re-render when any plugin data changes. */
        useData(): API;
        /**
         * Wraps a function in a try/catch block, runs it and logs any errors to the console.
         * If async is true and the function returns a Promise, the error will be caught and logged.
         * @param func The function to run
         * @param async If true, returned Promises will be caught and logged
         */
        suppressErrors(func: () => any, async?: boolean): any;
        /**
         * The css string returned by this method will automatically be added to the document as a stylesheet regardless of whether `style` has been overridden.
         * Use this easily apply static stylesheets that are required by your plugin.
         */
        css?(): string;
        /**
         * This method will be called if any plugin data changes.
         * @param key The key that of the data field that changed.
         * @param value The new value of the field or undefined if the field was deleted.
         */
        onDataChanged?(key: string, value: any): void;
        /**
         * This method will be called if any plugin setting.
         * @param key The key that of the setting that changed.
         * @param value The new value of the setting or undefined if the setting was deleted.
         */
        onSettingsChanged?(key: string, value: any): void;
    }
    abstract class PluginBase implements LiteLibPlugin {
        readonly metadata: Record<string, string>;
        readonly name: string;
        readonly API: API;
        constructor(metadata: Record<string, string>);
        load(): void;
        initialize?(api: API): void;
        firstLoad?(api: API): void;
        checkForFirstLaunch(): Promise<void>;
        checkForChangelog(): Promise<void>;
        checkForUpdate(): Promise<void>;
        start(): void;
        setup?(api: API): void;
        patch?(api: API): void;
        style?(api: API): void;
        stop(): void;
        cleanup?(api: API): void;
        unpatch?({ Patcher }: API): void;
        unstyle?({ Styler }: API): void;
        reloadPatches(): void;
        reloadStyles(): void;
        useSettings(): API;
        useData(): API;
        getChangelogPanel?(): Node | React.FC | React.Component | string;
        css?(): string;
        suppressErrors(func: () => any, async?: boolean): any;
        onDataChanged?(key: string, value: any): void;
        onSettingsChanged?(key: string, value: any): void;
    }
    /**
     * This function will create a new plugin class for your plugin. It will automatically set the metadata for you.
     * The returned class should be extended by your plugin class.
     * @returns A plugin class that extends PluginBase. Extend this class to create a plugin.
     */
    function (): typeof PluginBase & {
        new (): PluginBase;
    };
    class Updater {
        static checkForUpdate(metadata: Record<string, string>): Promise<boolean | undefined>;
        private static fetchMetadata;
    }
    class Logger$0 {
        private static style;
        static debug(name: string, ...args: any[]): void;
        static info(name: string, ...args: any[]): void;
        static log(name: string, ...args: any[]): void;
        static warn(name: string, ...args: any[]): void;
        static error(name: string, ...args: any[]): void;
        static assert(condition: boolean, name: string, ...args: any[]): void;
        static trace(name: string, ...args: any[]): void;
    }
    export { default as Plugin };
}
declare global {
    const LiteLib: typeof Core;
    interface Window {
        LiteLib: typeof Core;
    }
}
type Predicate = (module: any) => boolean;
declare class Modules {
    /**
     * Find a Discord webpack module by its props.
     * This is a memoized version of `BdApi.findModuleByProps`.
     * @param props A list of props to search for, all must be present.
     * @returns The module, or undefined if not found.
     */
    static findByProps(...props: string[]): any;
    /**
     * Find a Discord webpack module by its display name.
     * This is a memoized version of `BdApi.findModuleByDisplayName`.
     * @param displayName The display name to search for.
     * @returns The module, or undefined if not found.
     */
    static findByDisplayName(displayName: string): any;
    static find: (filter: (module: any) => boolean) => any;
    static findAll: (filter: (module: any) => boolean) => any[];
}
declare module ModulesWrapper {
    export { Modules };
}
import StaticModules = ModulesWrapper.Modules;
declare class Modules$0 {
    private readonly findCache;
    private readonly findAllCache;
    findByProps: typeof StaticModules.findByProps;
    findByDisplayName: typeof StaticModules.findByDisplayName;
    /**
     * Find a Discord webpack module that matches the predicate.
     * This is a memoized version of the static find method.
     * @param name The name to memoize by
     * @param predicate The predicate to match
     * @returns The module that matches the predicate or undefined if none was found
     */
    find(name: string, predicate: Predicate): any;
    /**
     * Find all Discord webpack modules that match the predicate.
     * This is a memoized version of the static find method.
     * @param name The name to memoize by
     * @param predicate The predicate to match
     * @returns An array of modules that match the predicate or undefined if none was found
     */
    findAll(name: string, predicate: Predicate): any[] | undefined;
}
type PatcherBeforeCallback = (thisArg: any, args: any[]) => any;
type PatcherAfterCallback = (thisArg: any, args: any[], result: any) => any;
// eslint-disable-next-line @typescript-eslint/ban-types
type PatcherInsteadCallback = (thisArg: any, args: any[], originalFn: Function) => any;
type UnpatchFn = () => void;
type PatcherOptions = {
    type?: "before" | "after" | "instead";
    displayName?: string;
    forcePatch?: boolean;
};
interface Patcher {
    /**
     * This method patches onto another function, allowing your code to run beforehand.
     * Using this, you are also able to modify the incoming arguments before the original method is run.
     * @param moduleToPatch Object with the function to be patched. Can also patch an object's prototype.
     * @param functionName Name of the method to be patched
     * @param callback Function to run before the original method
     * @param options Object used to pass additional options.
     * @param options.displayName You can provide meaningful name for class/object provided in `what` param for logging purposes. By default, this function will try to determine name automatically.
     * @param options.forcePatch Set to `true` to patch even if the function doesnt exist. (Adds noop function in place).
     * @return Function with no arguments and no return value that should be called to cancel (unpatch) this patch. You should save and run it when your plugin is stopped.
     */
    before(target: any, methodName: string, callback: PatcherBeforeCallback, options?: PatcherOptions): UnpatchFn;
    /**
     * This method patches onto another function, allowing your code to run after.
     * Using this, you are also able to modify the return value, using the return of your code instead.
     * @param moduleToPatch Object with the function to be patched. Can also patch an object's prototype.
     * @param functionName Name of the method to be patched
     * @param callback Function to run before the original method
     * @param options Object used to pass additional options.
     * @param options.displayName You can provide meaningful name for class/object provided in `what` param for logging purposes. By default, this function will try to determine name automatically.
     * @param options.forcePatch Set to `true` to patch even if the function doesnt exist. (Adds noop function in place).
     * @return Function with no arguments and no return value that should be called to cancel (unpatch) this patch. You should save and run it when your plugin is stopped.
     */
    after(target: any, methodName: string, callback: PatcherAfterCallback, options?: PatcherOptions): UnpatchFn;
    /**
     * This method patches onto another function, allowing your code to run instead.
     * Using this, you are also able to modify the return value, using the return of your code instead.
     * @param moduleToPatch Object with the function to be patched. Can also patch an object's prototype.
     * @param functionName Name of the method to be patched
     * @param callback Function to run before the original method
     * @param options Object used to pass additional options.
     * @param options.displayName You can provide meaningful name for class/object provided in `what` param for logging purposes. By default, this function will try to determine name automatically.
     * @param options.forcePatch Set to `true` to patch even if the function doesnt exist. (Adds noop function in place).
     * @return Function with no arguments and no return value that should be called to cancel (unpatch) this patch. You should save and run it when your plugin is stopped.
     */
    instead(target: any, methodName: string, callback: PatcherInsteadCallback, options?: PatcherOptions): UnpatchFn;
    /**
     * Removes all patches that were done with this Patcher instance.
     */
    unpatchAll(): void;
}
declare function Patcher(pluginName: string): Patcher;
type RemoveFn = () => void;
declare class Styler {
    pluginName: string;
    private styles;
    private index;
    constructor(pluginName: string);
    /**
     * Add a stylesheet to the document.
     * @param style The css string to add as a stylesheet.
     * @returns A function that removes the stylesheet from the document.
     */
    add(style: string): RemoveFn;
    /**
     * Add a stylesheet to the document.
     * @param name The name of the stylesheet, can be used to remove it later.
     * @param style The css string to add as a stylesheet.
     * @returns A function that removes the stylesheet from the document.
     */
    add(name: string, style: string): RemoveFn;
    /**
     * Remove a stylesheet with the given name from the document.
     * @param name The name of the stylesheet to remove.
     */
    remove(name: string): void;
    /**
     * Remove all stylesheets that were added by this Styler instance from the document.
     */
    removeAll(): void;
}
type UnsubscribeFn = () => void;
type Listener = (payload: any) => void;
interface DiscordDispatcher {
    subscribe(action: string, listener: Listener): void;
    unsubscribe(action: string, listener: Listener): void;
    dispatch(payload: any): void;
    dirtyDispatch(payload: any): void;
}
declare class Dispatcher implements DiscordDispatcher {
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
declare class EventEmitter {
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
declare class DataStore extends EventEmitter {
    private readonly key;
    private readonly configPath;
    private readonly data;
    constructor(configPath: string, key: string);
    /**
     * Checks if the given key exists in the data store.
     * @param key The key to check for.
     * @returns True if the key exists, false otherwise.
     */
    has(key: string): boolean;
    /**
     * Get the value of the given key, or undefined if it doesn't exist.
     * @param key The key to get the value of.
     * @returns The value of the key, or undefined if it doesn't exist.
     */
    get(key: string): any;
    /**
     * Get the value of the given key, or the default value if it doesn't exist.
     * @param key The key to get the value of.
     * @param defaultValue The default value to return if the key doesn't exist.
     * @returns The value of the key, or the default value if it doesn't exist.
     */
    get(key: string, defaultValue?: NonNullable<any>): NonNullable<any>;
    /**
     * Set the value of the given key.
     * @param key The key to set the value of.
     * @param value The value to set the key to.
     */
    set(key: string, value: any): void;
    /**
     * Modify the value for the target key by calling the given function.
     * The function will be called with the value as the first argument.
     * The return value of the function will be used as the new value.
     * @param key The key to transform the value of.
     * @param modifier The function to transform the value with.
     * @param defaultValue The default value to use if the key doesn't exist.
     */
    modify(key: string, modifier: (value: any) => any, defaultValue?: NonNullable<any>): void;
    /**
     * Delete the given key from the data store.
     * @param key The key to delete.
     */
    delete(key: string): void;
    /**
     * Listen for changes to the data store.
     * @param event The event to listen for.
     * @param listener The listener to call when the data store changes. Receives the key that changed and its new value.
     */
    on(event: "change", listener: (key: string, value: any) => void): this;
    private syncData;
}
interface Logger {
    debug(...args: any[]): void;
    info(...args: any[]): void;
    log(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
    assert(condition: boolean, ...args: any[]): void;
    trace(...args: any[]): void;
}
declare function Logger(pluginName: string): Logger;
type CloseFn = () => void;
interface ButtonDefintion {
    label: string;
    onClick: (close: CloseFn) => void;
}
declare class Modals {
    static showConfirmationDialog: (title: string, content: string, options?: import("../@types/betterdiscord__bdapi").ConfirmationModalOptions | undefined) => void;
    static show(title: string, panel: Node | React.FC | React.Component | ReactNode, buttons?: ButtonDefintion[]): any;
    static showPluginSettings(pluginName: string): void;
    static showPluginChangelog(pluginName: string): void;
}
/**
 * This is directly taken from Strencher's Notices API pull request for BetterDiscord.
 * It will be removed and replaced with a thin wrapper around the API once it's merged.
 * As this code is taken from BetterDiscord the respective license applies.
 */
type CloseFn$0 = (immediately?: boolean) => void;
type NoticeOptions = {
    type?: "info" | "warning" | "error" | "success";
    buttons?: {
        label: string;
        onClick?: (closeFn: () => void) => void;
    }[];
    timeout?: number;
};
declare class Notices {
    private static get baseClass();
    /** Shorthand for `type = "info"` for {@link module:Notices.show} */
    static info(content: Node | string, options?: NoticeOptions): CloseFn$0 | undefined;
    /** Shorthand for `type = "warning"` for {@link module:Notices.show} */
    static warn(content: Node | string, options?: NoticeOptions): CloseFn$0 | undefined;
    /** Shorthand for `type = "error"` for {@link module:Notices.show} */
    static error(content: Node | string, options?: NoticeOptions): CloseFn$0 | undefined;
    /** Shorthand for `type = "success"` for {@link module:Notices.show} */
    static success(content: Node | string, options?: NoticeOptions): CloseFn$0 | undefined;
    static show(content: Node | string, options?: NoticeOptions): CloseFn$0 | undefined;
    private static ensureContainer;
}
declare class Toasts {
    static show: (content: string, options?: ToastOptions | undefined) => void;
    /** Shorthand for BdApi.showToast with type set to 'success' */
    static success(content: string, options?: ToastOptions): void;
    /** Shorthand for BdApi.showToast with type set to 'info' */
    static info(content: string, options?: ToastOptions): void;
    /** Shorthand for BdApi.showToast with type set to 'warn' */
    static warn(content: string, options?: ToastOptions): void;
    /** Shorthand for BdApi.showToast with type set to 'error' */
    static error(content: string, options?: ToastOptions): void;
}
interface API {
    /**
     * Use this to access Discord's internal modules.
     * @example
     * ```js
     * const { Modules } = API;
     * const Flex = Modules.findByDisplayName("Flex");
     */
    Modules: Modules$0;
    /**
     * The Patcher can be used to methods on Discord's modules.
     * @example
     * ```js
     * Patcher.before(DiscordModules.Message, 'sendMessage', (thisArg, [options]) => {
     *    options.content = "foobar";
     * });
     */
    Patcher: ReturnType<typeof Patcher>;
    /**
     * The Styler can be used to add stylesheets to the document.
     * @example
     * ```js
     * const { Styler } = API;
     * Styler.add(`
     * .my-class {
     *   color: red;
     * }
     * `);
     * ```
     */
    Styler: Styler;
    /**
     * The Dispatcher is used to subscribe to actions dispatched by Discord or to dispatch actions to Discord.
     */
    Dispatcher: Dispatcher;
    /**
     * Use this to manage your plugin's data. Changes will automatically be saved to disk.
     *
     * This will be saved to and read from the .config.json file in the plugin folder. The file location can be changed by setting the configPath property in the plugin's metadata.
     *
     * @example
     * ```js
     * const { Data, Toast } = API;
     * Data.modify("noOfLogins", (i) => i + 1, 0);
     * Toast.info(`Welcome back! You've logged in ${Data.get("noOfLogins")} times.`);
     * ```
     */
    Data: DataStore;
    /**
     * Use this to manage your plugin's settings. Changes will automatically be saved to disk.
     *
     * This will be saved to and read from the .config.json file in the plugin folder. The file location can be changed by setting the configPath property in the plugin's metadata.
     *
     * @example
     * ```js
     * const { Settings, Toast } = API;
     * Toast.info(`Welcome back, ${Settings.get("name", "User")}!`);
     * ```
     */
    Settings: DataStore;
    /**
     * Use this to log messages to the console. This makes logs look fancy by prefixing the messages with the name of the plugin.
     *
     * @example
     * ```js
     * const { Logger } = API;
     * Logger.debug("This is a debug message");
     * Logger.info("This is an info message");
     * Logger.log("This is a standard log message");
     * Logger.warn("This is a warning message");
     * Logger.error("This is an error message");
     * ```
     */
    Logger: ReturnType<typeof Logger>;
    // Completely static API parts
    /**
     * Use this to show modals to the user.
     *
     * This is a reference to the static Modals api, which will hopefully soon just be a thin wrapper around the BdApi.showModal method.
     * @example
     * ```js
     * const { Modals } = API;
     * Modals.show("Hello World", "This is a modal");
     * ```
     **/
    Modals: Modals;
    /**
     * Use this to show a notices to the user. Notices are small bars at the top of Discord's UI which can be dismissed by the user.
     *
     * This is a reference to the static Toasts api, which will hopefully soon just be a thin wrapper around the BdApi.showNotice method.
     * @example
     * ```
     * const { Notices } = Api;
     * Notices.success("You did it!");
     * Notices.info("Important information");
     * Notices.warning("This might not work");
     * Notices.error("You broke something");
     * ```
     **/
    Notices: Notices;
    /**
     * Use this to show a toast messages.
     *
     * This is a reference to the static Toasts api, which is a thin wrapper around the BdApi.showToast method.
     *
     * @example
     * ```
     * const {Toasts} = Api;
     * Toasts.success("You did it!");
     * Toasts.info("Important information");
     * Toasts.warning("This might not work");
     * Toasts.error("You broke something");
     * ```
     **/
    Toasts: Toasts;
    /**
     * Discord's instance of the React library. This can be used to create React components.
     *
     * @example
     * ```js
     * const { React, ReactDOM } = Api;
     * const Component = React.memo(() => {
     *    return React.createElement("div", null, "Hello World!");
     * });
     * ReactDOM.render(React.createElement(Component), document.getElementById("root"));
     * ```
     **/
    React: typeof BdApi.React;
    /**
     * Discord's instance of the React DOM library. This can be used to render React components.
     * @see {@link API.React}
     **/
    ReactDOM: typeof BdApi.ReactDOM;
}
declare class Api implements API {
    private readonly pluginMetadata;
    private readonly pluginName;
    get Modules(): Modules$0;
    get Patcher(): Patcher;
    get Styler(): Styler;
    get Dispatcher(): Dispatcher;
    get Data(): DataStore;
    get Settings(): DataStore;
    get Logger(): Logger;
    // Completely static API parts
    Modals: typeof Modals;
    Notices: typeof Notices;
    Toasts: typeof Toasts;
    React: typeof import("react");
    ReactDOM: any;
    constructor(pluginMetadata: Record<string, string>);
}
declare module ApiWrapper {
    export { Api };
}
import API = ApiWrapper.Api;
interface LiteLibPlugin extends BdPlugin {
    /**
     * The plugin's API instance. Automatically created on construction.
     */
    readonly API: API;
    /**
     * The plugin file's JSDoc metadata fields. Automatically assigned on construction.
     */
    readonly metadata: Record<string, string>;
    /**
     * The name of the plugin. Automatically assigned on construction.
     */
    readonly name: string;
    /**
     * Called once when the plugin is loaded.
     * Do your plugin initialization here.
     */
    initialize?(api: API): void;
    /**
     * Called once when the plugin is first loaded.
     * The first load will only count when this method is present,
     * so you may add this to do one time initialization even as an afterthought.
     */
    firstLoad?(api: API): void;
    /**
     * Called when the plugin is started.
     * Do stuff that should be done every time the plugin starts or restarts here.
     * This can for example be used to subscribe to Dispatcher actions.
     */
    setup?(api: API): void;
    /**
     * Called when the plugin is started, or the reloadPatches method is called.
     * Do your module patches using the Patcher in here.
     * Unless unpatch is unpatching should be taken care of automatically.
     */
    patch?(api: API): void;
    /**
     * Called when the plugin is started, or the reloadStyles method is called.
     * Add your style using the Styler in here.
     * Unless unstyle is removing the styles should be taken care of automatically.
     */
    style?(api: API): void;
    /**
     * Called when the plugin is stopped.
     * Do stuff that should be done every time the plugin stops here.
     * This can for example be used to unsubscribe from Dispatcher actions.
     */
    cleanup?(api: API): void;
    /**
     * Called when the plugin is stopped, or the reloadPatches method is called.
     * Remove your patches here. If not overridden this defaults unpatching all Patcher patches.
     */
    unpatch?(api: API): void;
    /**
     * Called when the plugin is stopped, or the reloadStyles method is called.
     * Remove your styles here. If not overridden this defaults removing all Styler styles.
     */
    unstyle?(api: API): void;
    /** Remove and reapply all patches. */
    reloadPatches(): void;
    /** Remove and reapply all styles. */
    reloadStyles(): void;
    /** A react hook that will automatically trigger a re-render when any plugin setting changes. */
    useSettings(): API;
    /** A react hook that will automatically trigger a re-render when any plugin data changes. */
    useData(): API;
    /**
     * Wraps a function in a try/catch block, runs it and logs any errors to the console.
     * If async is true and the function returns a Promise, the error will be caught and logged.
     * @param func The function to run
     * @param async If true, returned Promises will be caught and logged
     */
    suppressErrors(func: () => any, async?: boolean): any;
    /**
     * The css string returned by this method will automatically be added to the document as a stylesheet regardless of whether `style` has been overridden.
     * Use this easily apply static stylesheets that are required by your plugin.
     */
    css?(): string;
    /**
     * This method will be called if any plugin data changes.
     * @param key The key that of the data field that changed.
     * @param value The new value of the field or undefined if the field was deleted.
     */
    onDataChanged?(key: string, value: any): void;
    /**
     * This method will be called if any plugin setting.
     * @param key The key that of the setting that changed.
     * @param value The new value of the setting or undefined if the setting was deleted.
     */
    onSettingsChanged?(key: string, value: any): void;
}
declare abstract class PluginBase implements LiteLibPlugin {
    readonly metadata: Record<string, string>;
    readonly name: string;
    readonly API: API;
    constructor(metadata: Record<string, string>);
    load(): void;
    initialize?(api: API): void;
    firstLoad?(api: API): void;
    checkForFirstLaunch(): Promise<void>;
    checkForChangelog(): Promise<void>;
    checkForUpdate(): Promise<void>;
    start(): void;
    setup?(api: API): void;
    patch?(api: API): void;
    style?(api: API): void;
    stop(): void;
    cleanup?(api: API): void;
    unpatch?({ Patcher }: API): void;
    unstyle?({ Styler }: API): void;
    reloadPatches(): void;
    reloadStyles(): void;
    useSettings(): API;
    useData(): API;
    getChangelogPanel?(): Node | React.FC | React.Component | string;
    css?(): string;
    suppressErrors(func: () => any, async?: boolean): any;
    onDataChanged?(key: string, value: any): void;
    onSettingsChanged?(key: string, value: any): void;
}
declare const default_base: typeof PluginBase & (new () => PluginBase);
export { default };

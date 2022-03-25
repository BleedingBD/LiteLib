/// <reference types="react" />
import Modules from "./Modules";
import Patcher from "./Patcher";
import Styler from "./Styler";
import Dispatcher from "./Dispatcher";
import DataStore from "./DataStore";
import Logger from "./Logger";
import Modals from "@common/Modals";
import Notices from "@common/Notices";
import Toasts from "@common/Toasts";
export interface API {
    /**
     * Use this to access Discord's internal modules.
     * @example
     * ```js
     * const { Modules } = API;
     * const Flex = Modules.findByDisplayName("Flex");
     */
    Modules: Modules;
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
export default class Api implements API {
    private readonly pluginMetadata;
    private readonly pluginName;
    get Modules(): Modules;
    get Patcher(): import("./Patcher").Patcher;
    get Styler(): Styler;
    get Dispatcher(): Dispatcher;
    get Data(): DataStore;
    get Settings(): DataStore;
    get Logger(): import("./Logger").Logger;
    Modals: typeof Modals;
    Notices: typeof Notices;
    Toasts: typeof Toasts;
    React: typeof import("react");
    ReactDOM: typeof import("react-dom");
    constructor(pluginMetadata: Record<string, string>);
}

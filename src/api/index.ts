import Data from "./Data";
import Dispatcher from "./Dispatcher";
import Logger from "./Logger";
import Modules from "./Modules";
import Patcher from "./Patcher";
import Styler from "./Styler";
import Modals from "@common/Modals";
import Notices from "@common/Notices";
import Toasts from "@common/Toasts";

export default class API{
    Modules: Modules;
    Patcher: Patcher;
    Styler: Styler;
    Dispatcher: Dispatcher;
    Data: any;
    Settings: any;
    Logger: Logger;
    // Completely static API parts
    Modals = Modals;
    Notices = Notices;
    Toasts = Toasts;
    React = BdApi.React;
    ReactDOM = BdApi.ReactDOM;

    constructor(pluginName: string){
        this.Modules = new Modules();
        this.Patcher = new Patcher(pluginName);
        this.Styler = new Styler(pluginName);
        this.Dispatcher = new Dispatcher();
        this.Logger = new Logger(pluginName);
        const data = Data(pluginName);
        this.Data = data.data;
        this.Settings = data.settings;
    }
}

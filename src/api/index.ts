import { Memoize } from 'typescript-memoize';
import Modules from "./Modules";
import Patcher from "./Patcher";
import Styler from "./Styler";
import Dispatcher from "./Dispatcher";
import DataStore from './DataStore';
import Logger from "./Logger";
import Modals from "@common/Modals";
import Notices from "@common/Notices";
import Toasts from "@common/Toasts";

export interface API {
    Modules: Modules;
    Patcher: ReturnType<typeof Patcher>;
    Styler: Styler;
    Dispatcher: Dispatcher;
    Data: DataStore;
    Settings: DataStore;
    Logger: ReturnType<typeof Logger>;
    // Completely static API parts
    Modals: Modals;
    Notices: Notices;
    Toasts: Toasts;
    React: typeof BdApi.React;
    ReactDOM: typeof BdApi.ReactDOM;
}

export default class Api{
    private readonly pluginMetadata: Record<string, string>;
    private readonly pluginName: string;

    @Memoize() get Modules() { return new Modules(); }
    @Memoize() get Patcher() { return Patcher(this.pluginName); }
    @Memoize() get Styler() { return new Styler(this.pluginName); }
    @Memoize() get Dispatcher() { return new Dispatcher(); }
    @Memoize() get Data() { return new DataStore(this.pluginMetadata.configPath?.replace?.(/.config.json$/, "") || this.pluginName, "data"); }
    @Memoize() get Settings(){ return new DataStore(this.pluginMetadata.configPath?.replace?.(/.config.json$/, "") || this.pluginName, "settings"); }
    @Memoize() get Logger() { return Logger(this.pluginName); }
    // Completely static API parts
    Modals = Modals;
    Notices = Notices;
    Toasts = Toasts;
    React = BdApi.React;
    ReactDOM = BdApi.ReactDOM;

    constructor(pluginMetadata: Record<string, string>){
        this.pluginMetadata = pluginMetadata;
        this.pluginName = pluginMetadata.name;
    }
}

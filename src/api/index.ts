import { Memoize } from 'typescript-memoize';
import DataStore from "./DataStore";
import Dispatcher from "./Dispatcher";
import Logger from "./Logger";
import Modules from "./Modules";
import Patcher from "./Patcher";
import Styler from "./Styler";
import Modals from "@common/Modals";
import Notices from "@common/Notices";
import Toasts from "@common/Toasts";

export interface API {
    Modules: Modules;
    Patcher: ReturnType<typeof Patcher>;
    Styler: Styler;
    Dispatcher: Dispatcher;
    Data: any;
    Settings: any;
    Logger: ReturnType<typeof Logger>;
    // Completely static API parts
    Modals: Modals;
    Notices: Notices;
    Toasts: Toasts;
    React: typeof BdApi.React;
    ReactDOM: typeof BdApi.ReactDOM;
}

export default class Api{
    private readonly pluginName: string;

    @Memoize() get Modules() { return new Modules(); }
    @Memoize() get Patcher() { return Patcher(this.pluginName); }
    @Memoize() get Styler() { return new Styler(this.pluginName); }
    @Memoize() get Dispatcher() { return new Dispatcher(); }
    @Memoize() get Data() { return DataStore(this.pluginName,"data").store; }
    @Memoize() get Settings(){ return DataStore(this.pluginName,"settings").store; }
    @Memoize() get Logger() { return Logger(this.pluginName); }
    // Completely static API parts
    Modals = Modals;
    Notices = Notices;
    Toasts = Toasts;
    React = BdApi.React;
    ReactDOM = BdApi.ReactDOM;

    constructor(pluginName: string){
        this.pluginName = pluginName;
    }
}

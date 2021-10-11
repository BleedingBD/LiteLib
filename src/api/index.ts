import Data from "./Data";
import Dispatcher from "./Dispatcher";
import Logger from "./Logger";
import Modules from "./Modules";
import Patcher from "./Patcher";
import Styler from "./Styler";

export default class API{
    Modules: Modules;
    Patcher: Patcher;
    Styler: Styler;
    Dispatcher: Dispatcher;
    Data: Data;
    Logger: Logger;
    React = BdApi.React;
    ReactDOM = BdApi.ReactDOM;

    constructor(pluginName: string){
        this.Modules = new Modules();
        this.Patcher = new Patcher(pluginName);
        this.Styler = new Styler(pluginName);
        this.Dispatcher = new Dispatcher();
        this.Logger = new Logger(pluginName);
        this.Data = new Data(pluginName);
    }
}

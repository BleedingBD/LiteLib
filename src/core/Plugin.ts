/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Updater from "./Updater";
import API from "../api";

export declare interface Plugin {
    API: API;
    name: string;

    load(): void;
    initialize(api: API): void;

    start(): void;
    setup(api: API): void;
    patch(api: API): void;
    style(api: API): void;

    stop(): void;
    cleanup(api: API): void;
    unpatch(api: API): void;
    unstyle(api: API): void;
}

export abstract class PluginBase implements Plugin {
    API: API;
    name!: string;

    constructor(pluginName: string){
        this.API = new API(pluginName);
    }

    load(): void {
        Updater.checkForUpdate(this.name);
        this.initialize(this.API);
    }
    initialize(api: API): void{}

    start(): void {
        this.setup(this.API);
        this.patch(this.API);
        this.style(this.API);
    }
    setup(api: API): void{}
    patch(api: API): void{}
    style(api: API): void{}

    stop(): void {
        this.cleanup(this.API);
        this.unpatch(this.API);
        this.unstyle(this.API)
    }
    cleanup(api: API): void{}
    unpatch({Patcher}: API): void{ Patcher.unpatchAll(); }
    unstyle({Styler}: API): void{ Styler.removeAll(); }
}

export default function(pluginName: string): typeof PluginBase & {new(): PluginBase} {
    return class extends PluginBase {
        constructor() {
            super(pluginName);
        }
    }
}

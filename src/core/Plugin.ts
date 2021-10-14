/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Updater from "./Updater";
import API from "../api";
import React from "react";

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
    readonly name: string;
    readonly API: API;

    constructor(pluginName: string){
        this.name = pluginName;
        this.API = new API(pluginName);
    }

    load(): void {
        setTimeout(()=>this.checkForUpdate,0);
        setTimeout(()=>this.checkForChangelog(),0);
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

    async checkForUpdate(): Promise<void> {
        await Updater.checkForUpdate(this.name);
    }
    async checkForChangelog(): Promise<void> {
        if (typeof this.getChangelogPanel == "function") {
            const currentVersion = BdApi.Plugins.get(this.name)?.version;
            if (!currentVersion) return;
            if (!("version" in this.API.Data) || (this.API.Data.version != currentVersion)) {
                this.API.Modals.showPluginChangelog(this.name);
                this.API.Data.version = currentVersion;
            } 
        }
    }

    getChangelogPanel?(): Node|React.FC|React.Component|string;
}

export default function(pluginName: string): typeof PluginBase & {new(): PluginBase} {
    return class extends PluginBase {
        constructor() {
            super(pluginName);
        }
    }
}

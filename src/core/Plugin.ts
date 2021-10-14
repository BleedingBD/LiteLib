/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Updater from "./Updater";
import API from "../api";
import React from "react";
import { BdPlugin } from "../../@types/betterdiscord__bdapi";

export declare interface LiteLibPlugin extends BdPlugin {
    API: API;
    name: string;

    initialize?(api: API): void;
    firstLoad?(api: API): void;

    setup?(api: API): void;
    patch?(api: API): void;
    style?(api: API): void;

    cleanup?(api: API): void;
    unpatch?(api: API): void;
    unstyle?(api: API): void;
}

export abstract class PluginBase implements LiteLibPlugin {
    readonly name: string;
    readonly API: API;

    constructor(pluginName: string){
        this.name = pluginName;
        this.API = new API(pluginName);
    }

    load(): void {
        if(typeof this.firstLoad == "function") setTimeout(()=>this.checkForFirstLaunch(),0);
        if(typeof this.getChangelogPanel == "function") setTimeout(()=>this.checkForChangelog(),0);
        setTimeout(()=>this.checkForUpdate,0);
        if(typeof this.initialize == "function") this.initialize(this.API);
    }
    initialize?(api: API): void;
    firstLoad?(api: API): void;

    start(): void {
        if(typeof this.setup == "function") this.setup(this.API);
        if(typeof this.patch == "function") this.patch(this.API);
        if(typeof this.style == "function") this.style(this.API);
    }
    setup?(api: API): void;
    patch?(api: API): void;
    style?(api: API): void;

    stop(): void {
        if(typeof this.cleanup == "function") this.cleanup(this.API);
        if(typeof this.unpatch == "function") this.unpatch(this.API);
        if(typeof this.unstyle == "function") this.unstyle(this.API)
    }
    cleanup?(api: API): void;
    unpatch?({Patcher}: API): void{ Patcher.unpatchAll(); }
    unstyle?({Styler}: API): void{ Styler.removeAll(); }

    async checkForFirstLaunch(): Promise<void> {
        const Data = this.API.Data;
        if (!("firstLoad" in Data) || !Data.firstLoad) {
            this.firstLoad!(this.API);
            Data.firstLoad = true;
        }
    }
    async checkForChangelog(): Promise<void> {
        const currentVersion = BdApi.Plugins.get(this.name)?.version;
        if (!currentVersion) return;
        if (!("version" in this.API.Data) || (this.API.Data.version != currentVersion)) {
            this.API.Modals.showPluginChangelog(this.name);
            this.API.Data.version = currentVersion;
        }
    }
    async checkForUpdate(): Promise<void> {
        await Updater.checkForUpdate(this.name);
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

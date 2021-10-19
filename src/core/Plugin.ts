/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Updater from "./Updater";
import API from "../api";
import React from "react";
import { BdPlugin } from "../../@types/betterdiscord__bdapi";
import { parseMetadata } from "@common/MetadataParser";

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

    reloadPatches(): void;
    reloadStyles(): void;

    css?(): string;
    getUpdateUrl?(): string;

    onDataChanged?(key: string, value: any): void;
    onSettingsChanged?(key: string, value: any): void;
}

export abstract class PluginBase implements LiteLibPlugin {
    readonly metadata: Record<string, string>;
    readonly name: string;
    readonly API: API;

    constructor(metadata: Record<string, string>) {
        this.metadata = metadata;
        this.name = metadata.name;
        this.API = new API(metadata);
        this.API.Data.on("change", (key, value) => this.onDataChanged?.(key, value));
        this.API.Settings.on("change", (key, value) => this.onSettingsChanged?.(key, value));
    }

    load(): void {
        if(typeof this.firstLoad == "function") setTimeout(()=>this.checkForFirstLaunch(),0);
        if(typeof this.getChangelogPanel == "function") setTimeout(()=>this.checkForChangelog(),0);
        setTimeout(()=>this.checkForUpdate,0);
        this.initialize?.(this.API);
    }
    initialize?(api: API): void;
    firstLoad?(api: API): void;

    async checkForFirstLaunch(): Promise<void> {
        const Data = this.API.Data;
        if (!Data.get("firstLoad")) {
            this.firstLoad!(this.API);
            Data.set("firstLoad", true);
        }
    }
    async checkForChangelog(): Promise<void> {
        const currentVersion = BdApi.Plugins.get(this.name)?.version;
        if (!currentVersion) return;
        if (this.API.Data.get("version", currentVersion) === currentVersion) return;

        this.API.Modals.showPluginChangelog(this.name);
        this.API.Data.set("version", currentVersion);
    }
    async checkForUpdate(): Promise<void> {
        await Updater.checkForUpdate(this.name);
    }

    start(): void {
        const API = this.API;
        this.setup?.(API);
        this.patch?.(API);
        this.style?.(API);
        if(typeof this.css == "function") API.Styler.add("css", this.css());
    }
    setup?(api: API): void;
    patch?(api: API): void;
    style?(api: API): void;

    stop(): void {
        this.cleanup?.(this.API);
        this.unpatch?.(this.API);
        this.unstyle?.(this.API)
    }
    cleanup?(api: API): void;
    unpatch?({Patcher}: API): void{ Patcher.unpatchAll(); }
    unstyle?({Styler}: API): void{ Styler.removeAll(); }

    reloadPatches(): void {
        this.unpatch?.(this.API);
        this.patch?.(this.API);
    }
    reloadStyles(): void {
        this.unstyle?.(this.API);
        this.style?.(this.API);
        if(typeof this.css == "function") this.API.Styler.add("css", this.css());
    }

    getChangelogPanel?(): Node|React.FC|React.Component|string;

    css?(): string;

    onDataChanged?(key: string, value: any): void;
    onSettingsChanged?(key: string, value: any): void;
}

export default function(): typeof PluginBase & {new(): PluginBase} {
    const scriptTag = document.head.querySelector(`script[id$=-script-container]`);
    if (scriptTag && scriptTag.textContent) {
        const metadata = parseMetadata(scriptTag.textContent, false);
        if (metadata?.name) {
            return class extends PluginBase {
                constructor() {
                    super(metadata ?? {});
                }
            }
        }
    }
    return class extends PluginBase {
        constructor() {
            super({name: "Invalid Plugin", description: "The metadata for the plugin couldn't be loaded.", version: "?.?.?"});
        }
    }
}

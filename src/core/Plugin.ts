/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Updater from "./Updater";
import API from "../api";
import React from "react";
import { BdPlugin } from "../../@types/betterdiscord__bdapi";
import { parseMetadata } from "@common/MetadataParser";
import { useGeneric } from "@common/Utilities";

export declare interface LiteLibPlugin extends BdPlugin {
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
        this.checkForUpdate();
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
        const { Data, Modals } = this.API;
        const currentVersion = this.metadata.version;
        if (!currentVersion) return;
        if (Data.get("version", currentVersion) === currentVersion) return;

        Modals.showPluginChangelog(this.name);
        Data.set("version", currentVersion);
    }
    async checkForUpdate(): Promise<void> {
        await Updater.checkForUpdate(this.metadata);
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

    useSettings(): API {
        const { Settings } = this.API;
        useGeneric(
            (forceUpdate)=>Settings.on("change",forceUpdate),
            (forceUpdate)=>{Settings.off("change", forceUpdate)},
            Settings
        );
        return this.API;
    }
    useData(): API {
        const { Data } = this.API;
        useGeneric(
            (forceUpdate)=>Data.on("change",forceUpdate),
            (forceUpdate)=>{Data.off("change", forceUpdate)},
            Data
        );
        return this.API;
    }

    getChangelogPanel?(): Node|React.FC|React.Component|string;

    css?(): string;

    onDataChanged?(key: string, value: any): void;
    onSettingsChanged?(key: string, value: any): void;
}

/**
 * This function will create a new plugin class for your plugin. It will automatically set the metadata for you.
 * The returned class should be extended by your plugin class.
 * @returns A plugin class that extends PluginBase. Extend this class to create a plugin.
 */
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

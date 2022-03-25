import { BdPlugin } from "@betterdiscord/bdapi";
import API from "../api";
import React from "react";
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
     * Wraps a function in a try/catch block, runs it and logs any errors to the console.
     * If async is true and the function returns a Promise, the error will be caught and logged.
     * @param func The function to run
     * @param async If true, returned Promises will be caught and logged
     */
    suppressErrors(func: () => any, async?: boolean): any;
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
export declare abstract class PluginBase implements LiteLibPlugin {
    readonly metadata: Record<string, string>;
    readonly name: string;
    readonly API: API;
    constructor(metadata: Record<string, string>);
    load(): void;
    initialize?(api: API): void;
    firstLoad?(api: API): void;
    checkForFirstLaunch(): Promise<void>;
    checkForChangelog(): Promise<void>;
    checkForUpdate(): Promise<void>;
    start(): void;
    setup?(api: API): void;
    patch?(api: API): void;
    style?(api: API): void;
    stop(): void;
    cleanup?(api: API): void;
    unpatch?({ Patcher }: API): void;
    unstyle?({ Styler }: API): void;
    reloadPatches(): void;
    reloadStyles(): void;
    useSettings(): API;
    useData(): API;
    getChangelogPanel?(): Node | React.FC | React.Component | string;
    css?(): string;
    suppressErrors(func: () => any, async?: boolean): any;
    onDataChanged?(key: string, value: any): void;
    onSettingsChanged?(key: string, value: any): void;
}
/**
 * This function will create a new plugin class for your plugin. It will automatically set the metadata for you.
 * The returned class should be extended by your plugin class.
 * @returns A plugin class that extends PluginBase. Extend this class to create a plugin.
 */
export default function (): typeof PluginBase & {
    new (): PluginBase;
};

/// <reference types="node" />
/// <reference types="react" />
import API from "api";
declare const LiteLib_base: typeof import("core/Plugin").PluginBase & (new () => import("core/Plugin").PluginBase);
export default class LiteLib extends LiteLib_base {
    updateAllInterval?: NodeJS.Timer;
    initialize(API: API): void;
    unstyle(): void;
    firstLoad({ Logger }: API): void;
    checkAllForUpdates({ Settings }: API): Promise<void>;
    getSettingsPanel(): () => JSX.Element;
}
export {};

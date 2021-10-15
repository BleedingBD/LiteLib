import { promises } from "fs";
import { resolve } from "path";
import { API } from "api";
import * as Core from "./core";

declare global {
    const LiteLib: typeof Core;
    interface Window {
        LiteLib: typeof Core;
    }
}

window.LiteLib = Core;
export default class extends Core.Plugin("LiteLib") {
    updateAllInterval?: NodeJS.Timer;

    initialize(API: API) {
        this.updateAllInterval = setInterval(()=>this.checkAllForUpdates(), 30*60*1000);
    }

    firstLoad({ Logger }: API) {
        Logger.info("Detected first load.");
        const time = new Date();
        BdApi.Plugins.getAll().forEach(plugin => {
            if (plugin.litelib && plugin.instance!=this) {
                Logger.info(`Reloading ${plugin.name}.`)
                promises.utimes(resolve(BdApi.Plugins.folder, plugin.filename), time, time).catch(()=>{});
            }
        });
    }

    async checkAllForUpdates() {
        BdApi.Plugins.getAll().forEach(plugin => {
            if (plugin.litelib && plugin.version && plugin.updateUrl) {
                Core.Updater.checkForUpdate(plugin.name);
            }
        });
    }
}

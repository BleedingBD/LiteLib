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
    updateAllInterval?: number;

    initialize(API: API) {
        this.updateAllInterval = window.setInterval(()=>this.checkAllForUpdates(API), 30*60*1000)
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

    async checkAllForUpdates(API: API){
        BdApi.Plugins.getAll().forEach(plugin => {
            if (plugin.litelib && plugin.version && plugin.updateUrl) {
                Core.Updater.checkForUpdate(plugin.name);
            }
        });
    }

    getChangelogPanel() {
        return "test";
    }
}

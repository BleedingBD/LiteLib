import { promises } from "fs";
import { resolve } from "path";
import Updater from "core/Updater";
import Plugin from "core/Plugin";
import { API } from "api";


export default class extends Plugin() {
    updateAllInterval?: NodeJS.Timer;

    initialize(API: API) {
        this.updateAllInterval = setInterval(()=>this.checkAllForUpdates(API), API.Settings.get("updateInterval", 30*60*1000));
    }

    defaultSettings() {
        return {
            updateInterval: { value: 30*60*1000 },
            releaseBranch: { value: "stable" },
        };
    }

    /*
    getUpdateUrl({ Settings }: API): string {
        const branch = Settings.get("releaseBranch", "stable");
        if (branch != "stable") {
            return updateUrl.replace("/stable/", `/${branch}/`);
        }
    }
    */

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

    async checkAllForUpdates({ Settings }: API) {
        if (Settings.get("updateInterval", 30*60*1000)<=0) return;

        BdApi.Plugins.getAll().forEach(plugin => {
            if (plugin.litelib && plugin.version && plugin.updateUrl) {
                Updater.checkForUpdate(plugin.name);
            }
        });
    }
}

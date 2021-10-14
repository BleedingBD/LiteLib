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
    initialize(API: API) {
        window.setTimeout(()=>this.firstLoad(API), 0);
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

    getChangelogPanel() {
        return "test";
    }
}

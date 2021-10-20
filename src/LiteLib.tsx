import { promises } from "fs";
import { resolve } from "path";
import Updater from "core/Updater";
import Plugin from "core/Plugin";
import { API } from "api";


export default class extends Plugin() {
    updateAllInterval?: NodeJS.Timer;

    initialize(API: API) {
        this.updateAllInterval = setInterval(()=>this.checkAllForUpdates(API), 15*60*1000);
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
                promises.utimes(resolve(BdApi.Plugins.folder, plugin.filename), time, time)
                    .catch((e)=>{Logger.error(`Error while reloading ${plugin.name}.`, e)});
            }
        });
    }

    async checkAllForUpdates({ Settings }: API) {
        if (!Settings.get("periodicUpdateChecking", true)) return;
        const nonLitelibUpdateChecking = Settings.get("nonLitelibUpdateChecking", false);

        BdApi.Plugins.getAll().forEach(plugin => {
            if (nonLitelibUpdateChecking || plugin.litelib) {
                Updater.checkForUpdate(plugin as Record<string, string>);
            }
        });
    }

    getSettingsPanel() {
        return ()=>{
            const { Modules, Settings } = this.useSettings();
            const SwitchItem = Modules.findByDisplayName("SwitchItem");

            return <>
                <SwitchItem
                    note="Enable periodically checking for updates."
                    value={Settings.get("periodicUpdateChecking", true)}
                    onChange={(value: boolean) => Settings.set("periodicUpdateChecking", value)}
                >
                    Periodic Update Checks
                </SwitchItem>
                <SwitchItem
                    note="Enables update checking for non-LiteLib plugins during periodic checks."
                    value={Settings.get("nonLitelibUpdateChecking", false)}
                    disabled={!Settings.get("periodicUpdateChecking", true)}
                    onChange={(value: boolean) => Settings.set("nonLitelibUpdateChecking", value)}
                >
                    Non-LiteLib Update Checks
                </SwitchItem>
            </>;
        };
    }
}

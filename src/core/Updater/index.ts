import semverValid from 'semver/functions/valid';
import semverGt from 'semver/functions/gt';
import { update as updateNotice } from './UpdateNotice';
import PendingUpdateStore from './PendingUpdatesStore';
import { parseMetadata } from './MetadataParser';
import Logger from '@common/Logger';

PendingUpdateStore.subscribe((pendingUpdates)=>{
    updateNotice(pendingUpdates.map((pendingUpdate)=>pendingUpdate.name));
});

export default class Updater {
    static semver = {
        valid: semverValid,
        gt: semverGt
    };

    static async checkForUpdate(pluginName: string){
        const currentMeta = BdApi.Plugins.get(pluginName);
        const currentVersion = currentMeta?.version;
        if (!currentVersion || !currentMeta.updateUrl || !this.semver.valid(currentVersion)) return;
        Logger.debug("Updater",`Checking ${pluginName} (@${currentVersion}) for updates.`);

        try {
            const remoteMeta = await this.fetchMetadata(currentMeta.updateUrl);
            const remoteVersion = remoteMeta?.version;
            if(remoteVersion && this.semver.valid(remoteVersion)){
                if(this.semver.gt(remoteVersion, currentVersion)){
                    PendingUpdateStore.addPendingUpdate(pluginName, currentMeta, remoteMeta);
                    return true;
                }
            }
        } catch (error) {
            Logger.error("Updater",`Failed to check for updates for ${pluginName} (@${currentVersion}).`,error);
        }
        return false;
    }

    private static async fetchMetadata(url: string): Promise<Record<string,string>|undefined> {
        const response = await fetch(url);
        const text = await response.text()
        return parseMetadata(text);
    }
}

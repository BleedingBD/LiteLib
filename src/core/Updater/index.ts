import { update as updateNotice } from './UpdateNotice';
import PendingUpdateStore from './PendingUpdatesStore';
import { parseMetadata } from '@common/MetadataParser';
import Logger from '@common/Logger';
import { gt, valid } from './Semver';

PendingUpdateStore.subscribe((pendingUpdates)=>{
    updateNotice(pendingUpdates.map((pendingUpdate)=>pendingUpdate.name));
});

export default class Updater {
    static async checkForUpdate(metadata: Record<string,string>){
        const name = metadata.name;
        const currentVersion = metadata.version;
        const updateUrl = metadata.updateUrl;
        if (!name || !currentVersion || !updateUrl || !valid(currentVersion)) return;
        Logger.debug("Updater",`Checking ${name} (@${currentVersion}) for updates.`);

        try {
            const remoteMeta = await this.fetchMetadata(updateUrl);
            const remoteVersion = remoteMeta?.version;
            if(remoteVersion && valid(remoteVersion)){
                if(gt(remoteVersion, currentVersion)){
                    PendingUpdateStore.addPendingUpdate(name, metadata, remoteMeta);
                    return true;
                }
            }
        } catch (error) {
            Logger.error("Updater",`Failed to check for updates for ${name} (@${currentVersion}).`,error);
        }
        return false;
    }

    private static async fetchMetadata(url: string): Promise<Record<string,string>|undefined> {
        const response = await fetch(url);
        const text = await response.text()
        return parseMetadata(text);
    }
}

import { promises } from "fs";
import { resolve } from "path";
import Logger from "@common/Logger";
import { parseMetadata } from "./MetadataParser";
import PendingUpdateStore from "./PendingUpdatesStore";

export async function applyUpdate(pluginName: string): Promise<boolean> {
    try {
        const pendingUpdate = PendingUpdateStore.getPendingUpdate(pluginName);
        if(!pendingUpdate) return false;

        const {currentMetadata} = pendingUpdate;

        const response = await fetch(currentMetadata.updateUrl!);
        const fileContent = await response.text();
        const incomingMetadata = parseMetadata(fileContent);
        if(!incomingMetadata) return false;

        const targetPath = resolve(BdApi.Plugins.folder,incomingMetadata.pluginPath || `${pluginName}.plugin.js`);
        await promises.writeFile(targetPath, fileContent, "utf-8");
        
        const currentPath = resolve(BdApi.Plugins.folder, currentMetadata.filename);
        if (targetPath != currentPath) {
            await promises.unlink(currentPath);
        }

        PendingUpdateStore.removePendingUpdate(pluginName);
        return true;
    } catch(e) {
        Logger.error("Updater", `Error while trying to update ${pluginName}`, e);
        return false;
    }
}
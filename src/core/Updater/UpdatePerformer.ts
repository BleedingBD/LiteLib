import { promises } from "fs";
import { resolve } from "path";
import Logger from "@common/Logger";
import { parseMetadata } from "@common/MetadataParser";
import PendingUpdateStore from "./PendingUpdatesStore";

export async function applyUpdate(pluginName: string): Promise<boolean> {
    try {
        const pendingUpdate = PendingUpdateStore.getPendingUpdate(pluginName);
        if(!pendingUpdate) return false;

        const {currentMetadata} = pendingUpdate;

        const response = await fetch(currentMetadata.updateUrl!);
        const fileContent = await response.text();
        const incomingMetadata = parseMetadata(fileContent);
        if(!incomingMetadata || !incomingMetadata.name) return false;

        // check for config file path changes
        const targetConfigPath = resolve(BdApi.Plugins.folder, incomingMetadata.configPath || `${incomingMetadata.name}.config.json`);
        const currentConfigPath = resolve(BdApi.Plugins.folder, currentMetadata.configPath || `${currentMetadata.name}.config.json`);
        if (targetConfigPath != currentConfigPath) {
            await promises.rename(currentConfigPath, targetConfigPath);
        }

        // determine target path and write plugin to disk
        const targetPath = resolve(BdApi.Plugins.folder,incomingMetadata.pluginPath || `${incomingMetadata.name}.plugin.js`);
        await promises.writeFile(targetPath, fileContent, "utf-8");
        
        // check for plugin file path changes
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
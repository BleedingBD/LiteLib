import semverValid from 'semver/functions/valid';
import semverGt from 'semver/functions/gt';
import { show } from './UpdateNotice';

const splitRegex = /[^\S\r\n]*?\r?(?:\r\n|\n)[^\S\r\n]*?\*[^\S\r\n]?/;
const escapedAtRegex = /^\\@/;

const pendingUpdates = new Set<string>();

export default class Updater {
    static semver = {
        valid: semverValid,
        gt: semverGt
    };

    static async checkForUpdate(pluginName: string){
        const currentMeta = BdApi.Plugins.get(pluginName);
        const currentVersion = currentMeta?.version;
        if (!currentVersion || !currentMeta.updateUrl || !this.semver.valid(currentVersion)) return;
        console.log(`Checking for update for ${pluginName} ${currentVersion} at ${currentMeta.updateUrl}`);

        const remoteMeta = await this.fetchMetadata(currentMeta.updateUrl);
        console.log(`Remote Metadata:`, remoteMeta);
        const remoteVersion = remoteMeta?.version;
        if(remoteVersion && this.semver.valid(remoteVersion)){
            if(this.semver.gt(remoteVersion, currentVersion)){
                pendingUpdates.add(pluginName);
                show(pendingUpdates);
                return true;
            }
        }
        return false;
    }

    private static async fetchMetadata(url: string): Promise<Record<string,string>|undefined> {
        const response = await fetch(url);
        const text = await response.text()
        return this.parseMetadata(text);
    }

    static parseMetadata(fileContent: string): Record<string,string>|undefined {
        if(!fileContent.startsWith("/**")) return;

        // Taken directly from BD
        const block = fileContent.split("/**", 2)[1].split("*/", 1)[0];
        const out: Record<string,string> = {};
        let field = "";
        let accum = "";
        for (const line of block.split(splitRegex)) {
            if (line.length === 0) continue;
            if (line.charAt(0) === "@" && line.charAt(1) !== " ") {
                out[field] = accum;
                const l = line.indexOf(" ");
                field = line.substr(1, l - 1);
                accum = line.substr(l + 1);
            }
            else {
                accum += " " + line.replace("\\n", "\n").replace(escapedAtRegex, "@");
            }
        }
        out[field] = accum.trim();
        delete out[""];
        out["format"] = "jsdoc";
        return out;
    }
}
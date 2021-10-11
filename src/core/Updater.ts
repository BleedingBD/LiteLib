import { valid as semverValid, gt as semverGt } from 'semver'
import PluginMetadata from '../types/PluginMetadata';

const splitRegex = /[^\S\r\n]*?\r?(?:\r\n|\n)[^\S\r\n]*?\*[^\S\r\n]?/;
const escapedAtRegex = /^\\@/;

export default class Updater {
    static semver = {
        valid: semverValid,
        gt: semverGt
    };

    static async checkForUpdate(pluginName: string){
        const currentMeta = BdApi.Plugins.get(pluginName) as PluginMetadata;
        const currentVersion = currentMeta?.version;
        if (!currentVersion || !currentMeta.updateUrl || !this.semver.valid(currentVersion)) return;

        const remoteMeta = await this.fetchMetadata(currentMeta.updateUrl);
        const remoteVersion = remoteMeta?.version;
        if(remoteVersion && this.semver.valid(remoteVersion)){
            if(this.semver.gt(remoteVersion, currentVersion)){
                // Newer version upstream.
            }
        }
    }

    static async fetchMetadata(url): Promise<PluginMetadata|undefined> {
        const response = await fetch(url);
        const text = await response.text()
        return this.parseMetadata(text);
    }

    static parseMetadata(fileContent: string): PluginMetadata|undefined {
        if(!fileContent.startsWith("/**")) return;

        // Taken directly from BD
        const block = fileContent.split("/**", 2)[1].split("*/", 1)[0];
        const out = {} as PluginMetadata;
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

    static showUpdateNotice(){}
}

import * as nests from 'nests';
import fs from 'fs';
import path from 'path';

export default function Data(pluginName: string): any {
    const pluginPath = path.resolve(BdApi.Plugins.folder, pluginName + ".config.json")

    let pluginData: {[key: string]: unknown};
    if (!fs.existsSync(pluginPath)){
        pluginData = {};
    } else {
        pluginData = JSON.parse(fs.readFileSync(pluginPath, "utf8"));
    }

    const nest = nests.make(pluginData);

    const saveFn = ()=>fs.writeFileSync(pluginPath, JSON.stringify(pluginData, null, 4));
    nest.on(nests.Events.SET, saveFn);
    nest.on(nests.Events.DELETE, saveFn);

    return nest.store;
}

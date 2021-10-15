import * as nests from 'nests';

export default function DataStore(pluginName: string, key: string): nests.Nest {
    const pluginData: any = BdApi.getData(pluginName, key);

    const nest = nests.make(pluginData);

    const saveFn = ()=>setTimeout(()=>BdApi.saveData(pluginName, key, pluginData),0);
    nest.on(nests.Events.SET, saveFn);
    nest.on(nests.Events.DELETE, saveFn);
    nest.on(nests.Events.UPDATE, saveFn);

    return nest;
}

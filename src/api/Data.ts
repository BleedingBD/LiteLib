export default class Data {
    pluginName: string;

    constructor(pluginName: string){
        this.pluginName = pluginName;
    }

    set(key: string, data: any): void { BdApi.saveData(this.pluginName, key, data); }
    get(key: string): any { BdApi.loadData(this.pluginName, key); }
}

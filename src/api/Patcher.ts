export default class Patcher{
    pluginName: string;
    constructor(pluginName: string){
        this.pluginName = pluginName;
    }
    before(target: any, methodName: string){}
    after(){}
    instead(){}
    unpatch(){}
    unpatchAll(){}
}

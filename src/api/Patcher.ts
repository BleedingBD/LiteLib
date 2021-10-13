type PatcherBeforeCallback = (thisArg: any, args: any[])=>any;
type PatcherAfterCallback = (thisArg: any, args: any[], result: any)=>any;
// eslint-disable-next-line @typescript-eslint/ban-types
type PatcherInsteadCallback = (thisArg: any, args: any[], originalFn: Function)=>any;

type UnpatchFn = ()=>void;
type PatcherOptions = {
    type?: "before"|"after"|"instead";
    displayName?: string;
    forcePatch?: boolean;
};

export default class Patcher{
    pluginName: string;

    constructor(pluginName: string){
        this.pluginName = pluginName;
    }

    before(target: any, methodName: string, callback: PatcherBeforeCallback, options?: PatcherOptions): UnpatchFn {
        return BdApi.Patcher.before(this.pluginName, target, methodName, callback, options);
    }
    after(target: any, methodName: string, callback: PatcherAfterCallback, options?: PatcherOptions): UnpatchFn {
        return BdApi.Patcher.after(this.pluginName, target, methodName, callback, options);
    }
    instead(target: any, methodName: string, callback: PatcherInsteadCallback, options?: PatcherOptions): UnpatchFn {
        return BdApi.Patcher.instead(this.pluginName, target, methodName, callback, options);
    }
    unpatchAll(): void {
        return BdApi.Patcher.unpatchAll(this.pluginName);
    }
}

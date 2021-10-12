type PatcherBeforeCallback = (thisArg: any, args: any[])=>any;
type PatcherAfterCallback = (thisArg: any, args: any[], result: any)=>any;
type PatcherInsteadCallback = (thisArg: any, args: any[], originalFn: Function)=>any;

type UnpatchFn = ()=>void;
type PatcherOptions = {
    type?: "before"|"after"|"instead";
    displayName?: string;
    forcePatch?: boolean;
};
interface BdPatcher{
    patch: (caller: string, moduleToPatch: any, functionName: string|Symbol, callback: PatcherBeforeCallback|PatcherAfterCallback|PatcherInsteadCallback, options: PatcherOptions)=>UnpatchFn;
    after: (caller: string, moduleToPatch: any, functionName: string|Symbol, callback: PatcherAfterCallback, options?: PatcherOptions)=>UnpatchFn;
    before: (caller: string, moduleToPatch: any, functionName: string|Symbol, callback: PatcherBeforeCallback, options?: PatcherOptions)=>UnpatchFn;
    instead: (caller: string, moduleToPatch: any, functionName: string|Symbol, callback: PatcherInsteadCallback, options?: PatcherOptions)=>UnpatchFn;
    unpatchAll: (caller: string)=>void;
}

export default class Patcher{
    pluginName: string;

    constructor(pluginName: string){
        this.pluginName = pluginName;
    }

    before(target: any, methodName: string, callback: PatcherBeforeCallback, options?: PatcherOptions): UnpatchFn {
        return (BdApi.Patcher as BdPatcher).before(this.pluginName, target, methodName, callback, options);
    }
    after(target: any, methodName: string, callback: PatcherAfterCallback, options?: PatcherOptions): UnpatchFn {
        return (BdApi.Patcher as BdPatcher).after(this.pluginName, target, methodName, callback, options);
    }
    instead(target: any, methodName: string, callback: PatcherInsteadCallback, options?: PatcherOptions): UnpatchFn {
        return (BdApi.Patcher as BdPatcher).instead(this.pluginName, target, methodName, callback, options);
    }
    unpatchAll(): void {
        return (BdApi.Patcher as BdPatcher).unpatchAll(this.pluginName);
    }
}

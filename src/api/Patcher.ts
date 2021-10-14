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
export interface Patcher{
    before(target: any, methodName: string, callback: PatcherBeforeCallback, options?: PatcherOptions): UnpatchFn;
    after(target: any, methodName: string, callback: PatcherAfterCallback, options?: PatcherOptions): UnpatchFn;
    instead(target: any, methodName: string, callback: PatcherInsteadCallback, options?: PatcherOptions): UnpatchFn;
    unpatchAll(): void;
}

const BDPatcher = BdApi.Patcher;

export default function Patcher(pluginName: string): Patcher {
    return {
        before: BDPatcher.before.bind(BDPatcher, pluginName),
        after: BDPatcher.after.bind(BDPatcher, pluginName),
        instead: BDPatcher.instead.bind(BDPatcher, pluginName),
        unpatchAll: BDPatcher.unpatchAll.bind(BDPatcher, pluginName)
    };
}

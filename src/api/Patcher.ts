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
    /**
     * Patches a module method with a callback function to be run before the original method.
     * @param target The module to patch the function on
     * @param methodName The name of the method
     * @param callback The callback that is called before the original method
     * @param options The BdApi.Patcher options to use.
     * @returns A function that will remove the patch.
     */
    before(target: any, methodName: string, callback: PatcherBeforeCallback, options?: PatcherOptions): UnpatchFn;
    /**
     * Patches a module method with a callback function to be run after the original method.
     * If a value is returned from the callback function, that value will be returned instead of the original value.
     * @param target The module to patch the function on
     * @param methodName The name of the method
     * @param callback The callback that is called after the original method
     * @param options The BdApi.Patcher options to use
     * @returns A function that will remove the patch.
     */
    after(target: any, methodName: string, callback: PatcherAfterCallback, options?: PatcherOptions): UnpatchFn;
    /**
     * Patches a module method with a callback function to be run intead of the original method.
     * @param target The module to patch the function on
     * @param methodName The name of the method
     * @param callback The callback that is called instead of the original method
     * @param options The BdApi.Patcher options to use
     * @returns A function that will remove the patch.
     */
    instead(target: any, methodName: string, callback: PatcherInsteadCallback, options?: PatcherOptions): UnpatchFn;
    /**
     * Removes all patches that were done with this Patcher instance.
     */
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

import { CancelPatch, PatcherAfterCallback, PatcherBeforeCallback, PatcherInsteadCallback, PatcherOptions } from "../../@types/BdApi";

export interface Patcher{
    /**
     * This method patches onto another function, allowing your code to run beforehand.
     * Using this, you are also able to modify the incoming arguments before the original method is run.
     * @param moduleToPatch Object with the function to be patched. Can also patch an object's prototype.
     * @param functionName Name of the method to be patched
     * @param callback Function to run before the original method
     * @param options Object used to pass additional options.
     * @param options.displayName You can provide meaningful name for class/object provided in `what` param for logging purposes. By default, this function will try to determine name automatically.
     * @param options.forcePatch Set to `true` to patch even if the function doesnt exist. (Adds noop function in place).
     * @return Function with no arguments and no return value that should be called to cancel (unpatch) this patch. You should save and run it when your plugin is stopped.
     */
    before(target: any, methodName: string, callback: PatcherBeforeCallback, options?: PatcherOptions): CancelPatch;

    /**
     * This method patches onto another function, allowing your code to run after.
     * Using this, you are also able to modify the return value, using the return of your code instead.
     * @param moduleToPatch Object with the function to be patched. Can also patch an object's prototype.
     * @param functionName Name of the method to be patched
     * @param callback Function to run before the original method
     * @param options Object used to pass additional options.
     * @param options.displayName You can provide meaningful name for class/object provided in `what` param for logging purposes. By default, this function will try to determine name automatically.
     * @param options.forcePatch Set to `true` to patch even if the function doesnt exist. (Adds noop function in place).
     * @return Function with no arguments and no return value that should be called to cancel (unpatch) this patch. You should save and run it when your plugin is stopped.
     */
    after(target: any, methodName: string, callback: PatcherAfterCallback, options?: PatcherOptions): CancelPatch;

    /**
     * This method patches onto another function, allowing your code to run instead.
     * Using this, you are also able to modify the return value, using the return of your code instead.
     * @param moduleToPatch Object with the function to be patched. Can also patch an object's prototype.
     * @param functionName Name of the method to be patched
     * @param callback Function to run before the original method
     * @param options Object used to pass additional options.
     * @param options.displayName You can provide meaningful name for class/object provided in `what` param for logging purposes. By default, this function will try to determine name automatically.
     * @param options.forcePatch Set to `true` to patch even if the function doesnt exist. (Adds noop function in place).
     * @return Function with no arguments and no return value that should be called to cancel (unpatch) this patch. You should save and run it when your plugin is stopped.
     */
    instead(target: any, methodName: string, callback: PatcherInsteadCallback, options?: PatcherOptions): CancelPatch;
    
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

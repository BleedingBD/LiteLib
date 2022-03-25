export declare type Predicate = (module: any) => boolean;
export default class Modules {
    /**
     * Find a Discord webpack module by its props.
     * This is a memoized version of `BdApi.findModuleByProps`.
     * @param props A list of props to search for, all must be present.
     * @returns The module, or undefined if not found.
     */
    static findByProps(...props: string[]): any;
    /**
     * Find a Discord webpack module by its display name.
     * This is a memoized version of `BdApi.findModuleByDisplayName`.
     * @param displayName The display name to search for.
     * @returns The module, or undefined if not found.
     */
    static findByDisplayName(displayName: string): any;
    static find: typeof import("@betterdiscord/bdapi").BdApiModule.findModule;
    static findAll: typeof import("@betterdiscord/bdapi").BdApiModule.findAllModules;
}

import { Memoize } from "typescript-memoize";

export type Predicate = (module: any)=>boolean;

export default class Modules {
    /**
     * Find a Discord webpack module by its props.
     * This is a memoized version of `BdApi.findModuleByProps`.
     * @param props A list of props to search for, all must be present.
     * @returns The module, or undefined if not found.
     */
    @Memoize(
        // doing the reasonable assumption that prop names don't contain commas
        // and when they do it wouldn't cause in issue in most cases
        (...props: string[])=>props.join(',')
    )
    static findByProps(...props: string[]): any {
        return BdApi.findModuleByProps(...props);
    }

    /**
     * Find a Discord webpack module by its display name.
     * This is a memoized version of `BdApi.findModuleByDisplayName`.
     * @param displayName The display name to search for.
     * @returns The module, or undefined if not found.
     */
    @Memoize()
    static findByDisplayName(displayName: string): any {
        return BdApi.findModuleByDisplayName(displayName);
    }

    static find = BdApi.findModule;
    static findAll = BdApi.findAllModules;
}

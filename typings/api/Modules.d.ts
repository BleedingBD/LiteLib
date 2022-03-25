import StaticModules, { Predicate } from "../common/Modules";
export default class Modules {
    private readonly findCache;
    private readonly findAllCache;
    findByProps: typeof StaticModules.findByProps;
    findByDisplayName: typeof StaticModules.findByDisplayName;
    /**
     * Find a Discord webpack module that matches the predicate.
     * This is a memoized version of the static find method.
     * @param name The name to memoize by
     * @param predicate The predicate to match
     * @returns The module that matches the predicate or undefined if none was found
     */
    find(name: string, predicate: Predicate): any;
    /**
     * Find all Discord webpack modules that match the predicate.
     * This is a memoized version of the static find method.
     * @param name The name to memoize by
     * @param predicate The predicate to match
     * @returns An array of modules that match the predicate or undefined if none was found
     */
    findAll(name: string, predicate: Predicate): any[] | undefined;
}

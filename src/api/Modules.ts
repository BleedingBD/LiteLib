import { Memoize } from "typescript-memoize";
import StaticModules, { Predicate } from "../common/Modules";

export default class Modules {
    private readonly findCache = new Map<string, any>();
    private readonly findAllCache = new Map<string, any[] | undefined>();

    findByProps = StaticModules.findByProps;
    findByDisplayName = StaticModules.findByDisplayName;

    /**
     * Find a Discord webpack module that matches the predicate.
     * This is a memoized version of the static find method.
     * @param name The name to memoize by
     * @param predicate The predicate to match
     * @returns The module that matches the predicate or undefined if none was found
     */
    @Memoize() find(name: string, predicate: Predicate): any {
        return StaticModules.find(predicate);
    }

    /**
     * Find all Discord webpack modules that match the predicate.
     * This is a memoized version of the static find method.
     * @param name The name to memoize by
     * @param predicate The predicate to match
     * @returns An array of modules that match the predicate or undefined if none was found
     */
    @Memoize() findAll(name: string, predicate: Predicate): any[] | undefined {
        return StaticModules.findAll(predicate);
    }
}

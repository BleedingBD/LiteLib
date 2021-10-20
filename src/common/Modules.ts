import { Memoize } from "typescript-memoize";

export type Predicate = (module: any)=>boolean;

export default class Modules {
    @Memoize(
        // doing the reasonable assumption that prop names don't contain commas
        // and when they do it wouldn't cause in issue in most cases
        (...props: string[])=>props.join(',')
    )
    static findByProps(...props: string[]): any {
        return BdApi.findModuleByProps(...props);
    }

    @Memoize()
    static findByDisplayName(displayName: string): any {
        return BdApi.findModuleByDisplayName(displayName);
    }

    static find = BdApi.findModule;
    static findAll = BdApi.findAllModules;
}

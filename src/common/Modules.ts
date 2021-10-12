const findByPropsCache = new Map<string, any>();
const findByDisplayNameCache = new Map<string, any>();

export default class Modules {
    static findByProps(...props: string[]): any {
        // doing the reasonable assumption that prop names don't contain commas
        // and when they do it wouldn't cause in issue in most cases
        const cacheKey = props.join(',');
        if (findByPropsCache.has(cacheKey)) return findByPropsCache.get(cacheKey);

        const ret = BdApi.findModuleByProps(...props);
        findByPropsCache.set(cacheKey, ret);
        return ret;
    }

    static findByDisplayName(displayName: string): any {
        if (findByDisplayNameCache.has(displayName)) return findByDisplayNameCache.get(displayName);

        const ret = BdApi.findModuleByDisplayName(displayName);
        findByDisplayNameCache.set(displayName, ret);
        return ret;
    }

    static find(predicate: (any)=>boolean): any {
        return BdApi.findModule(predicate);
    }

    static findAll(predicate: (any)=>boolean): any[]|undefined {
        return BdApi.findAllModules(predicate);
    }
}

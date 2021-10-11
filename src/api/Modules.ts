const findByPropsCache = new Map<string, any>();
const findByDisplayNameCache = new Map<string, any>();

export default class Modules {
    findCache = new Map<string, any>();
    findAllCache = new Map<string, any[]|undefined>();

    findByProps(...props: string[]): any {
        // doing the reasonable assumption that prop names don't contain commas
        // and when they do it wouldn't cause in issue in most cases
        const cacheKey = props.join(',');
        if (findByPropsCache.has(cacheKey)) return findByPropsCache.get(cacheKey);

        const ret = BdApi.findModuleByProps(...props);
        findByPropsCache.set(cacheKey, ret);
        return ret;
    }

    findByDisplayName(displayName: string): any {
        if (findByDisplayNameCache.has(displayName)) return findByDisplayNameCache.get(displayName);

        const ret = BdApi.findModuleByDisplayName(displayName);
        findByDisplayNameCache.set(displayName, ret);
        return ret;
    }

    find(name: string, predicate: (any)=>boolean): any {
        if (this.findCache.has(name)) return this.findCache.get(name);

        const ret = BdApi.findModule(predicate);
        this.findCache.set(name, ret);
        return ret;
    }

    findAll(name: string, predicate: (any)=>boolean): any[]|undefined {
        if (this.findAllCache.has(name)) return this.findAllCache.get(name);

        const ret = BdApi.findAllModules(predicate);
        this.findAllCache.set(name, ret);
        return ret;
    }
}

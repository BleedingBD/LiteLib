import StaticModules from "../common/Modules";

export default class Modules {
    findCache = new Map<string, any>();
    findAllCache = new Map<string, any[]|undefined>();

    findByProps(...props: string[]): any {
        return StaticModules.findByProps(...props);
    }

    findByDisplayName(displayName: string): any {
        return StaticModules.findByDisplayName(displayName);
    }

    find(name: string, predicate: (any)=>boolean): any {
        if (this.findCache.has(name)) return this.findCache.get(name);

        const ret = StaticModules.find(predicate);
        this.findCache.set(name, ret);
        return ret;
    }

    findAll(name: string, predicate: (any)=>boolean): any[]|undefined {
        if (this.findAllCache.has(name)) return this.findAllCache.get(name);

        const ret = StaticModules.findAll(predicate);
        this.findAllCache.set(name, ret);
        return ret;
    }
}

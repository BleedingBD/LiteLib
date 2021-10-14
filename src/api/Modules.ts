import { Memoize } from "typescript-memoize";
import StaticModules, { Predicate } from "@common/Modules";

export default class Modules {
    private readonly findCache = new Map<string, any>();
    private readonly findAllCache = new Map<string, any[]|undefined>();

    findByProps = StaticModules.findByProps;
    findByDisplayName = StaticModules.findByDisplayName;

    @Memoize() find(name: string, predicate: Predicate): any {
        return StaticModules.find(predicate);
    }


    @Memoize() findAll(name: string, predicate: Predicate): any[]|undefined {
        return StaticModules.findAll(predicate);
    }
}

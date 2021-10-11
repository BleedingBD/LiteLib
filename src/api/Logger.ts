import StaticLogger from "../common/Logger";

export default class Logger{
    name: string;

    constructor(name){
        this.name = name;
    }

    debug(...args: any[]){ StaticLogger.debug(this.name, ...args); }
    info(...args: any[]){ StaticLogger.info(this.name, ...args); }
    log(...args: any[]){ StaticLogger.log(this.name, ...args); }
    warn(...args: any[]){ StaticLogger.warn(this.name, ...args); }
    error(...args: any[]){ StaticLogger.error(this.name, ...args); }
    assert(condition: boolean, ...args: any[]){ StaticLogger.assert(condition, this.name, ...args); }
    trace(...args: any[]){ StaticLogger.trace(this.name, ...args); }
}

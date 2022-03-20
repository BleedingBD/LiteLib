import StaticLogger from "@common/Logger";

export interface Logger {
    debug(...args: any[]): void;
    info(...args: any[]): void;
    log(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
    assert(condition: boolean, ...args: any[]): void;
    trace(...args: any[]): void;
}

export default function Logger(pluginName: string): Logger {
    return {
        debug: StaticLogger.debug.bind(StaticLogger, pluginName),
        info: StaticLogger.info.bind(StaticLogger, pluginName),
        log: StaticLogger.log.bind(StaticLogger, pluginName),
        warn: StaticLogger.warn.bind(StaticLogger, pluginName),
        error: StaticLogger.error.bind(StaticLogger, pluginName),
        assert: (condition: boolean, ...args: any[]) =>
            StaticLogger.assert(condition, pluginName, ...args),
        trace: StaticLogger.trace.bind(StaticLogger, pluginName),
    };
}

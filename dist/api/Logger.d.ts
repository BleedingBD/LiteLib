export interface Logger {
    debug(...args: any[]): void;
    info(...args: any[]): void;
    log(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
    assert(condition: boolean, ...args: any[]): void;
    trace(...args: any[]): void;
}
export default function Logger(pluginName: string): Logger;

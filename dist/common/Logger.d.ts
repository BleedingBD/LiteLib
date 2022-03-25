export default class Logger {
    private static style;
    static debug(name: string, ...args: any[]): void;
    static info(name: string, ...args: any[]): void;
    static log(name: string, ...args: any[]): void;
    static warn(name: string, ...args: any[]): void;
    static error(name: string, ...args: any[]): void;
    static assert(condition: boolean, name: string, ...args: any[]): void;
    static trace(name: string, ...args: any[]): void;
}

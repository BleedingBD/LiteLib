export default class Logger {
    private static style = "font-weight: 700; color: blue";

    static debug(name: string, ...args: any[]) {
        console.debug(`%c[${name}]%c`, this.style, "", ...args);
    }
    static info(name: string, ...args: any[]) {
        console.info(`%c[${name}]%c`, this.style, "", ...args);
    }
    static log(name: string, ...args: any[]) {
        console.log(`%c[${name}]%c`, this.style, "", ...args);
    }
    static warn(name: string, ...args: any[]) {
        console.warn(`%c[${name}]%c`, this.style, "", ...args);
    }
    static error(name: string, ...args: any[]) {
        console.error(`%c[${name}]%c`, this.style, "", ...args);
    }
    static assert(condition: boolean, name: string, ...args: any[]) {
        console.assert(condition, `%c[${name}]%c`, this.style, "", ...args);
    }
    static trace(name: string, ...args: any[]) {
        console.trace(`%c[${name}]%c`, this.style, "", ...args);
    }
}

export default class Logger{
    prefix: string;
    style = 'font-weight: 700; color: blue';

    constructor(name){
        this.prefix = `%c[${name}]%c`;
    }

    debug(...args: any[]){ console.debug(this.prefix, this.style, '', ...args); }
    info(...args: any[]){ console.info(this.prefix, this.style, '', ...args); }
    log(...args: any[]){ console.log(this.prefix, this.style, '', ...args); }
    warn(...args: any[]){ console.warn(this.prefix, this.style, '', ...args); }
    error(...args: any[]){ console.error(this.prefix, this.style, '', ...args); }
    assert(condition: boolean, ...args: any[]){ console.assert(condition, this.prefix, this.style, '', ...args); }
    trace(...args: any[]){ console.trace(this.prefix, this.style, '', ...args); }
}

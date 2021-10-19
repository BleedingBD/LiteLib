import EventEmitter from "@common/EventEmitter";
import Scheduler from "@common/Scheduler";

export default class DataStore extends EventEmitter {
    private readonly key: string;
    private readonly configPath: string;
    private readonly data: any;

    constructor(configPath: string, key: string) {
        super();
        this.key = key;
        this.configPath = configPath;
        this.data = BdApi.getData(this.configPath, this.key) || {};
    }

    has(key: string): boolean { return key in this.data; }

    get(key: string): any
    get(key: string, defaultValue?: NonNullable<any>): NonNullable<any>
    get(key: string, defaultValue?: NonNullable<any>): any {
        return this.data[key] ?? defaultValue;
    }

    set(key: string, value: any): void {
        if (value === undefined) return this.delete(key);
        this.data[key] = value;

        this.emit("change", key, value);
        this.syncData();
    }

    delete(key: string): void {
        delete this.data[key];

        this.emit("change", key, undefined);
        this.syncData();
    }

    on(event: "change", listener: (key: string, value: any) => void): this;
    on(event: string, listener: (...args: any[]) => void): this {
        return super.on(event, listener);
    }

    private syncData(): void {
        Scheduler.scheduleAsync(()=>BdApi.saveData(this.configPath, this.key, this.data));
    }
}

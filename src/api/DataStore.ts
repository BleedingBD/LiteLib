import EventEmitter from "../common/EventEmitter";

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

    /**
     * Checks if the given key exists in the data store.
     * @param key The key to check for.
     * @returns True if the key exists, false otherwise.
     */
    has(key: string): boolean {
        return key in this.data;
    }

    /**
     * Get the value of the given key, or undefined if it doesn't exist.
     * @param key The key to get the value of.
     * @returns The value of the key, or undefined if it doesn't exist.
     */
    get(key: string): any;
    /**
     * Get the value of the given key, or the default value if it doesn't exist.
     * @param key The key to get the value of.
     * @param defaultValue The default value to return if the key doesn't exist.
     * @returns The value of the key, or the default value if it doesn't exist.
     */
    get(key: string, defaultValue?: NonNullable<any>): NonNullable<any>;
    get(key: string, defaultValue?: NonNullable<any>): any {
        return key in this.data ? this.data[key] : defaultValue;
    }

    /**
     * Set the value of the given key.
     * @param key The key to set the value of.
     * @param value The value to set the key to.
     */
    set(key: string, value: any): void {
        if (value === undefined) return this.delete(key);
        this.data[key] = value;

        this.emit("change", key, value);
        this.syncData();
    }

    /**
     * Modify the value for the target key by calling the given function.
     * The function will be called with the value as the first argument.
     * The return value of the function will be used as the new value.
     * @param key The key to transform the value of.
     * @param modifier The function to transform the value with.
     * @param defaultValue The default value to use if the key doesn't exist.
     */
    modify(
        key: string,
        modifier: (value: any) => any,
        defaultValue?: NonNullable<any>
    ): void {
        this.set(key, modifier(this.get(key, defaultValue)));
    }

    /**
     * Delete the given key from the data store.
     * @param key The key to delete.
     */
    delete(key: string): void {
        delete this.data[key];

        this.emit("change", key, undefined);
        this.syncData();
    }

    /**
     * Listen for changes to the data store.
     * @param event The event to listen for.
     * @param listener The listener to call when the data store changes. Receives the key that changed and its new value.
     */
    on(event: "change", listener: (key: string, value: any) => void): this;
    on(event: string, listener: (...args: any[]) => void): this {
        return super.on(event, listener);
    }

    private syncData(): void {
        window.setTimeout(
            () => BdApi.saveData(this.configPath, this.key, this.data),
            0
        );
    }
}

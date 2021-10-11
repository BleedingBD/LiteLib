import API from "../api";

class Plugin{
    API: API;
    constructor(pluginName: string){
        this.API = new API(pluginName);
    }

    load(): void {
        // TODO: updater
        this.initialize(this.API);
    }
    initialize(api: API): void{}

    start(): void {
        this.setup(this.API);
        this.patch(this.API);
        this.style(this.API);
    }
    setup(api: API): void{}
    patch(api: API): void{}
    style(api: API): void{}

    stop(): void {
        this.cleanup(this.API);
        this.unpatch(this.API);
        this.unstyle(this.API)
    }
    cleanup(api: API): void{}
    unpatch({Patcher}: API): void{ Patcher.unpatchAll(); }
    unstyle({Styler}: API): void{ Styler.removeAll(); }
}

export default function(pluginName: string): typeof Plugin & {new(): Plugin} {
    return class extends Plugin {
        constructor() {
            super(pluginName);
        }
    }
}

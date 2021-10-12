import * as Core from "./core";

declare global {
    const LiteLib: typeof Core;
    interface Window {
        LiteLib: typeof Core;
    }
}

export default class extends Core.Plugin("LiteLib") {
    load() {
        window.LiteLib = Core;
        this.API.Logger.log("LiteLib loaded sucessfully!");
        super.load();
    }
}

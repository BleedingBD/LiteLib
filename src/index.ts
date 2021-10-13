import * as Core from "./core";

declare global {
    const LiteLib: typeof Core;
    interface Window {
        LiteLib: typeof Core;
    }
}

window.LiteLib = Core;
export default class extends Core.Plugin("LiteLib") {
    load() {
        this.API.Logger.log("LiteLib loaded sucessfully!");
        super.load();
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    start(){}
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    stop(){}
}

import * as Core from "./core";

export default class extends Core.Plugin("LiteLib") {
    load() {
        window["LiteLib"] = Core;
        this.API.Logger.log("LiteLib loaded sucessfully!");
        super.load();
    }
}
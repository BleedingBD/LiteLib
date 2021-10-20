import * as Core from "./core";
import "./styles/index.scss";

declare global {
    const LiteLib: typeof Core;
    interface Window {
        LiteLib: typeof Core;
    }
}

window.LiteLib = Core;
export {default} from "./LiteLib";

import * as Core from "./core";
declare global {
    const LiteLib: typeof Core;
    interface Window {
        LiteLib: typeof Core;
    }
}
export { default } from "./LiteLib";

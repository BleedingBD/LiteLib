import { ToastOptions } from "@betterdiscord/bdapi";

export default class Toasts{
    static show = BdApi.showToast;
    /** Shorthand for BdApi.showToast with type set to 'success' */
    static success(content: string, options?: ToastOptions): void{ BdApi.showToast(content, {...options, type: 'success'}); }
    /** Shorthand for BdApi.showToast with type set to 'info' */
    static info(content: string, options?: ToastOptions): void{ BdApi.showToast(content, {...options, type: 'info'}); }
    /** Shorthand for BdApi.showToast with type set to 'warn' */
    static warn(content: string, options?: ToastOptions): void{ BdApi.showToast(content, {...options, type: 'warn'}); }
    /** Shorthand for BdApi.showToast with type set to 'error' */
    static error(content: string, options?: ToastOptions): void{ BdApi.showToast(content, {...options, type: 'error'}); }
}

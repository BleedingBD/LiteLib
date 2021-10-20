import { ToastOptions } from "../../@types/betterdiscord__bdapi";

export default class Toasts{
    static show = BdApi.showToast;
    static success(content: string, options?: ToastOptions): void{ BdApi.showToast(content, {...options, type: 'success'}); }
    static info(content: string, options?: ToastOptions): void{ BdApi.showToast(content, {...options, type: 'info'}); }
    static warn(content: string, options?: ToastOptions): void{ BdApi.showToast(content, {...options, type: 'warn'}); }
    static error(content: string, options?: ToastOptions): void{ BdApi.showToast(content, {...options, type: 'error'}); }
}

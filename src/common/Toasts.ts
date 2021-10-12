interface ToastOptions {
    type?: '' | 'success' | 'info' | ('warn' | 'warning') | ('error' | 'danger');
    timeout?: number;
    icon?: boolean;
}

export default class Toasts{
    static show(content: string, options?: ToastOptions): void{ BdApi.showToast(content, options); }
    static success(content: string, options?: ToastOptions): void{ BdApi.showToast(content, {...options, type: 'success'}); }
    static info(content: string, options?: ToastOptions): void{ BdApi.showToast(content, {...options, type: 'info'}); }
    static warn(content: string, options?: ToastOptions): void{ BdApi.showToast(content, {...options, type: 'warn'}); }
    static error(content: string, options?: ToastOptions): void{ BdApi.showToast(content, {...options, type: 'error'}); }
}

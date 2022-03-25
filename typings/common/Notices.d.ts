import { NoticeOptions, NoticeCloseFn } from "@betterdiscord/bdapi";
export default class Notices {
    static show: typeof import("@betterdiscord/bdapi").BdApiModule.showNotice;
    /** Shorthand for `type = "info"` for {@link module:Notices.show} */
    static info(content: Node | string, options?: NoticeOptions): NoticeCloseFn | undefined;
    /** Shorthand for `type = "warning"` for {@link module:Notices.show} */
    static warn(content: Node | string, options?: NoticeOptions): NoticeCloseFn | undefined;
    /** Shorthand for `type = "error"` for {@link module:Notices.show} */
    static error(content: Node | string, options?: NoticeOptions): NoticeCloseFn | undefined;
    /** Shorthand for `type = "success"` for {@link module:Notices.show} */
    static success(content: Node | string, options?: NoticeOptions): NoticeCloseFn | undefined;
}

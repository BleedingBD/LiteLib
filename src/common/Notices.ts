import { NoticeOptions, NoticeCloseFn } from "@betterdiscord/bdapi";

export default class Notices {
    static show = BdApi.showNotice;
    /** Shorthand for `type = "info"` for {@link module:Notices.show} */
    static info(
        content: Node | string,
        options: NoticeOptions = {}
    ): NoticeCloseFn | undefined {
        return this.show(content, { ...options, type: "info" });
    }
    /** Shorthand for `type = "warning"` for {@link module:Notices.show} */
    static warn(
        content: Node | string,
        options: NoticeOptions = {}
    ): NoticeCloseFn | undefined {
        return this.show(content, { ...options, type: "warning" });
    }
    /** Shorthand for `type = "error"` for {@link module:Notices.show} */
    static error(
        content: Node | string,
        options: NoticeOptions = {}
    ): NoticeCloseFn | undefined {
        return this.show(content, { ...options, type: "error" });
    }
    /** Shorthand for `type = "success"` for {@link module:Notices.show} */
    static success(
        content: Node | string,
        options: NoticeOptions = {}
    ): NoticeCloseFn | undefined {
        return this.show(content, { ...options, type: "success" });
    }
}

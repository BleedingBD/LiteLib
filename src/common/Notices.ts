import { Memoize } from "typescript-memoize";
import Modules from "./Modules";
import { createHTMLElement } from "./Utilities";

/**
 * This is directly taken from Strencher's Notices API pull request for BetterDiscord.
 * It will be removed and replaced with a thin wrapper around the API once it's merged.
 * As this code is taken from BetterDiscord the respective license applies.
 */

export declare type CloseFn = (immediately?: boolean) => void;

export declare type NoticeOptions = {
    type?: "info"|"warning"|"error"|"success";
    buttons?: {
        label: string;
        onClick?: (closeFn: ()=>void)=>void;
    }[];
    timeout?: number; 
};

export default class Notices{
    @Memoize() private static get baseClass() {return Modules.findByProps("container", "base")?.base}

    /** Shorthand for `type = "info"` for {@link module:Notices.show} */
    static info(content: Node|string, options: NoticeOptions = {}): CloseFn|undefined {return this.show(content, {...options, type: "info"});}
    /** Shorthand for `type = "warning"` for {@link module:Notices.show} */
    static warn(content: Node|string, options: NoticeOptions = {}): CloseFn|undefined {return this.show(content, {...options, type: "warning"});}
    /** Shorthand for `type = "error"` for {@link module:Notices.show} */
    static error(content: Node|string, options: NoticeOptions = {}): CloseFn|undefined {return this.show(content, {...options, type: "error"});}
    /** Shorthand for `type = "success"` for {@link module:Notices.show} */
    static success(content: Node|string, options: NoticeOptions = {}): CloseFn|undefined {return this.show(content, {...options, type: "success"});}

    static show(content: Node|string, options: NoticeOptions = {}): CloseFn|undefined {
        const {type, buttons = [], timeout = 10000} = options;
        if (!this.ensureContainer()) return;

        const closeNotification = function (immediately = false) {
            // Immediately remove the notice without adding the closing class.
            if (immediately) return noticeElement.remove();

            noticeElement.classList.add("ll-notice-closing");
            setTimeout(() => {noticeElement.remove();}, 300);
        };

        const noticeElement = createHTMLElement(
            "div",
            {
                className: "ll-notice" + (type?` ll-notice-${type}`:"")
            },
            [
                createHTMLElement("div", {className: "ll-notice-close", onclick: () => closeNotification()}),
                createHTMLElement("span", {className: "ll-notice-content"}, content),
                ...buttons.map((button) => {
                    if (!button?.label || typeof(button.onClick) !== "function") return null;
                    return createHTMLElement(
                        "button",
                        {
                            className: "ll-notice-button",
                            onclick: button.onClick.bind(null, closeNotification)
                        },
                        button.label
                    )
                })
            ]
        )

        document.getElementById("ll-notices")!.appendChild(noticeElement);

        if (timeout > 0) setTimeout(closeNotification, timeout);

        return closeNotification;
    }

    private static ensureContainer() {
        if (document.getElementById("ll-notices")) return true;
        const container = document.querySelector(`.${this.baseClass}`);
        if (!container) return false;
        const noticeContainer = createHTMLElement("div", {id: "ll-notices"});
        container.prepend(noticeContainer);
        return true;
    }
}

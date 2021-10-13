import {h} from "tsx-dom";

import Modules from "./Modules";

/**
 * This is directly taken from Strencher's Notices API pull request for BetterDiscord.
 * It will be removed and replaced with a thin wrapper around the API once it's merged.
 * As this code is taken from BetterDiscord the respective license applies.
 */

BdApi.injectCSS("ll-notices-style",`
.ll-notice-success {
    --color: #3ba55d;
}

.ll-notice-error {
    --color: #ED4245;
}

.ll-notice-info {
    --color: #4A8FE1;
}

.ll-notice-warning {
    --color: #FAA81A;
}

.ll-notice-closing {
    transition: height 400ms ease;
    height: 0 !important;
}

@keyframes ll-open-notice {
    from {
        height: 0;
    }
}

.ll-notice {
    animation: ll-open-notice 400ms ease;
    overflow: hidden;
    height: 36px;
    font-size: 14px;
    line-height: 36px;
    font-weight: 500;
    text-align: center;
    position: relative;
    padding-left: 4px;
    padding-right: 28px;
    z-index: 101;
    flex-shrink: 0;
    flex-grow: 0;
    box-shadow: var(--elevation-low);
    color: #fff;
    background: var(--color, var(--brand-experiment-600, #3C45A5));
}

.ll-notice:first-child {
    border-radius: 8px 0 0;
}

.ll-notice-close {
    position: absolute;
    top: 0;
    right: 0;
    width: 36px;
    height: 36px;
    background: url(https://discord.com/assets/7731c77d99babca1a8faec204d98c380.svg) no-repeat;
    background-position: 50% 55%;
    background-size: 10px 10px;
    opacity: .5;
    transition: opacity .2s;
    cursor: pointer;
    -webkit-app-region: no-drag;
}

.ll-notice-button {
    font-size: 14px;
    font-weight: 500;
    position: relative;
    top: 6px;
    border: 1px solid;
    color: #fff;
    border-radius: 3px;
    height: 24px;
    padding: 0 10px;
    box-sizing: border-box;
    display: inline-block;
    vertical-align: top;
    margin-left: 10px;
    line-height: 22px;
    transition: background-color .2s ease,color .2s ease,border-color .2s ease;
    -webkit-app-region: no-drag;
    border-color: #fff;
    background: transparent;
}

.ll-notice-button:hover {
    color: var(--color, var(--background-mobile-primary));
    background: #fff;
}

.ll-notice-close:hover {
    opacity: 1;
}
`);

type NoticeOptions = {
    type?: "info"|"warn"|"error"|"success";
    buttons?: {
        label: string;
        onClick?: (closeFn: ()=>void)=>void;
    }[];
    timeout?: number; 
};

export default class Notices{
    private static __baseClass: string;
    private static get baseClass() {return this.__baseClass || (this.__baseClass = Modules.findByProps("container", "base")?.base);}

    /** Shorthand for `type = "info"` for {@link module:Notices.show} */
    static info(content: string, options: NoticeOptions = {}) {return this.show(content, Object.assign({}, options, {type: "info"}));}
    /** Shorthand for `type = "warning"` for {@link module:Notices.show} */
    static warn(content: string, options: NoticeOptions = {}) {return this.show(content, Object.assign({}, options, {type: "warning"}));}
    /** Shorthand for `type = "error"` for {@link module:Notices.show} */
    static error(content: string, options: NoticeOptions = {}) {return this.show(content, Object.assign({}, options, {type: "error"}));}
    /** Shorthand for `type = "success"` for {@link module:Notices.show} */
    static success(content: string, options: NoticeOptions = {}) {return this.show(content, Object.assign({}, options, {type: "success"}));}

    private static joinClassNames(...classNames: (string|undefined)[]) {
        return classNames.filter((n) => n).join(" ");
    }

    static show(content: string, options: NoticeOptions = {}) {
        const {type, buttons = [], timeout = 10000} = options;
        const haveContainer = this.ensureContainer();
        if (!haveContainer) return;

        const closeNotification = function (immediately = false) {
            if (noticeElement == null) return false; // Check if it's already been removed

            // Immediately remove the notice without adding the closing class.
            if (immediately) return noticeElement.remove();

            noticeElement.classList.add("ll-notice-closing");
            setTimeout(() => {noticeElement.remove();}, 300);
        };

        const noticeElement = <div class={this.joinClassNames("ll-notice", type && `ll-notice-${type}`)}>
            <div class="ll-notice-close" onClick={() => closeNotification()}></div>
            <span class="ll-notice-content">{content}</span>
            {buttons.map((button) => {
                if (!button || !button.label || typeof(button.onClick) !== "function") return null;
                return (<button class="ll-notice-button" onClick={button.onClick.bind(null, closeNotification)}>
                    {button.label}
                </button>)
            })}
        </div>;

        document.getElementById("ll-notices")!.appendChild(noticeElement);

        if (timeout > 0) {
            setTimeout(closeNotification, timeout);
        }

        return closeNotification;
    }

    private static ensureContainer() {
        if (document.getElementById("ll-notices")) return true;
        const container = document.querySelector(`.${this.baseClass}`);
        if (!container) return false;
        const noticeContainer = <div id="ll-notices"></div>;
        container.prepend(noticeContainer);
        return true;
    }
}
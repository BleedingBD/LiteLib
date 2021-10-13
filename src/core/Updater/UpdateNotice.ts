import Notices, { CloseFn } from "../../common/Notices";
import { createHTMLElement } from "../../common/Utilities";
import { applyUpdate } from "./UpdatePerformer";

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

const pluginsList: HTMLElement = createHTMLElement("span", {className: "ll-update-notice-list"});
const noticeNode: HTMLElement = createHTMLElement("span", {className: "ll-update-notice"},
    "The following plugins have updates: ",
    pluginsList);

let currentCloseFunction: CloseFn | undefined;

export const update = (outdatedPlugins: string[]) => {
    const isShown = currentCloseFunction && document.contains(noticeNode);
    if (!outdatedPlugins.length) { 
        if (isShown) currentCloseFunction!();
        return;
    }
    
    if (!isShown) {
        currentCloseFunction = Notices.info(noticeNode, { 
            timeout: 0,
            buttons: [{
                label: "Update All",
                onClick: () => {
                    outdatedPlugins.forEach(plugin => applyUpdate(plugin));
                    currentCloseFunction!();
                    currentCloseFunction = undefined;
                }
            }]
        });
    }
    pluginsList.innerHTML = "";
    outdatedPlugins.forEach(plugin => {
        const pluginNode = createHTMLElement("strong", {
            className: "ll-update-notice-plugin",
            onclick: ()=> { 
                applyUpdate(plugin)
            }
        }, plugin);
        pluginsList.appendChild(document.createTextNode(" "));
        pluginsList.appendChild(pluginNode);
    });
};
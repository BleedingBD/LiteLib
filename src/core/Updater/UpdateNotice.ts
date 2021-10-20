import Notices, { CloseFn } from "@common/Notices";
import { createHTMLElement } from "@common/Utilities";
import { applyUpdate } from "./UpdatePerformer";

BdApi.injectCSS("ll-update-notice",`
.ll-update-notice-plugin {
    cursor: pointer;
    padding-left: .2em;
}
.ll-update-notice-plugin:hover {
    text-decoration: underline;
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
        pluginsList.append(
            createHTMLElement("strong", {
                className: "ll-update-notice-plugin",
                onclick: ()=> { 
                    applyUpdate(plugin);
                }
            }, plugin)
        );
        pluginsList.append(", ");
    });
    pluginsList.lastChild?.remove?.();
};

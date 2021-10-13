import { ReactNode } from "react";
import Logger from "./Logger";
import Modules from "./Modules";

const React = BdApi.React;
const ModalActions = Modules.findByProps("openModal", "updateModal");
const FormTitle = Modules.findByDisplayName("FormTitle");
const Buttons = Modules.findByProps("ButtonColors");
const {ModalRoot, ModalHeader, ModalContent, ModalFooter, ModalSize} = Modules.findByProps("ModalRoot");
const Messages = Modules.findByProps("Messages", "setLocale")?.Messages;

class ReactWrapper extends React.Component<{element: Node}> {
    elementRef = React.createRef<Node>();
    element: Node;

    constructor(props: {element: Node}) {
        super(props);
        this.element = props.element;
    }

    componentDidMount() {
        if (this.element instanceof Node) this.elementRef.current!.appendChild(this.element);
    }

    render() {
        const props: any = {
            className: "ll-modal-wrap",
            ref: this.elementRef
        }
        if (typeof(this.element) === "string") props.dangerouslySetInnerHTML = {__html: this.element};
        return React.createElement("div", props);
    }
}

export default class Modals{

    static show(title: string, panel: Node|React.FC|React.Component){
        let child: ReactNode;
        if (typeof(panel) === "function") {
            child = React.createElement(panel);
        } else if (panel instanceof Node || typeof(panel) === "string") {
            child = React.createElement(ReactWrapper,{ element: panel });
        } else if (React.isValidElement(panel)) {
            child = panel;
        }
        if (!child) {
            Logger.error("Modals.showModal", "Invalid panel type", panel);
            return;
        }
        
        const modal = (props: any) => {
            return React.createElement(ModalRoot, Object.assign({size: ModalSize.MEDIUM, className: "ll-modal"}, props),
                React.createElement(ModalHeader, {separator: false, className: "ll-modal-header"},
                    React.createElement(FormTitle, {tag: "h4"}, title)
                ),
                React.createElement(ModalContent, {className: "ll-modal-content"},child),
                React.createElement(ModalFooter, {className: "ll-modal-footer"},
                    React.createElement(Buttons.default, {onClick: props.onClose, className: "bd-button"}, Messages?.DONE||"Done")
                )
            );
        };

        return ModalActions.openModal((props: any) => {
            return React.createElement(modal, props);
        });
    }

    static showPluginSettings(pluginName: string) {
        const plugin = BdApi.Plugins.get(pluginName);
        if (!plugin){
            Logger.error("Modals.showPluginSettings", "Plugin not found", pluginName);
            return;
        }
        if (plugin.instance.getSettingsPanel) {
            const panel = plugin.instance.getSettingsPanel();
            if (panel) Modals.show(`${pluginName} Settings`, panel);
        }
    }

    static showPluginChangelog(pluginName: string) {
        const plugin = BdApi.Plugins.get(pluginName);
        if (!plugin){
            Logger.error("Modals.showPluginSettings", "Plugin not found", pluginName);
            return;
        }
        if (plugin.instance.getChangelogPanel) {
            const panel = plugin.instance.getSettingsPanel();
            if (panel) Modals.show(`${pluginName} Settings`, panel);
        }
    }
}
import { ReactNode } from "react";
import Logger from "./Logger";
import Modules from "./Modules";

const React = BdApi.React;
const ModalActions = Modules.findByProps("openModal", "updateModal");
const FormTitle = Modules.findByDisplayName("FormTitle");
const Button = Modules.findByProps("ButtonColors").default;
const {ModalRoot, ModalHeader, ModalContent, ModalFooter, ModalSize} = Modules.findByProps("ModalRoot");
const Messages = Modules.findByProps("Messages", "setLocale")?.Messages;

class ReactWrapper extends React.Component<{element: Node|string}> {
    elementRef = React.createRef<Node>();
    element: Node|string;

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

type CloseFn = () => void;
interface ButtonDefintion {
    label: string;
    onClick: (close: CloseFn)=>void;
}

export default class Modals{
    static showConfirmationDialog = BdApi.showConfirmationModal;

    static show(title: string, panel: Node|React.FC|React.Component|ReactNode, buttons?: ButtonDefintion[]){
        let child: ReactNode;
        if (typeof(panel) === "function") {
            child = React.createElement(panel as React.FC);
        } else if (panel instanceof Node || typeof(panel) === "string") {
            child = <ReactWrapper element={panel}/>;
        } else if (React.isValidElement(panel)) {
            child = panel;
        }
        if (!child) {
            Logger.error("Modals.showModal", "Invalid panel type", panel);
            return;
        }

        const modal = (props: any) => {
            const renderedButtons = buttons ?
                buttons.map((b)=><Button className="bd-button" onClick={()=>b.onClick(props.onClose)}>
                    {b.label}
                </Button>):
                [<Button className="bd-button" onClick={props.onClose}>{Messages?.DONE||"Done"}</Button>];

            return React.createElement(ModalRoot, Object.assign({size: ModalSize.MEDIUM, className: "ll-modal"}, props),
                <ModalHeader separator="false" className="ll-modal-header">
                    <FormTitle tag="h4">{title}</FormTitle>
                </ModalHeader>,
                <ModalContent className="ll-modal-content">{child}</ModalContent>,
                <ModalFooter className="ll-modal-footer">
                    {...renderedButtons}
                </ModalFooter>
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
            const panel = plugin.instance.getChangelogPanel();
            if (panel) Modals.show(`${pluginName} Changelog (@${plugin.version})`, panel);
        }
    }
}

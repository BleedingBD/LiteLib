import { ReactNode } from "react";
declare type CloseFn = () => void;
interface ButtonDefintion {
    label: string;
    onClick: (close: CloseFn) => void;
}
export default class Modals {
    static showConfirmationDialog: typeof import("@betterdiscord/bdapi").BdApiModule.showConfirmationModal;
    static show(title: string, panel: Node | React.FC | React.Component | ReactNode, buttons?: ButtonDefintion[]): any;
    static showPluginSettings(pluginName: string): void;
    static showPluginChangelog(pluginName: string): void;
}
export {};

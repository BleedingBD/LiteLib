declare type RemoveFn = () => void;
export default class Styler {
    pluginName: string;
    private styles;
    private index;
    constructor(pluginName: string);
    /**
     * Add a stylesheet to the document.
     * @param style The css string to add as a stylesheet.
     * @returns A function that removes the stylesheet from the document.
     */
    add(style: string): RemoveFn;
    /**
     * Add a stylesheet to the document.
     * @param name The name of the stylesheet, can be used to remove it later.
     * @param style The css string to add as a stylesheet.
     * @returns A function that removes the stylesheet from the document.
     */
    add(name: string, style: string): RemoveFn;
    /**
     * Remove a stylesheet with the given name from the document.
     * @param name The name of the stylesheet to remove.
     */
    remove(name: string): void;
    /**
     * Remove all stylesheets that were added by this Styler instance from the document.
     */
    removeAll(): void;
}
export {};

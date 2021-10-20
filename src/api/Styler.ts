type RemoveFn = () => void;

export default class Styler{
    pluginName: string;
    private styles = new Set<string>();
    private index = 0;

    constructor(pluginName: string){
        this.pluginName = pluginName;
    }

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
    add(name:string, style?: string): RemoveFn{
        if(!style) {
            style = name;
            name = `${this.index++}`;
        }
        const key = `${this.pluginName}--Styler--${name}`
        BdApi.injectCSS(key, style);
        this.styles.add(key);
        return ()=>{this.remove(name)};
    }

    /**
     * Remove a stylesheet with the given name from the document.
     * @param name The name of the stylesheet to remove.
     */
    remove(name: string){
        const key = `${this.pluginName}--Styler--${name}`;
        BdApi.clearCSS(key);
        this.styles.delete(key);
    }

    /**
     * Remove all stylesheets that were added by this Styler instance from the document.
     */
    removeAll(){
        for(const key of this.styles){
            BdApi.clearCSS(key);
        }
        this.styles.clear();
        this.index = 0;
    }
}

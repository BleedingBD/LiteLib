export default class Styler{
    pluginName: string;
    private styles = new Set<string>();
    private index = 0;

    constructor(pluginName: string){
        this.pluginName = pluginName;
    }

    add(style: string): ()=>void;
    add(name: string, style: string): ()=>void;
    add(name:string, style: string): ()=>void{
        if(!style) {
            style = name;
            name = `${this.index++}`;
        }
        const key = `${this.pluginName}--Styler--${name}`
        BdApi.injectCSS(key, style);
        this.styles.add(key);
        return ()=>{this.remove(name)};
    }

    remove(name: string){
        const key = `${this.pluginName}--Styler--${name}`;
        BdApi.clearCSS(key);
        this.styles.delete(key);
    }

    removeAll(){
        for(const key of this.styles){
            BdApi.clearCSS(key);
        }
        this.styles.clear();
        this.index = 0;
    }
}

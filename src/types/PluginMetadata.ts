export default interface PluginMetadata{
    name: string;
    version: string;
    description: string;
    author: string;
    authorId?: string|undefined;
    updateUrl?: string|undefined;
    license?: string|undefined;
    litelib?: string|undefined;
    [key:string]:string;
}
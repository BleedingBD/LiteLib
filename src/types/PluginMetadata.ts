export default interface PluginMetadata{
    name: string;
    version: string;
    description: string;
    author: string;
    authorId?: string;
    updateUrl?: string;
    license?: string;
    litelib?: string;
    [key:string]:string;
}
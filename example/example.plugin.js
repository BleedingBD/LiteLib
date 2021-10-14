/**
 * @name ExamplePlugin
 * @description An example plugin using LiteLib.
 * @version 1.0.0
 * @updateUrl https://example.com/example.plugin.js
 * @license Unlicense
 * @author John Doe
 * @invite gj7JFa6mF8
 * @litelib ^1.0.0
 */

module.exports = 'LiteLib' in window ?
class extends window.LiteLib.Plugin("ExamplePlugin") {
    style({Styler}){
        Styler.add(`
            .some-class {
                display: none;
            }
        `)
    }
} :
class {
    load(){
        const name = BdApi.Plugins.getAll().find(p=>p.instance==this).name;
        BdApi.showConfirmationModal(
            "Library plugin is needed",
            [`The library plugin needed for ${name} is missing. Please click Download to install it.`],
            {
                confirmText: "Download",
                cancelText: "Cancel",
                onConfirm: async () => {
                    // TODO: download urls
                    try {
                        const response = await fetch("");
                        const fileContent = await response.text();
                        await require("fs").promises.writeFile(require("path").join(BdApi.Plugins.folder, "0LiteLib.plugin.js"), fileContent);
                    } catch(_) {
                        require("electron").shell.openExternal("");
                    }
                }
            }
        );
    }
    start(){}
    stop(){}
};
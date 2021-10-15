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
const name = "ExamplePlugin"

module.exports = window.LiteLib ?
class extends window.LiteLib.Plugin(name) {
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
        BdApi.showConfirmationModal(
            "Library plugin is needed",
            [`The library plugin needed for ${name} is missing. Please click Download to install it.`],
            {
                confirmText: "Download",
                cancelText: "Cancel",
                onConfirm: () => {
                    const fs = require("fs").promises;
                    fetch("")
                        .then(r=>r.text())
                        .then(c=>fs.writeFile(require("path").join(BdApi.Plugins.folder, "0LiteLib.plugin.js"), pc)
                        .catch(_=>require("electron").shell.openExternal());
                }
            }
        );
    }
    start(){}
    stop(){}
};
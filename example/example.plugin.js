/**
 * @name ExamplePlugin
 * @description An example plugin using LiteLib.
 * @version 1.0.0
 * @updateUrl https://raw.githubusercontent.com/BleedingBD/LiteLib/stable/example/example.plugin.js
 * @license Unlicense
 * @author John Doe
 * @invite gj7JFa6mF8
 * @litelib ^0.2.0
 */

module.exports = window.LiteLib ?
class extends window.LiteLib.Plugin() {
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
            [`The library plugin needed is missing. Please click Download to install it.`],
            {
                confirmText: "Download",
                cancelText: "Cancel",
                onConfirm: () => {
                    const fs = require("fs").promises;
                    fetch("https://raw.githubusercontent.com/BleedingBD/LiteLib/stable/dist/0LiteLib.plugin.js")
                        .then(r=>r.text())
                        .then(c=>fs.writeFile(require("path").join(BdApi.Plugins.folder, "0LiteLib.plugin.js"), c))
                        .catch(()=>require("electron").shell.openExternal("https://raw.githubusercontent.com/BleedingBD/LiteLib/stable/dist/0LiteLib.plugin.js"));
                }
            }
        );
    }
    start(){}
    stop(){}
};
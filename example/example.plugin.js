/**
 * @name ExamplePlugin
 * @description An example plugin using LiteLib.
 * @version 1.0.0
 * @updateUrl https://example.com/example.plugin.js
 * @license Unlicense
 * @author John Doe
 * @invite gj7JFa6mF8
 * @litelib [1.0.0,)
 */

module.exports = 'LiteLib' in window ?
class extends window.LiteLib.Plugin("ExamplePlugin") {

    // some common discord modules like Dispatcher(wrapped) and React are available directly.
    setup({Dispatcher}){
        Dispatcher.subscribe(someAction, someFn);
    }

    //the object passed to built-in methods is `this`
    patch({Patcher, Modules}){
        const m = Modules.findByDisplayName('SomeComponent') //memoized
        Patcher.after(m, 'render', (thisArg, args, ret)=>{
            
        });

        const m2 = Modules.find('SomeOtherComponent', (m)=>{}) //memoized by first param
        Patcher.before(m2, 'default',(thisArg, args)=>{
            
        })
    }

    style({Styler}){
        Styler.add('some-style', `
            .some-class {
                display: none;
            }
        `)
    }

    cleanup({Dispatcher}){
        Dispatcher.unsubscribeAll();
    }

    /*
    // unpatch and unstyle will default to the functions below but can be overriden.
    // like patch and style are run automatically on start unpatch and unstyle are run automatically on stop.
    // these can easily be rerun when updating configs
    // for special setup and cleanup routines use the methods of the 

    unpatch(){
        Patcher.unpatchAll();
    }

    unstyle(){
        Styler.removeAll();
    }

    // add subscribe and unsubscribe methods? The Dispatcher will also be wrapped with utility functions after all.
    // add css method returning a string that will automatically be added before style is called and removed by Styler.removeAll()
    */
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
                        await require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0LiteLib.plugin.js"), body, r);
                        // TODO: make the lib itself reload the client or prompt to do so when first installed?
                        window.location.reload();
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
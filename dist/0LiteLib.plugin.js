/**
 * @name LiteLib
 * @version 0.4.0
 * @description A lightweight library for creating BetterDiscord plugins.
 * @license Unlicense
 * @author Qb
 * @litelib ^0.4.0
 * @pluginPath 0LiteLib.plugin.js
 * @configPath 0LiteLib.config.json
 * @updateUrl https://raw.githubusercontent.com/BleedingBD/LiteLib/stable/dist/0LiteLib.plugin.js
 *
 * @dependencies
 *
 * tslib -- 2.3.1
 * License: 0BSD
 * Author: Microsoft Corp.
 * Homepage: https://www.typescriptlang.org/
 *
 * typescript-memoize -- 1.0.1
 * License: MIT
 * Author: Darryl Hodgins
 * Homepage: https://github.com/darrylhodgins/typescript-memoize#readme
 *
 * semiver -- 1.1.0
 * License: MIT
 * Author: Luke Edwards
 */

"use strict";

var fs = require("fs"), path = require("path");

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function __decorate(decorators, target, key, desc) {
    var d, c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc;
    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function Memoize(autoHashOrHashFn) {
    return (target, propertyKey, descriptor) => {
        if (null != descriptor.value) descriptor.value = getNewFunction(descriptor.value, autoHashOrHashFn); else {
            if (null == descriptor.get) throw "Only put a Memoize() decorator on a method or get accessor.";
            descriptor.get = getNewFunction(descriptor.get, autoHashOrHashFn);
        }
    };
}

let counter = 0;

function getNewFunction(originalMethod, autoHashOrHashFn, duration = 0) {
    const identifier = ++counter;
    return function(...args) {
        const propValName = `__memoized_value_${identifier}`, propMapName = `__memoized_map_${identifier}`;
        let returnedValue;
        if (autoHashOrHashFn || args.length > 0 || duration > 0) {
            this.hasOwnProperty(propMapName) || Object.defineProperty(this, propMapName, {
                configurable: !1,
                enumerable: !1,
                writable: !1,
                value: new Map
            });
            let hashKey, myMap = this[propMapName];
            hashKey = !0 === autoHashOrHashFn ? args.map((a => a.toString())).join("!") : autoHashOrHashFn ? autoHashOrHashFn.apply(this, args) : args[0];
            const timestampKey = `${hashKey}__timestamp`;
            let isExpired = !1;
            if (duration > 0) if (myMap.has(timestampKey)) {
                let timestamp = myMap.get(timestampKey);
                isExpired = Date.now() - timestamp > duration;
            } else isExpired = !0;
            myMap.has(hashKey) && !isExpired ? returnedValue = myMap.get(hashKey) : (returnedValue = originalMethod.apply(this, args), 
            myMap.set(hashKey, returnedValue), duration > 0 && myMap.set(timestampKey, Date.now()));
        } else this.hasOwnProperty(propValName) ? returnedValue = this[propValName] : (returnedValue = originalMethod.apply(this, args), 
        Object.defineProperty(this, propValName, {
            configurable: !1,
            enumerable: !1,
            writable: !1,
            value: returnedValue
        }));
        return returnedValue;
    };
}

class Modules$1 {
    static findByProps(...props) {
        return BdApi.findModuleByProps(...props);
    }
    static findByDisplayName(displayName) {
        return BdApi.findModuleByDisplayName(displayName);
    }
    static find=BdApi.findModule;
    static findAll=BdApi.findAllModules;
}

__decorate([ Memoize(((...props) => props.join(","))) ], Modules$1, "findByProps", null), 
__decorate([ Memoize() ], Modules$1, "findByDisplayName", null);

class Logger$1 {
    static style="font-weight: 700; color: blue";
    static debug(name, ...args) {
        console.debug(`%c[${name}]%c`, this.style, "", ...args);
    }
    static info(name, ...args) {
        console.info(`%c[${name}]%c`, this.style, "", ...args);
    }
    static log(name, ...args) {
        console.log(`%c[${name}]%c`, this.style, "", ...args);
    }
    static warn(name, ...args) {
        console.warn(`%c[${name}]%c`, this.style, "", ...args);
    }
    static error(name, ...args) {
        console.error(`%c[${name}]%c`, this.style, "", ...args);
    }
    static assert(condition, name, ...args) {
        console.assert(condition, `%c[${name}]%c`, this.style, "", ...args);
    }
    static trace(name, ...args) {
        console.trace(`%c[${name}]%c`, this.style, "", ...args);
    }
}

function applyChildren(node, children) {
    for (const child of children.filter((c => c || 0 == c))) Array.isArray(child) ? applyChildren(node, child) : node.append(child);
}

function createHTMLElement(tag, attrs, ...children) {
    const element = document.createElement(tag);
    return attrs && Object.assign(element, attrs), applyChildren(element, children), 
    element;
}

const walkable = [ "props", "state", "children", "sibling", "child" ];

function useGeneric(on, off, ...dependencies) {
    const [, forceUpdate] = BdApi.React.useReducer((i => i + 1), 0);
    return BdApi.React.useEffect((() => (on(forceUpdate), () => {
        off(forceUpdate);
    })), dependencies), forceUpdate;
}

var Utilities = Object.freeze({
    __proto__: null,
    createHTMLElement,
    suppressErrors: function suppressErrors(func, message, async = !1) {
        const ret = BdApi.suppressErrors(func);
        async && ret instanceof Promise && ret.catch((e => {
            Logger$1.trace("SuppressedError", "Error occurred in " + message, e);
        }));
    },
    findInReactTree: function findInReactTree(root, predicate) {
        if (predicate(root)) return root;
        if (Array.isArray(root)) for (const child of root) {
            const found = findInReactTree(child, predicate);
            if (found) return found;
        } else {
            const found = walkable.find((key => root[key] && findInReactTree(root[key], predicate)));
            if (found) return found;
        }
        return null;
    },
    selectorFromClasses: function selectorFromClasses(...classes) {
        return classes.map((c => `.${c.split(" ").join(".")}`)).join("");
    },
    useGeneric
});

class Notices {
    static get baseClass() {
        return Modules$1.findByProps("container", "base")?.base;
    }
    static info(content, options = {}) {
        return this.show(content, {
            ...options,
            type: "info"
        });
    }
    static warn(content, options = {}) {
        return this.show(content, {
            ...options,
            type: "warning"
        });
    }
    static error(content, options = {}) {
        return this.show(content, {
            ...options,
            type: "error"
        });
    }
    static success(content, options = {}) {
        return this.show(content, {
            ...options,
            type: "success"
        });
    }
    static show(content, options = {}) {
        const {type, buttons = [], timeout = 1e4} = options;
        if (!this.ensureContainer()) return;
        const closeNotification = function(immediately = !1) {
            if (immediately) return noticeElement.remove();
            noticeElement.classList.add("ll-notice-closing"), setTimeout((() => {
                noticeElement.remove();
            }), 300);
        }, noticeElement = createHTMLElement("div", {
            className: "ll-notice" + (type ? ` ll-notice-${type}` : "")
        }, [ createHTMLElement("div", {
            className: "ll-notice-close",
            onclick: () => closeNotification()
        }), createHTMLElement("span", {
            className: "ll-notice-content"
        }, content), ...buttons.map((button => button?.label && "function" == typeof button.onClick ? createHTMLElement("button", {
            className: "ll-notice-button",
            onclick: button.onClick.bind(null, closeNotification)
        }, button.label) : null)) ]);
        return document.getElementById("ll-notices").appendChild(noticeElement), timeout > 0 && setTimeout(closeNotification, timeout), 
        closeNotification;
    }
    static ensureContainer() {
        if (document.getElementById("ll-notices")) return !0;
        const container = document.querySelector(`.${this.baseClass}`);
        if (!container) return !1;
        const noticeContainer = createHTMLElement("div", {
            id: "ll-notices"
        });
        return container.prepend(noticeContainer), !0;
    }
}

__decorate([ Memoize() ], Notices, "baseClass", null);

const COMMENT = /\/\*\*\s*\n([^*]|(\*(?!\/)))*\*\//g, STAR_MATCHER = /^ \* /, FIELD_MATCHER = /^@(\w+)\s+(.*)/m;

function parseMetadata(fileContent, strict = !0) {
    const match = fileContent.match(COMMENT);
    if (!match || 0 != fileContent.indexOf(match[0]) && strict) return;
    const comment = match[0].replace(/^\/\*\*?/, "").replace(/\*\/$/, "").split(/\n\r?/).map((l => l.replace(STAR_MATCHER, ""))), ret = {
        "": ""
    };
    let currentKey = "";
    for (const line of comment) {
        const field = line.match(FIELD_MATCHER);
        field ? (currentKey = field[1], ret[currentKey] = field[2]) : ret[currentKey] += "\n" + line;
    }
    return ret[currentKey] = ret[currentKey].trimEnd(), delete ret[""], ret;
}

const pendingUpdates = new Map, listeners = new Set;

class PendingUpdateStore {
    static getPendingUpdate(name) {
        return pendingUpdates.get(name);
    }
    static getPendingUpdates() {
        return [ ...pendingUpdates.values() ];
    }
    static addPendingUpdate(name, currentMetadata, remoteMetadata) {
        pendingUpdates.has(name) ? pendingUpdates.get(name)?.remoteMetadata.version != remoteMetadata.version && (pendingUpdates.set(name, {
            name,
            currentMetadata,
            remoteMetadata
        }), this.emit()) : (pendingUpdates.set(name, {
            name,
            currentMetadata,
            remoteMetadata
        }), this.emit());
    }
    static removePendingUpdate(name) {
        pendingUpdates.delete(name), this.emit();
    }
    static emit() {
        listeners.forEach((listener => listener(this.getPendingUpdates())));
    }
    static subscribe(callback) {
        listeners.add(callback);
    }
}

async function applyUpdate(pluginName) {
    try {
        const pendingUpdate = PendingUpdateStore.getPendingUpdate(pluginName);
        if (!pendingUpdate) return !1;
        const {currentMetadata} = pendingUpdate, response = await fetch(currentMetadata.updateUrl), fileContent = await response.text(), incomingMetadata = parseMetadata(fileContent);
        if (!incomingMetadata || !incomingMetadata.name) return !1;
        const targetConfigPath = path.resolve(BdApi.Plugins.folder, incomingMetadata.configPath || `${incomingMetadata.name}.config.json`), currentConfigPath = path.resolve(BdApi.Plugins.folder, currentMetadata.configPath || `${currentMetadata.name}.config.json`);
        targetConfigPath != currentConfigPath && await fs.promises.rename(currentConfigPath, targetConfigPath);
        const targetPath = path.resolve(BdApi.Plugins.folder, incomingMetadata.pluginPath || `${incomingMetadata.name}.plugin.js`);
        await fs.promises.writeFile(targetPath, fileContent, "utf-8");
        const currentPath = path.resolve(BdApi.Plugins.folder, currentMetadata.filename);
        return targetPath != currentPath && await fs.promises.unlink(currentPath), PendingUpdateStore.removePendingUpdate(pluginName), 
        !0;
    } catch (e) {
        return Logger$1.error("Updater", `Error while trying to update ${pluginName}`, e), 
        !1;
    }
}

const pluginsList = createHTMLElement("span", {
    className: "ll-update-notice-list"
}), noticeNode = createHTMLElement("span", {
    className: "ll-update-notice"
}, "The following plugins have updates: ", pluginsList);

let currentCloseFunction;

var fn = new Intl.Collator(0, {
    numeric: 1
}).compare;

const regex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/, valid = v => regex.test(v);

PendingUpdateStore.subscribe((pendingUpdates => {
    (outdatedPlugins => {
        const isShown = currentCloseFunction && document.contains(noticeNode);
        outdatedPlugins.length ? (isShown || (currentCloseFunction = Notices.info(noticeNode, {
            timeout: 0,
            buttons: [ {
                label: "Update All",
                onClick: () => {
                    outdatedPlugins.forEach((plugin => applyUpdate(plugin))), currentCloseFunction(), 
                    currentCloseFunction = void 0;
                }
            } ]
        })), pluginsList.innerHTML = "", outdatedPlugins.forEach((plugin => {
            pluginsList.append(createHTMLElement("strong", {
                className: "ll-update-notice-plugin",
                onclick: () => {
                    applyUpdate(plugin);
                }
            }, plugin)), pluginsList.append(", ");
        })), pluginsList.lastChild?.remove?.()) : isShown && currentCloseFunction();
    })(pendingUpdates.map((pendingUpdate => pendingUpdate.name)));
}));

class Updater {
    static async checkForUpdate(metadata) {
        const name = metadata.name, currentVersion = metadata.version, updateUrl = metadata.updateUrl;
        if (name && currentVersion && updateUrl && valid(currentVersion)) {
            Logger$1.debug("Updater", `Checking ${name} (@${currentVersion}) for updates.`);
            try {
                const remoteMeta = await this.fetchMetadata(updateUrl), remoteVersion = remoteMeta?.version;
                if (remoteVersion && valid(remoteVersion) && function semiver(a, b, bool) {
                    return a = a.split("."), b = b.split("."), fn(a[0], b[0]) || fn(a[1], b[1]) || (b[2] = b.slice(2).join("."), 
                    (bool = /[.-]/.test(a[2] = a.slice(2).join("."))) == /[.-]/.test(b[2]) ? fn(a[2], b[2]) : bool ? -1 : 1);
                }(remoteVersion, currentVersion) > 0) return PendingUpdateStore.addPendingUpdate(name, metadata, remoteMeta), 
                !0;
            } catch (error) {
                Logger$1.error("Updater", `Failed to check for updates for ${name} (@${currentVersion}).`, error);
            }
            return !1;
        }
    }
    static async fetchMetadata(url) {
        const response = await fetch(url);
        return parseMetadata(await response.text());
    }
}

class Modules {
    findCache=new Map;
    findAllCache=new Map;
    findByProps=Modules$1.findByProps;
    findByDisplayName=Modules$1.findByDisplayName;
    find(name, predicate) {
        return Modules$1.find(predicate);
    }
    findAll(name, predicate) {
        return Modules$1.findAll(predicate);
    }
}

__decorate([ Memoize() ], Modules.prototype, "find", null), __decorate([ Memoize() ], Modules.prototype, "findAll", null);

const BDPatcher = BdApi.Patcher;

class Styler {
    pluginName;
    styles=new Set;
    index=0;
    constructor(pluginName) {
        this.pluginName = pluginName;
    }
    add(name, style) {
        style || (style = name, name = "" + this.index++);
        const key = `${this.pluginName}--Styler--${name}`;
        return BdApi.injectCSS(key, style), this.styles.add(key), () => {
            this.remove(name);
        };
    }
    remove(name) {
        const key = `${this.pluginName}--Styler--${name}`;
        BdApi.clearCSS(key), this.styles.delete(key);
    }
    removeAll() {
        for (const key of this.styles) BdApi.clearCSS(key);
        this.styles.clear(), this.index = 0;
    }
}

const discordDispatcher = Modules$1.findByProps("subscribe", "unsubscribe") || Modules$1.findByProps("dispatch", "dirtyDispatch");

class Dispatcher {
    ActionTypes=Modules$1.findByProps("ActionTypes")?.ActionTypes;
    constructor() {
        this.ActionTypes || (Logger$1.warn("Dispatcher", "ActionTypes not found, defaulting to identity proxy."), 
        this.ActionTypes = new Proxy({}, {
            get: (_, prop) => prop,
            set: () => !1
        }));
    }
    subscriptions=new Map;
    subscribe(action, listener) {
        this.subscriptions.has(action) || this.subscriptions.set(action, new Set);
        const actionSubscriptions = this.subscriptions.get(action);
        return actionSubscriptions.has(listener) && (discordDispatcher.subscribe(action, listener), 
        actionSubscriptions.add(listener)), () => this.unsubscribe(action, listener);
    }
    unsubscribe(action, listener) {
        if (!this.subscriptions.has(action)) return;
        const actionSubscriptions = this.subscriptions.get(action);
        if (listener) actionSubscriptions.has(listener) && (discordDispatcher.unsubscribe(action, listener), 
        actionSubscriptions.delete(listener)); else {
            for (const listener of actionSubscriptions) discordDispatcher.unsubscribe(action, listener);
            actionSubscriptions.clear();
        }
    }
    unsubscribeAll() {
        for (const action of this.subscriptions.keys()) this.unsubscribe(action);
        this.subscriptions.clear();
    }
    dispatch(payload) {
        return discordDispatcher.dispatch(payload);
    }
    dirtyDispatch(payload) {
        return discordDispatcher.dirtyDispatch(payload);
    }
}

class DataStore extends class EventEmitter {
    listeners=new Map;
    on(event, listener) {
        return this.listeners.has(event) || this.listeners.set(event, []), this.listeners.get(event)?.push?.(listener), 
        this;
    }
    off(event, listener) {
        if (this.listeners.has(event)) {
            const listeners = this.listeners.get(event), index = listeners.indexOf(listener);
            index > 0 && listeners.splice(index, 1);
        }
        return this;
    }
    emit(event, ...args) {
        if (this.listeners.has(event)) {
            const listeners = this.listeners.get(event);
            for (const listener of listeners) listener(...args);
        }
        return this;
    }
} {
    key;
    configPath;
    data;
    constructor(configPath, key) {
        super(), this.key = key, this.configPath = configPath, this.data = BdApi.getData(this.configPath, this.key) || {};
    }
    has(key) {
        return key in this.data;
    }
    get(key, defaultValue) {
        return key in this.data ? this.data[key] : defaultValue;
    }
    set(key, value) {
        if (void 0 === value) return this.delete(key);
        this.data[key] = value, this.emit("change", key, value), this.syncData();
    }
    modify(key, modifier, defaultValue) {
        this.set(key, modifier(this.get(key, defaultValue)));
    }
    delete(key) {
        delete this.data[key], this.emit("change", key, void 0), this.syncData();
    }
    on(event, listener) {
        return super.on(event, listener);
    }
    syncData() {
        window.setTimeout((() => BdApi.saveData(this.configPath, this.key, this.data)), 0);
    }
}

const React = BdApi.React, ModalActions = Modules$1.findByProps("openModal", "updateModal"), FormTitle = Modules$1.findByDisplayName("FormTitle"), Button = Modules$1.findByProps("ButtonColors").default, {ModalRoot, ModalHeader, ModalContent, ModalFooter, ModalSize} = Modules$1.findByProps("ModalRoot"), Messages = Modules$1.findByProps("Messages", "setLocale")?.Messages;

class ReactWrapper extends React.Component {
    elementRef=React.createRef();
    element;
    constructor(props) {
        super(props), this.element = props.element;
    }
    componentDidMount() {
        this.element instanceof Node && this.elementRef.current.appendChild(this.element);
    }
    render() {
        const props = {
            className: "ll-modal-wrap",
            ref: this.elementRef
        };
        return "string" == typeof this.element && (props.dangerouslySetInnerHTML = {
            __html: this.element
        }), React.createElement("div", props);
    }
}

class Modals {
    static showConfirmationDialog=BdApi.showConfirmationModal;
    static show(title, panel, buttons) {
        let child;
        if ("function" == typeof panel ? child = React.createElement(panel) : panel instanceof Node || "string" == typeof panel ? child = BdApi.React.createElement(ReactWrapper, {
            element: panel
        }) : React.isValidElement(panel) && (child = panel), !child) return void Logger$1.error("Modals.showModal", "Invalid panel type", panel);
        const modal = props => {
            const renderedButtons = buttons ? buttons.map((b => BdApi.React.createElement(Button, {
                className: "bd-button",
                onClick: () => b.onClick(props.onClose)
            }, b.label))) : [ BdApi.React.createElement(Button, {
                className: "bd-button",
                onClick: props.onClose
            }, Messages?.DONE || "Done") ];
            return React.createElement(ModalRoot, Object.assign({
                size: ModalSize.MEDIUM,
                className: "ll-modal"
            }, props), BdApi.React.createElement(ModalHeader, {
                separator: "false",
                className: "ll-modal-header"
            }, BdApi.React.createElement(FormTitle, {
                tag: "h4"
            }, title)), BdApi.React.createElement(ModalContent, {
                className: "ll-modal-content"
            }, child), BdApi.React.createElement(ModalFooter, {
                className: "ll-modal-footer"
            }, renderedButtons));
        };
        return ModalActions.openModal((props => React.createElement(modal, props)));
    }
    static showPluginSettings(pluginName) {
        const plugin = BdApi.Plugins.get(pluginName);
        if (plugin) {
            if (plugin.instance.getSettingsPanel) {
                const panel = plugin.instance.getSettingsPanel();
                panel && Modals.show(`${pluginName} Settings`, panel);
            }
        } else Logger$1.error("Modals.showPluginSettings", "Plugin not found", pluginName);
    }
    static showPluginChangelog(pluginName) {
        const plugin = BdApi.Plugins.get(pluginName);
        if (plugin) {
            if (plugin.instance.getChangelogPanel) {
                const panel = plugin.instance.getChangelogPanel();
                panel && Modals.show(`${pluginName} Changelog (@${plugin.version})`, panel);
            }
        } else Logger$1.error("Modals.showPluginSettings", "Plugin not found", pluginName);
    }
}

class Toasts {
    static show=BdApi.showToast;
    static success(content, options) {
        BdApi.showToast(content, {
            ...options,
            type: "success"
        });
    }
    static info(content, options) {
        BdApi.showToast(content, {
            ...options,
            type: "info"
        });
    }
    static warn(content, options) {
        BdApi.showToast(content, {
            ...options,
            type: "warn"
        });
    }
    static error(content, options) {
        BdApi.showToast(content, {
            ...options,
            type: "error"
        });
    }
}

class Api {
    pluginMetadata;
    pluginName;
    get Modules() {
        return new Modules;
    }
    get Patcher() {
        return function Patcher(pluginName) {
            return {
                before: BDPatcher.before.bind(BDPatcher, pluginName),
                after: BDPatcher.after.bind(BDPatcher, pluginName),
                instead: BDPatcher.instead.bind(BDPatcher, pluginName),
                unpatchAll: BDPatcher.unpatchAll.bind(BDPatcher, pluginName)
            };
        }(this.pluginName);
    }
    get Styler() {
        return new Styler(this.pluginName);
    }
    get Dispatcher() {
        return new Dispatcher;
    }
    get Data() {
        return new DataStore(this.pluginMetadata.configPath?.replace?.(/.config.json$/, "") || this.pluginName, "data");
    }
    get Settings() {
        return new DataStore(this.pluginMetadata.configPath?.replace?.(/.config.json$/, "") || this.pluginName, "settings");
    }
    get Logger() {
        return function Logger(pluginName) {
            return {
                debug: Logger$1.debug.bind(Logger$1, pluginName),
                info: Logger$1.info.bind(Logger$1, pluginName),
                log: Logger$1.log.bind(Logger$1, pluginName),
                warn: Logger$1.warn.bind(Logger$1, pluginName),
                error: Logger$1.error.bind(Logger$1, pluginName),
                assert: (condition, ...args) => Logger$1.assert(condition, pluginName, ...args),
                trace: Logger$1.trace.bind(Logger$1, pluginName)
            };
        }(this.pluginName);
    }
    Modals=Modals;
    Notices=Notices;
    Toasts=Toasts;
    React=BdApi.React;
    ReactDOM=BdApi.ReactDOM;
    constructor(pluginMetadata) {
        this.pluginMetadata = pluginMetadata, this.pluginName = pluginMetadata.name;
    }
}

__decorate([ Memoize() ], Api.prototype, "Modules", null), __decorate([ Memoize() ], Api.prototype, "Patcher", null), 
__decorate([ Memoize() ], Api.prototype, "Styler", null), __decorate([ Memoize() ], Api.prototype, "Dispatcher", null), 
__decorate([ Memoize() ], Api.prototype, "Data", null), __decorate([ Memoize() ], Api.prototype, "Settings", null), 
__decorate([ Memoize() ], Api.prototype, "Logger", null);

class PluginBase {
    metadata;
    name;
    API;
    constructor(metadata) {
        this.metadata = metadata, this.name = metadata.name, this.API = new Api(metadata), 
        this.API.Data.on("change", ((key, value) => this.onDataChanged?.(key, value))), 
        this.API.Settings.on("change", ((key, value) => this.onSettingsChanged?.(key, value)));
    }
    load() {
        "function" == typeof this.firstLoad && setTimeout((() => this.checkForFirstLaunch()), 0), 
        "function" == typeof this.getChangelogPanel && setTimeout((() => this.checkForChangelog()), 0), 
        this.checkForUpdate(), this.initialize?.(this.API);
    }
    async checkForFirstLaunch() {
        const Data = this.API.Data;
        Data.get("firstLoad") || (this.firstLoad(this.API), Data.set("firstLoad", !0));
    }
    async checkForChangelog() {
        const {Data, Modals} = this.API, currentVersion = this.metadata.version;
        currentVersion && Data.get("version", currentVersion) !== currentVersion && (Modals.showPluginChangelog(this.name), 
        Data.set("version", currentVersion));
    }
    async checkForUpdate() {
        await Updater.checkForUpdate(this.metadata);
    }
    start() {
        const API = this.API;
        this.setup?.(API), this.patch?.(API), this.style?.(API), "function" == typeof this.css && API.Styler.add("css", this.css());
    }
    stop() {
        this.cleanup?.(this.API), this.unpatch?.(this.API), this.unstyle?.(this.API);
    }
    unpatch({Patcher}) {
        Patcher.unpatchAll();
    }
    unstyle({Styler}) {
        Styler.removeAll();
    }
    reloadPatches() {
        this.unpatch?.(this.API), this.patch?.(this.API);
    }
    reloadStyles() {
        this.unstyle?.(this.API), this.style?.(this.API), "function" == typeof this.css && this.API.Styler.add("css", this.css());
    }
    useSettings() {
        const {Settings} = this.API;
        return useGeneric((forceUpdate => Settings.on("change", forceUpdate)), (forceUpdate => {
            Settings.off("change", forceUpdate);
        }), Settings), this.API;
    }
    useData() {
        const {Data} = this.API;
        return useGeneric((forceUpdate => Data.on("change", forceUpdate)), (forceUpdate => {
            Data.off("change", forceUpdate);
        }), Data), this.API;
    }
}

function Plugin() {
    const scriptTag = document.head.querySelector("script[id$=-script-container]");
    if (scriptTag && scriptTag.textContent) {
        const metadata = parseMetadata(scriptTag.textContent, !1);
        if (metadata?.name) return class extends PluginBase {
            constructor() {
                super(metadata ?? {});
            }
        };
    }
    return class extends PluginBase {
        constructor() {
            super({
                name: "Invalid Plugin",
                description: "The metadata for the plugin couldn't be loaded.",
                version: "?.?.?"
            });
        }
    };
}

var Core = Object.freeze({
    __proto__: null,
    Plugin,
    Updater,
    Modules: Modules$1,
    Logger: Logger$1,
    Modals,
    Notices,
    Toasts,
    Utilities
});

BdApi.injectCSS("LiteLib-index.scss", ".ll-notice-success {\n  --color: #3ba55d;\n}\n\n.ll-notice-error {\n  --color: #ED4245;\n}\n\n.ll-notice-info {\n  --color: #4A8FE1;\n}\n\n.ll-notice-warning {\n  --color: #FAA81A;\n}\n\n.ll-notice-closing {\n  transition: height 400ms ease;\n  height: 0 !important;\n}\n\n@keyframes ll-open-notice {\n  from {\n\theight: 0;\n  }\n}\n.ll-notice {\n  animation: ll-open-notice 400ms ease;\n  overflow: hidden;\n  height: 36px;\n  font-size: 14px;\n  line-height: 36px;\n  font-weight: 500;\n  text-align: center;\n  position: relative;\n  padding-left: 4px;\n  padding-right: 28px;\n  z-index: 101;\n  flex: 0 0;\n  box-shadow: var(--elevation-low);\n  color: #fff;\n  background: var(--color, var(--brand-experiment-600, #3C45A5));\n}\n\n.ll-notice:first-child {\n  border-radius: 8px 0 0;\n}\n\n.ll-notice-close {\n  position: absolute;\n  top: 0;\n  right: 0;\n  width: 36px;\n  height: 36px;\n  background: url(https://discord.com/assets/7731c77d99babca1a8faec204d98c380.svg) no-repeat;\n  background-position: 50% 55%;\n  background-size: 10px 10px;\n  opacity: 0.5;\n  transition: opacity 0.2s;\n  cursor: pointer;\n  -webkit-app-region: no-drag;\n}\n\n.ll-notice-button {\n  font-size: 14px;\n  font-weight: 500;\n  position: relative;\n  top: 6px;\n  border: 1px solid;\n  color: #fff;\n  border-radius: 3px;\n  height: 24px;\n  padding: 0 10px;\n  box-sizing: border-box;\n  display: inline-block;\n  vertical-align: top;\n  margin-left: 10px;\n  line-height: 22px;\n  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;\n  -webkit-app-region: no-drag;\n  border-color: #fff;\n  background: transparent;\n}\n\n.ll-notice-button:hover {\n  color: var(--color, var(--background-mobile-primary));\n  background: #fff;\n}\n\n.ll-notice-close:hover {\n  opacity: 1;\n}\n\n.ll-update-notice-plugin {\n  cursor: pointer;\n  padding-left: 0.2em;\n}\n\n.ll-update-notice-plugin:hover {\n  text-decoration: underline;\n}");

class LiteLib extends(Plugin()){
    updateAllInterval;
    initialize(API) {
        this.updateAllInterval = setInterval((() => this.checkAllForUpdates(API)), 9e5);
    }
    firstLoad({Logger}) {
        Logger.info("Detected first load.");
        const time = new Date;
        BdApi.Plugins.getAll().forEach((plugin => {
            plugin.litelib && plugin.instance != this && (Logger.info(`Reloading ${plugin.name}.`), 
            fs.promises.utimes(path.resolve(BdApi.Plugins.folder, plugin.filename), time, time).catch((e => {
                Logger.error(`Error while reloading ${plugin.name}.`, e);
            })));
        }));
    }
    async checkAllForUpdates({Settings}) {
        if (!Settings.get("periodicUpdateChecking", !0)) return;
        const nonLitelibUpdateChecking = Settings.get("nonLitelibUpdateChecking", !1);
        BdApi.Plugins.getAll().forEach((plugin => {
            (nonLitelibUpdateChecking || plugin.litelib) && Updater.checkForUpdate(plugin);
        }));
    }
    getSettingsPanel() {
        return () => {
            const {Modules, Settings} = this.useSettings(), SwitchItem = Modules.findByDisplayName("SwitchItem");
            return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement(SwitchItem, {
                note: "Enable periodically checking for updates.",
                value: Settings.get("periodicUpdateChecking", !0),
                onChange: value => Settings.set("periodicUpdateChecking", value)
            }, "Periodic Update Checks"), BdApi.React.createElement(SwitchItem, {
                note: "Enables update checking for non-LiteLib plugins during periodic checks.",
                value: Settings.get("nonLitelibUpdateChecking", !1),
                disabled: !Settings.get("periodicUpdateChecking", !0),
                onChange: value => Settings.set("nonLitelibUpdateChecking", value)
            }, "Non-LiteLib Update Checks"));
        };
    }
}

window.LiteLib = Core, module.exports = LiteLib;

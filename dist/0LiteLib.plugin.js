/**
 * @name LiteLib
 * @version 0.1.0
 * @description A lightweight library for creating BetterDiscord plugins.
 * @author Qb
 * @license Unlicense
 * @updateUrl https://raw.githubusercontent.com/BleedingBD/LiteLib/stable/dist/0LiteLib.plugin.js
 * @litelib ^0.1.0
 * @pluginPath 0LiteLib.plugin.js
 * @configPath 0LiteLib.config.json
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
    static find(predicate) {
        return BdApi.findModule(predicate);
    }
    static findAll(predicate) {
        return BdApi.findAllModules(predicate);
    }
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
    }
});

BdApi.injectCSS("ll-notices-style", "\n.ll-notice-success {\n    --color: #3ba55d;\n}\n\n.ll-notice-error {\n    --color: #ED4245;\n}\n\n.ll-notice-info {\n    --color: #4A8FE1;\n}\n\n.ll-notice-warning {\n    --color: #FAA81A;\n}\n\n.ll-notice-closing {\n	transition: height 400ms ease;\n	height: 0 !important;\n}\n\n@keyframes ll-open-notice {\n	from {\n        height: 0;\n    }\n}\n\n.ll-notice {\n	animation: ll-open-notice 400ms ease;\n	overflow: hidden;\n	height: 36px;\n	font-size: 14px;\n	line-height: 36px;\n	font-weight: 500;\n	text-align: center;\n	position: relative;\n	padding-left: 4px;\n	padding-right: 28px;\n	z-index: 101;\n	flex: 0 0;\n	box-shadow: var(--elevation-low);\n	color: #fff;\n	background: var(--color, var(--brand-experiment-600, #3C45A5));\n}\n\n.ll-notice:first-child {\n	border-radius: 8px 0 0;\n}\n\n.ll-notice-close {\n	position: absolute;\n	top: 0;\n	right: 0;\n	width: 36px;\n	height: 36px;\n	background: url(https://discord.com/assets/7731c77d99babca1a8faec204d98c380.svg) no-repeat;\n	background-position: 50% 55%;\n	background-size: 10px 10px;\n	opacity: .5;\n	transition: opacity .2s;\n	cursor: pointer;\n    -webkit-app-region: no-drag;\n}\n\n.ll-notice-button {\n	font-size: 14px;\n	font-weight: 500;\n	position: relative;\n	top: 6px;\n	border: 1px solid;\n	color: #fff;\n	border-radius: 3px;\n	height: 24px;\n	padding: 0 10px;\n	box-sizing: border-box;\n	display: inline-block;\n	vertical-align: top;\n	margin-left: 10px;\n	line-height: 22px;\n	transition: background-color .2s ease,color .2s ease,border-color .2s ease;\n    -webkit-app-region: no-drag;\n	border-color: #fff;\n	background: transparent;\n}\n\n.ll-notice-button:hover {\n	color: var(--color, var(--background-mobile-primary));\n	background: #fff;\n}\n\n.ll-notice-close:hover {\n	opacity: 1;\n}\n");

class Notices {
    static __baseClass;
    static get baseClass() {
        return this.__baseClass || (this.__baseClass = Modules$1.findByProps("container", "base")?.base);
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
            className: ` ll-notice-${type}`
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

const splitRegex = /[^\S\r\n]*?\r?(?:\r\n|\n)[^\S\r\n]*?\*[^\S\r\n]?/, escapedAtRegex = /^\\@/;

function parseMetadata(fileContent) {
    if (!fileContent.startsWith("/**")) return;
    const block = fileContent.split("/**", 2)[1].split("*/", 1)[0], out = {};
    let field = "", accum = "";
    for (const line of block.split(splitRegex)) if (0 !== line.length) if ("@" === line.charAt(0) && " " !== line.charAt(1)) {
        out[field] = accum;
        const l = line.indexOf(" ");
        field = line.substr(1, l - 1), accum = line.substr(l + 1);
    } else accum += " " + line.replace("\\n", "\n").replace(escapedAtRegex, "@");
    return out[field] = accum.trim(), delete out[""], out.format = "jsdoc", out;
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
        if (!incomingMetadata) return !1;
        const targetPath = path.resolve(BdApi.Plugins.folder, incomingMetadata.pluginPath || `${pluginName}.plugin.js`);
        await fs.promises.writeFile(targetPath, fileContent, "utf-8");
        const currentPath = path.resolve(BdApi.Plugins.folder, currentMetadata.filename);
        return targetPath != currentPath && await fs.promises.unlink(currentPath), PendingUpdateStore.removePendingUpdate(pluginName), 
        !0;
    } catch (e) {
        return Logger$1.error("Updater", `Error while trying to update ${pluginName}`, e), 
        !1;
    }
}

BdApi.injectCSS("ll-update-notice", "");

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
            pluginsList.appendChild(document.createTextNode(" ")), pluginsList.appendChild(createHTMLElement("strong", {
                className: "ll-update-notice-plugin",
                onclick: () => {
                    applyUpdate(plugin);
                }
            }, plugin));
        }))) : isShown && currentCloseFunction();
    })(pendingUpdates.map((pendingUpdate => pendingUpdate.name)));
}));

class Updater {
    static async checkForUpdate(pluginName) {
        const currentMeta = BdApi.Plugins.get(pluginName), currentVersion = currentMeta?.version;
        if (currentVersion && currentMeta.updateUrl && valid(currentVersion)) {
            Logger$1.debug("Updater", `Checking ${pluginName} (@${currentVersion}) for updates.`);
            try {
                const remoteMeta = await this.fetchMetadata(currentMeta.updateUrl), remoteVersion = remoteMeta?.version;
                if (remoteVersion && valid(remoteVersion) && function semiver(a, b, bool) {
                    return a = a.split("."), b = b.split("."), fn(a[0], b[0]) || fn(a[1], b[1]) || (b[2] = b.slice(2).join("."), 
                    (bool = /[.-]/.test(a[2] = a.slice(2).join("."))) == /[.-]/.test(b[2]) ? fn(a[2], b[2]) : bool ? -1 : 1);
                }(remoteVersion, currentVersion) > 0) return PendingUpdateStore.addPendingUpdate(pluginName, currentMeta, remoteMeta), 
                !0;
            } catch (error) {
                Logger$1.error("Updater", `Failed to check for updates for ${pluginName} (@${currentVersion}).`, error);
            }
            return !1;
        }
    }
    static async fetchMetadata(url) {
        const response = await fetch(url);
        return parseMetadata(await response.text());
    }
}

var commonjsGlobal = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, cjs = {}, Events = {};

Object.defineProperty(Events, "__esModule", {
    value: !0
}), Events.default = Object.freeze({
    GET: "GET",
    SET: "SET",
    DELETE: "DELETE",
    UPDATE: "UPDATE"
});

var make$1 = {}, EventEmitter$1 = {}, __importDefault$1 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        default: mod
    };
};

Object.defineProperty(EventEmitter$1, "__esModule", {
    value: !0
});

const Events_1 = __importDefault$1(Events);

EventEmitter$1.default = class EventEmitter {
    constructor() {
        this.listeners = Object.values(Events_1.default).reduce(((acc, val) => (acc[val] = new Set, 
        acc)), {}), this.on = function(event, listener) {
            if (this.listeners[event].has(listener)) throw Error(`This listener on ${event} already exists.`);
            this.listeners[event].add(listener);
        }, this.once = function(event, listener) {
            const onceListener = (event, data) => {
                this.off(event, onceListener), listener(event, data);
            };
            this.on(event, onceListener);
        }, this.off = function(event, listener) {
            this.listeners[event].delete(listener);
        }, this.emit = function(event, data) {
            for (const listener of this.listeners[event]) listener(event, data);
        };
        for (const event of Object.values(Events_1.default)) this[event.toLowerCase()] = data => {
            this.emit(event, data);
        };
    }
};

var __importDefault = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        default: mod
    };
};

Object.defineProperty(make$1, "__esModule", {
    value: !0
});

const EventEmitter_1 = __importDefault(EventEmitter$1);

function DataStore(pluginName, key) {
    const pluginData = BdApi.getData(pluginName, key), nest = cjs.make(pluginData), saveFn = () => setTimeout((() => BdApi.saveData(pluginName, key, pluginData)), 0);
    return nest.on(cjs.Events.SET, saveFn), nest.on(cjs.Events.DELETE, saveFn), nest.on(cjs.Events.UPDATE, saveFn), 
    nest;
}

make$1.default = function make(data = {}, {nestArrays = !0} = {}) {
    const emitter = new EventEmitter_1.default;
    return Object.assign({
        store: function createProxy(target, root, path) {
            return new Proxy(target, {
                get(target, property) {
                    const newPath = [ ...path, property ], value = target[property];
                    return null != value ? (emitter.get({
                        path: newPath,
                        value
                    }), !nestArrays && Array.isArray(value) ? value : "object" == typeof value ? createProxy(value, root, newPath) : value) : createProxy(target[property] = {}, root, newPath);
                },
                set: (target, property, value) => (target[property] = value, emitter.set({
                    path: [ ...path, property ],
                    value
                }), !0),
                deleteProperty: (target, property) => delete target[property] && (emitter.delete({
                    path: [ ...path, property ]
                }), !0),
                has: (target, property) => ("object" != typeof target[property] || 0 !== Object.keys(target[property]).length) && property in target
            });
        }(data, data, []),
        ghost: data
    }, emitter);
}, function(exports) {
    var __importDefault = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : {
            default: mod
        };
    };
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.make = exports.Events = void 0;
    var Events_1 = Events;
    Object.defineProperty(exports, "Events", {
        enumerable: !0,
        get: function() {
            return __importDefault(Events_1).default;
        }
    });
    var make_1 = make$1;
    Object.defineProperty(exports, "make", {
        enumerable: !0,
        get: function() {
            return __importDefault(make_1).default;
        }
    });
}(cjs);

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
    static show(title, panel) {
        let child;
        if ("function" == typeof panel ? child = React.createElement(panel) : panel instanceof Node || "string" == typeof panel ? child = BdApi.React.createElement(ReactWrapper, {
            element: panel
        }) : React.isValidElement(panel) && (child = panel), !child) return void Logger$1.error("Modals.showModal", "Invalid panel type", panel);
        const modal = props => React.createElement(ModalRoot, Object.assign({
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
        }, BdApi.React.createElement(Button, {
            className: "bd-button",
            onClick: props.onClose
        }, Messages?.DONE || "Done")));
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
    static show(content, options) {
        BdApi.showToast(content, options);
    }
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
        return DataStore(this.pluginName, "data").store;
    }
    get Settings() {
        return DataStore(this.pluginName, "settings").store;
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
    constructor(pluginName) {
        this.pluginName = pluginName;
    }
}

function Plugin(pluginName) {
    return class extends class PluginBase {
        name;
        API;
        constructor(pluginName) {
            this.name = pluginName, this.API = new Api(pluginName);
        }
        load() {
            "function" == typeof this.firstLoad && setTimeout((() => this.checkForFirstLaunch()), 0), 
            "function" == typeof this.getChangelogPanel && setTimeout((() => this.checkForChangelog()), 0), 
            setTimeout((() => this.checkForUpdate), 0), this.initialize?.(this.API);
        }
        start() {
            "function" == typeof this.setup && this.setup(this.API), "function" == typeof this.patch && this.patch(this.API), 
            "function" == typeof this.style && this.style(this.API);
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
            this.unstyle?.(this.API), this.style?.(this.API);
        }
        async checkForFirstLaunch() {
            const Data = this.API.Data;
            "firstLoad" in Data && Data.firstLoad || (this.firstLoad(this.API), Data.firstLoad = !0);
        }
        async checkForChangelog() {
            const currentVersion = BdApi.Plugins.get(this.name)?.version;
            currentVersion && ("version" in this.API.Data && this.API.Data.version == currentVersion || (this.API.Modals.showPluginChangelog(this.name), 
            this.API.Data.version = currentVersion));
        }
        async checkForUpdate() {
            await Updater.checkForUpdate(this.name);
        }
    } {
        constructor() {
            super(pluginName);
        }
    };
}

__decorate([ Memoize() ], Api.prototype, "Modules", null), __decorate([ Memoize() ], Api.prototype, "Patcher", null), 
__decorate([ Memoize() ], Api.prototype, "Styler", null), __decorate([ Memoize() ], Api.prototype, "Dispatcher", null), 
__decorate([ Memoize() ], Api.prototype, "Data", null), __decorate([ Memoize() ], Api.prototype, "Settings", null), 
__decorate([ Memoize() ], Api.prototype, "Logger", null);

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

window.LiteLib = Core;

class index extends(Plugin("LiteLib")){
    updateAllInterval;
    initialize(API) {
        this.updateAllInterval = setInterval((() => this.checkAllForUpdates()), 18e5);
    }
    firstLoad({Logger}) {
        Logger.info("Detected first load.");
        const time = new Date;
        BdApi.Plugins.getAll().forEach((plugin => {
            plugin.litelib && plugin.instance != this && (Logger.info(`Reloading ${plugin.name}.`), 
            fs.promises.utimes(path.resolve(BdApi.Plugins.folder, plugin.filename), time, time).catch((() => {})));
        }));
    }
    async checkAllForUpdates() {
        BdApi.Plugins.getAll().forEach((plugin => {
            plugin.litelib && plugin.version && plugin.updateUrl && Updater.checkForUpdate(plugin.name);
        }));
    }
}

module.exports = index;

import Logger from "@common/Logger";

type NodeChild = Node | string | number;
type NodeChildren = (NodeChild | NodeChildren | null)[];

function applyChildren(node: HTMLElement, children: NodeChildren) {
    for (const child of children.filter(c=>c||c==0)) {
        if (Array.isArray(child)) applyChildren(node, child);
        else node.append(child as string|Node);
    }
}

export function createHTMLElement(
    tag: string,
    attrs?: null | {[key: string]: any},
    ...children: NodeChildren
): HTMLElement {
    const element = document.createElement(tag);
    if (attrs) Object.assign(element, attrs);
    applyChildren(element, children);
    return element;
};

export function suppressErrors(func: () => void, message?: string, async = false) {
    const ret = BdApi.suppressErrors(func);
    if (async && ret instanceof Promise) ret.catch((e) => {Logger.trace("SuppressedError", "Error occurred in " + message, e);});
}

const walkable = ["props", "state", "children", "sibling", "child"];
export function findInReactTree(root: any, predicate: (node: any) => boolean): any {
    if (predicate(root)) return root;
    if (Array.isArray(root)) {
        for (const child of root) {
            const found = findInReactTree(child, predicate);
            if (found) return found;
        }
    } else {
        const found = walkable.find((key)=>root[key] && findInReactTree(root[key], predicate))
        if (found) return found;
    }
    return null;
}

export function selectorFromClasses(...classes: string[]) {
    return classes.map(c => `.${c.split(" ").join(".")}`).join("");
}

export function useGeneric(on: (forceUpdate:()=>void)=>void, off: (forceUpdate:()=>void)=>void, ...dependencies: any[]): ()=>void {
    const [, forceUpdate] = BdApi.React.useReducer((i)=>i+1, 0)
    BdApi.React.useEffect(()=>{
        on(forceUpdate);
        return ()=>{off(forceUpdate)};
    }, dependencies);
    return forceUpdate;
}

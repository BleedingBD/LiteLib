import Logger from "../common/Logger";

type NodeChild = Node | string | number;
type NodeChildren = (NodeChild | NodeChildren | null)[];

function applyChildren(node: HTMLElement, children: NodeChildren) {
    for (const child of children.filter((c) => c || c == 0)) {
        if (Array.isArray(child)) applyChildren(node, child);
        else node.append(child as string | Node);
    }
}

/**
 * Creates a new HTML element in a similar way to React.createElement.
 * @param tag The tag name of the element to create
 * @param attrs The attributes to set on the element
 * @param children The children to append to the element
 * @returns A new HTML element with the given tag name and attributes
 */
export function createHTMLElement(
    tag: string,
    attrs?: null | { [key: string]: any },
    ...children: NodeChildren
): HTMLElement {
    const element = document.createElement(tag);
    if (attrs) Object.assign(element, attrs);
    applyChildren(element, children);
    return element;
}

/**
 * Wraps a function in a try/catch block, runs it and logs any errors to the console.
 * If async is true and the function returns a Promise, the error will be caught and logged.
 * @param func The function to run
 * @param name An optional name to log the error with
 * @param async If true, returned Promises will be caught and logged
 */
export function suppressErrors(
    func: () => any,
    name?: string,
    async = false
): any {
    try {
        const ret = func();
        if (async && ret instanceof Promise)
            return ret.catch((error) =>
                Logger.trace(
                    name || "SuppressedError",
                    "Suppressed an error that was wrapped using suppressErrors",
                    error
                )
            );
        return ret;
    } catch (error) {
        Logger.trace(
            name || "SuppressedError",
            "Suppressed an error that was wrapped using suppressErrors",
            error
        );
    }
}

const walkable = ["props", "state", "children", "sibling", "child"];
/**
 * Searches a React node for a child that matches the given predicate.
 * @param root The node to search in
 * @param predicate A function that returns true if the node is the one you want
 * @returns The node that matches the predicate, or undefined if none is found
 */
export function findInReactTree(
    root: any,
    predicate: (node: any) => boolean
): any {
    if (predicate(root)) return root;
    if (Array.isArray(root)) {
        for (const child of root) {
            const found = findInReactTree(child, predicate);
            if (found) return found;
        }
    } else {
        const found = walkable.find(
            (key) => root[key] && findInReactTree(root[key], predicate)
        );
        if (found) return found;
    }
    return null;
}
/**
 * Turns space-separated class names into a single css selector.
 * @param classes Strings of space-separated class names
 * @returns A css selector that matches all the given classes
 */
export function selectorFromClasses(...classes: string[]): string {
    return classes.map((c) => `.${c.split(" ").join(".")}`).join("");
}

/**
 * Generic hook that can be used to add a listener to a React node.
 * @param on The function to call when the listener is added, will receive a forceUpdate function as its first argument.
 * @param off The function to call when the listener is removed, will receive a forceUpdate function as its first argument.
 * @param dependencies An array of dependencies that will cause the listener to be re-added when they change.
 * @returns The forceUpdate function that causes a re-render of the component.
 */
export function useGeneric(
    on: (forceUpdate: () => void) => void,
    off: (forceUpdate: () => void) => void,
    ...dependencies: any[]
): () => void {
    const [, forceUpdate] = BdApi.React.useReducer((i) => i + 1, 0);
    BdApi.React.useEffect(() => {
        on(forceUpdate);
        return () => {
            off(forceUpdate);
        };
    }, dependencies);
    return forceUpdate;
}

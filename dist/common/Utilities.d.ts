declare type NodeChild = Node | string | number;
declare type NodeChildren = (NodeChild | NodeChildren | null)[];
/**
 * Creates a new HTML element in a similar way to React.createElement.
 * @param tag The tag name of the element to create
 * @param attrs The attributes to set on the element
 * @param children The children to append to the element
 * @returns A new HTML element with the given tag name and attributes
 */
export declare function createHTMLElement(tag: string, attrs?: null | {
    [key: string]: any;
}, ...children: NodeChildren): HTMLElement;
/**
 * Wraps a function in a try/catch block, runs it and logs any errors to the console.
 * If async is true and the function returns a Promise, the error will be caught and logged.
 * @param func The function to run
 * @param name An optional name to log the error with
 * @param async If true, returned Promises will be caught and logged
 */
export declare function suppressErrors(func: () => any, name?: string, async?: boolean): any;
/**
 * Searches a React node for a child that matches the given predicate.
 * @param root The node to search in
 * @param predicate A function that returns true if the node is the one you want
 * @returns The node that matches the predicate, or undefined if none is found
 */
export declare function findInReactTree(root: any, predicate: (node: any) => boolean): any;
/**
 * Turns space-separated class names into a single css selector.
 * @param classes Strings of space-separated class names
 * @returns A css selector that matches all the given classes
 */
export declare function selectorFromClasses(...classes: string[]): string;
/**
 * Generic hook that can be used to add a listener to a React node.
 * @param on The function to call when the listener is added, will receive a forceUpdate function as its first argument.
 * @param off The function to call when the listener is removed, will receive a forceUpdate function as its first argument.
 * @param dependencies An array of dependencies that will cause the listener to be re-added when they change.
 * @returns The forceUpdate function that causes a re-render of the component.
 */
export declare function useGeneric(on: (forceUpdate: () => void) => void, off: (forceUpdate: () => void) => void, ...dependencies: any[]): () => void;
export {};

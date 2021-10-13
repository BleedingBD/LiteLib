type NodeChild = Node | string | number;
type NodeChildren = (NodeChild | NodeChildren | null)[];

function applyChild(element: Node, child: NodeChild) {
    if (child instanceof Node) element.appendChild(child);
    else if (typeof child === "string" || typeof child === "number")
        element.appendChild(document.createTextNode(child.toString()));
    else console.warn("Unknown type to append: ", child);
}

function applyChildren(node: Node, children: NodeChildren) {
    for (const child of children) {
        if (!child && child !== 0) continue;

        if (Array.isArray(child)) applyChildren(node, child);
        else applyChild(node, child);
    }
}

export function createHTMLElement(
    tag: string,
    attrs: null | {[key: string]: any},
    ...children: NodeChildren
): HTMLElement {

    const element = document.createElement(tag);

    if (attrs) {
        for (const name of Object.keys(attrs)) {
            const value = attrs[name];
            if (name.startsWith("on")) {
                const finalName = name.replace(/Capture$/, "");
                const useCapture = name !== finalName;
                const eventName = finalName.toLowerCase().substring(2);
                element.addEventListener(eventName, value as EventListenerOrEventListenerObject, useCapture);
            } else if (value === true) element.setAttribute(name, name);
            else if (value || value === 0) element.setAttribute(name, value.toString());
        }
    }

    applyChildren(element, children);
    return element;
};

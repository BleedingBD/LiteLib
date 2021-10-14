type NodeChild = Node | string | number;
type NodeChildren = (NodeChild | NodeChildren | null)[];

function applyChild(element: Node, child: NodeChild) {
    if (child instanceof Node) element.appendChild(child);
    else element.appendChild(document.createTextNode(child.toString()));
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
    attrs?: null | {[key: string]: any},
    ...children: NodeChildren
): HTMLElement {
    const element = document.createElement(tag);
    if (attrs) Object.assign(element, attrs);
    applyChildren(element, children);
    return element;
};

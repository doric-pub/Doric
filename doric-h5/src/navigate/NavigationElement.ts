import { DoricElement } from "../DoricElement"

export class NavigationElement extends HTMLElement {

    elementStack: DoricElement[] = []

    get currentNode() {
        for (let i = 0; i < this.childNodes.length; i++) {
            if (this.childNodes[i] instanceof DoricElement) {
                return this.childNodes[i] as DoricElement
            }
        }
        return undefined
    }

    push(element: DoricElement) {
        const currentNode = this.currentNode
        if (currentNode) {
            this.elementStack.push(currentNode)
            this.replaceChild(element, currentNode)
        } else {
            this.appendChild(element)
        }
    }

    pop() {
        const lastElement = this.elementStack.pop()
        const currentNode = this.currentNode
        if (lastElement && currentNode) {
            this.replaceChild(lastElement, currentNode)
            currentNode.onDestroy()
        } else {
            window.history.back()
        }
    }
}
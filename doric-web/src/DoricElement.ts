import axios from 'axios'
import { DoricContext } from './DoricContext'


export class DoricElement extends HTMLElement {
    context?: DoricContext
    constructor() {
        super()
    }
    get src() {
        return this.getAttribute('src') as string
    }

    get alias() {
        return this.getAttribute('alias') as string
    }
    set src(v: string) {
        this.setAttribute('src', v)
    }
    set alias(v: string) {
        this.setAttribute('alias', v)
    }

    connectedCallback() {
        if (this.src && this.context === undefined) {
            if (this.src.startsWith("http")) {
                axios.get<string>(this.src).then(result => {
                    this.load(result.data)
                })
            } else {
                this.load(this.src)
            }
        }
    }

    disconnectedCallback() {
    }

    adoptedCallback() {

    }

    attributeChangedCallback() {

    }

    onDestroy() {
        this.context?.teardown()
    }

    load(content: string) {
        this.context = new DoricContext(content)
        const divElement = document.createElement('div')
        divElement.style.position = 'relative'
        divElement.style.height = '100%'
        this.append(divElement)
        this.context.rootNode.view = divElement
        this.context.init({
            width: divElement.offsetWidth,
            height: divElement.offsetHeight,
        })
    }
}
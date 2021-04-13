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

    get initData() {
        return this.getAttribute('data') as string
    }

    set initData(v: string) {
        this.setAttribute('data', v)
    }

    connectedCallback() {
        if (this.src && this.context === undefined) {
            axios.get(this.src).then(result => {
                this.load(result.data)
            })
        }
    }

    disconnectedCallback() {
    }

    adoptedCallback() {

    }

    attributeChangedCallback() {

    }

    onDestroy() {
        this.context?.onDestroy()
        this.context?.teardown()
    }

    load(content: string) {
        this.context = new DoricContext(content)
        this.context.init(this.initData)
        this.context.onCreate()
        const divElement = document.createElement('div')
        divElement.style.position = 'relative'
        divElement.style.height = '100%'
        this.append(divElement)
        this.context.rootNode.view = divElement
        this.context.build({
            width: divElement.offsetWidth,
            height: divElement.offsetHeight,
        })
        this.context.onShow()
    }
}
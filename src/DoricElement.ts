import axios from 'axios'
import { DoricContext } from './DoricContext'


export class DoricElement extends HTMLElement {
    source: string
    alias: string
    context?: DoricContext
    constructor() {
        super()
        this.source = this.getAttribute('src') || ""
        this.alias = this.getAttribute('alias') || this.source
        axios.get<string>(this.source).then(result => {
            this.load(result.data)
        })
    }

    load(content: string) {
        this.context = new DoricContext(content)
        this.context.getEntityMethod('log')()
    }
}
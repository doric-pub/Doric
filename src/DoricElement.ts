import axios from 'axios'
import { getContextId } from './DoricDriver'


export class DoricElement extends HTMLElement {
    source: string
    alias: string
    constructor() {
        super()
        this.source = this.getAttribute('src') || ""
        this.alias = this.getAttribute('alias') || this.source
        axios.get<string>(this.source).then(result => {
            this.load(result.data)
        })
    }

    load(content: string) {
        const script = document.createElement('script');
        const contextId = getContextId();
        script.text = `Reflect.apply(function(doric,context,Entry,require,exports){
                ${content}
            },doric.jsObtainContext("${contextId}"),[undefined,doric.jsObtainContext("${contextId}"),doric.jsObtainEntry("${contextId}"),doric.__require__,{}]);`
        this.append(script)
    }
}
import { DoricPlugin } from '../DoricPlugin'
import { DVModel, DoricViewNode } from '../shader/DoricViewNode';
import { DoricContext } from '../DoricContext';

export class PopoverPlugin extends DoricPlugin {
    static TYPE = "popover"

    fullScreen = document.createElement('div')
    constructor(context: DoricContext) {
        super(context)
        this.fullScreen.id = `PopOver__${context.contextId}`
        this.fullScreen.style.position = 'fixed'
        this.fullScreen.style.top = '0px'
        this.fullScreen.style.width = "100%"
        this.fullScreen.style.height = "100%"
    }

    show(model: DVModel) {
        const viewNode = DoricViewNode.create(this.context, model.type)
        if (viewNode === undefined) {
            return Promise.reject(`Cannot create ViewNode for ${model.type}`)
        }
        viewNode.viewId = model.id
        viewNode.init()
        viewNode.blend(model.props)
        this.fullScreen.appendChild(viewNode.view)

        let map = this.context.headNodes.get(PopoverPlugin.TYPE)
        if (map) {
            map.set(model.id, viewNode)
        } else {
            map = new Map
            map.set(model.id, viewNode)
            this.context.headNodes.set(PopoverPlugin.TYPE, map)
        }

        if (!document.body.contains(this.fullScreen)) {
            document.body.appendChild(this.fullScreen)
        }
        return Promise.resolve()
    }

    dismiss(args?: { id: string }) {
        if (args) {
            let map = this.context.headNodes.get(PopoverPlugin.TYPE)
            if (map) {
                const viewNode = map.get(args.id)
                if (viewNode) {
                    this.fullScreen.removeChild(viewNode.view)
                }

                if (map.size === 0) {
                    document.body.removeChild(this.fullScreen)
                }
            }
        } else {
            this.dismissAll()
        }
        return Promise.resolve()
    }
    dismissAll() {
        let map = this.context.headNodes.get(PopoverPlugin.TYPE)
        if (map) {
            for (let node of map.values()) {
                map.delete(node.viewId)
                this.fullScreen.removeChild(node.view)
            }
        }
        
        if (document.body.contains(this.fullScreen)) {
            document.body.removeChild(this.fullScreen)
        }
    }
    onTearDown() {
        super.onTearDown()
        this.dismissAll()
    }
}
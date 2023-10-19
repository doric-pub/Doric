import { DoricPlugin } from "../DoricPlugin";
import { DoricRootNode, DoricStackNode } from "../shader/DoricStackNode";
import { DoricSuperNode, DoricViewNode, DVModel } from "../shader/DoricViewNode";

export class ShaderPlugin extends DoricPlugin {
    render(ret: DVModel) {
        if (this.context.rootNode.viewId?.length > 0) {
            const viewNode = this.context.targetViewNode(ret.id)
            viewNode?.blend(ret.props)
            viewNode?.onBlended()
            viewNode?.requestLayout()
        } else {
            this.context.rootNode.viewId = ret.id
            this.context.rootNode.blend(ret.props)
            this.context.rootNode.onBlended()
            if (!(this.context.rootNode instanceof DoricRootNode)) {
                (this.context.rootNode as DoricStackNode).view.doricLayout.apply()
            }
            this.context.rootNode.requestLayout()
        }
    }

    command(options: {
        viewIds: string[],
        args: any,
        name: string
    }) {
        let viewNode: DoricViewNode | undefined = undefined
        for (let viewId of options.viewIds) {
            if (!viewNode) {
                viewNode = this.context.targetViewNode(viewId)
            } else {
                if (viewNode instanceof DoricSuperNode) {
                    viewNode = viewNode.getSubNodeById(viewId)
                }
            }
        }
        if (!viewNode) {
            return Promise.reject("Cannot find opposite view")
        } else {
            const target = viewNode
            return new Promise((resolve, reject) => {
                try {
                    const method = Reflect.get(target, options.name)
                    if (!method) {
                        reject(`"Cannot find plugin method in class:${target},method:${options.name}"`)
                    }
                    resolve(Reflect.apply(method, target, [options.args]))
                } catch (err) {
                    reject(err)
                }
            })
        }
    }
}
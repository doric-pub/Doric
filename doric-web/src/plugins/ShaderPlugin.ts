import { DoricPlugin } from "../DoricPlugin";
import { DVModel } from "../shader/DoricViewNode";

export class ShaderPlugin extends DoricPlugin {
    render(ret: DVModel) {
        if (this.context.rootNode.viewId?.length > 0) {
            if (this.context.rootNode.viewId === ret.id) {
                this.context.rootNode.blend(ret.props)
            } else {
                for (let map of this.context.headNodes.values()) {
                    const viewNode = map.get(ret.id)
                    if (viewNode) {
                        viewNode.blend(ret.props)
                    }
                }
            }
        } else {
            this.context.rootNode.viewId = ret.id
            this.context.rootNode.blend(ret.props)
        }
    }
}
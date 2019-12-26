import { DoricPlugin } from "../DoricPlugin";
import { DVModel } from "../shader/DoricViewNode";

export class ShaderPlugin extends DoricPlugin {
    render(ret: DVModel) {
        if (this.context.rootNode.viewId?.length > 0) {
            if (this.context.rootNode.viewId === ret.id) {
                this.context.rootNode.blend(ret.props)
            } else {
                const viewNode = this.context.headNodes.get(ret.id)
                if (viewNode) {
                    viewNode.blend(ret.props)
                }
            }
        } else {
            this.context.rootNode.viewId = ret.id
            this.context.rootNode.blend(ret.props)
        }
    }
}
import { DoricPlugin } from "../DoricPlugin";
import { DVModel } from "../shader/DoricViewNode";

export class ShaderPlugin extends DoricPlugin {
    render(ret: DVModel) {
        this.context.rootNode.viewId = ret.id
        this.context.rootNode.blend(ret.props)
    }
}
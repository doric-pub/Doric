import { Panel, View } from 'doric'
import { DoricViewNode } from '../lib/DoricViewNode'
import { GroupNode } from '../lib/GroupNode'
import { DoricPlugin } from '../lib/sandbox'

export class ShaderPlugin extends DoricPlugin {
  async render(props: any) {
    const rootView = (this.context.entity as Panel).getRootView()
    console.log("ShaderPlugin", rootView.isDirty())
    this.context.rootNode.render()
    this.context.popoverRootNode.render()
  }

  async command(props: any, promise: any) {
    const viewIds = props.viewIds as string[]
    const name = props.name as string
    const args = props.args

    let viewNode: DoricViewNode<View> = undefined

    viewIds.forEach((viewId) => {
      if (viewNode == null) {
        viewNode = this.context.targetViewNode(viewId);
      } else {
        if (viewNode instanceof GroupNode) {
          viewNode = viewNode.getSubNodeById(viewId);
        }
      }
    })

    return new Promise((resolve, reject) => {
      if (viewNode == null) {
        reject("Cannot find opposite view")
      } else {
        try {
          resolve(Reflect.apply(viewNode[name], viewNode, args ? [...args] : []))
        } catch (error) {
          reject(error)
        }
      }
    })

  }
}
import { Superview, View } from 'doric'
import { DoricPlugin } from '../lib/sandbox'

export class AnimatePlugin extends DoricPlugin {
  submit(props: any) {
    return Promise.resolve()
  }

  animateRender(props: any) {
    return new Promise((resolve, reject) => {
      const duration = props.duration

      this.context.setAnimatorSet({
        duration: duration,
        animatorSet: []
      })

      const viewId = props.id

      const viewNode = this.context.targetViewNode(viewId)
      if (viewNode != null) {
        this.context.rootNode.render()
      }

      this.context.setAnimatorSet(null)
    })
  }

  // unused
  private blendRecursive(props: any, view: View) {
    const keys = Object.keys(props)
    keys.forEach((key) => {
      if (key === "subviews") {
        const subviews = props[key]
        subviews.forEach((subview) => {
          console.log("blendRecursive", view.viewId, view.viewType())
          this.blendRecursive(subview.props, (view as Superview).subviewById(subview.id))
        })
      } else {
        console.log("blendRecursive", view.viewId, view.viewType(), key)
      }
    })
  }
}
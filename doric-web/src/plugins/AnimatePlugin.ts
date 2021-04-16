import { DoricPlugin } from "../DoricPlugin";

export class AnimatePlugin extends DoricPlugin {
    submit() {
        return Promise.resolve()
    }
    animateRender(args: {
        duration: number,
        id: string,
        props: any
    }) {
        this.context.animationSet = []
        if (this.context.rootNode.viewId?.length > 0) {
            const viewNode = this.context.targetViewNode(args.id)
            viewNode?.blend(args.props)
            viewNode?.onBlended()
        } else {
            this.context.rootNode.viewId = args.id
            this.context.rootNode.blend(args.props)
            this.context.rootNode.onBlended()
        }
        return new Promise(resolve => {
            Promise.resolve().then(() => {
                Promise.all(
                    this.context.animationSet?.map(e => {
                        return new Promise(resolve => {
                            const animation = e.viewNode.view.animate(
                                [e.keyFrame as Keyframe],
                                {
                                    duration: args.duration,
                                    fill: "forwards"
                                })
                            animation.onfinish = () => {
                                resolve(true)
                            }
                        })
                    }) || [])
                    .then(() => {
                        resolve(0)
                    })
                    .finally(() => {
                        this.context.animationSet = undefined
                    })
            })
        })
    }
}
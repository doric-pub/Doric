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
                            const keyFrame: Keyframe = {}
                            const ensureNonString = (key: string, value: any) => {
                                if (!!value && value !== "") {
                                    return value
                                }
                                switch ((key)) {
                                    case "backgroundColor":
                                        return "transparent"
                                    case "transform":
                                        return "none"
                                    default:
                                        return "none"
                                }
                            }
                            for (let k in e.keyFrame) {
                                keyFrame[k] = ensureNonString(k, e.viewNode.view.style[k])
                                e.keyFrame[k] = ensureNonString(k, e.keyFrame[k])
                            }
                            try {
                                const animation = e.viewNode.view.animate(
                                    [keyFrame, e.keyFrame as Keyframe],
                                    {
                                        duration: args.duration,
                                        fill: "forwards"
                                    })
                                animation.onfinish = () => {
                                    Object.entries(e.keyFrame).forEach(entry => {
                                        Reflect.set(e.viewNode.view.style, entry[0], entry[1])
                                    })
                                    resolve(true)
                                }
                            } catch (e) {
                                console.error(e)
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
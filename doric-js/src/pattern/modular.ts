import { Panel } from "../ui/panel"
import { Group } from "../ui/view"
import { ClassType } from "../util/types"

export abstract class ModularPanel extends Panel {
    private modules: Panel[]

    constructor() {
        super()
        this.modules = this.setupModules().map(e => new e)
    }

    abstract setupModules(): ClassType<Panel>[]
    abstract setupShelf(root: Group): Group

    build(root: Group) {
        root.children.length = 0
        const groupView = this.setupShelf(root)
        this.modules.forEach(e => {
            Reflect.set(e, "__root__", groupView)
            e.build(groupView)
        })
    }

    onCreate() {
        super.onCreate()
        this.modules.forEach(e => {
            e.onCreate()
        })
    }

    onDestroy() {
        super.onDestroy()
        this.modules.forEach(e => {
            e.onDestroy()
        })
    }

    onShow() {
        super.onShow()
        this.modules.forEach(e => {
            e.onShow()
        })
    }

    onHidden() {
        super.onHidden()
        this.modules.forEach(e => {
            e.onHidden()
        })
    }

    onRenderFinished() {
        super.onRenderFinished()
        this.modules.forEach(e => {
            e.onRenderFinished()
        })
    }
}
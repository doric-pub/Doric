import { Panel } from "../ui/panel"
import { Group } from "../ui/view"
import { ClassType } from "../util/types"
import { Provider } from "./provider"

export abstract class Module extends Panel {
    superPanel?: ModularPanel

    __provider?: Provider

    get provider(): Provider | undefined {
        return this.__provider || (this.superPanel?.provider)
    }

    set provider(provider: Provider | undefined) {
        this.__provider = provider
    }

    dispatchMessage(message: any) {
        this.superPanel?.dispatchMessage(message)
    }

    onMessage(message: any) { }
}

export abstract class ModularPanel extends Module {
    private modules: Panel[]

    constructor() {
        super()
        this.modules = this.setupModules().map(e => {
            const instance = new e
            if (instance instanceof Module) {
                instance.superPanel = this
            }
            return instance
        })
    }

    abstract setupModules(): ClassType<Panel>[]

    abstract setupShelf(root: Group): Group

    dispatchMessage(message: any) {
        if (this.superPanel) {
            this.superPanel.dispatchMessage(message)
        } else {
            this.onMessage(message)
        }
    }

    onMessage(message: any) {
        this.modules.forEach(e => {
            if (e instanceof Module) {
                e.onMessage(message)
            }
        })
    }


    build(root: Group) {
        const groupView = this.setupShelf(root)
        this.modules.forEach(e => {
            Reflect.set(e, "__root__", groupView)
            e.build(groupView)
        })
    }

    onCreate() {
        super.onCreate()
        this.modules.forEach(e => {
            e.context = this.context
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
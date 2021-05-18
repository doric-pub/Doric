import { Panel } from "../ui/panel"
import { Group } from "../ui/view"
import { ClassType } from "../util/types"
import { ViewHolder, ViewModel } from "./mvvm"
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

    private unmounted = false

    mount() {
        if (this.unmounted) {
            this.unmounted = false
            this.superPanel?.onStructureChanged(this, true)
            this.onMounted()
        }
    }

    unmount() {
        if (!this.unmounted) {
            this.unmounted = true
            this.superPanel?.onStructureChanged(this, false)
            this.onUnmounted()
        }
    }

    get mounted() {
        return !this.unmounted
    }

    /**
     * Dispatch message to other modules.
     * @param message which is sent out
     */
    dispatchMessage(message: any) {
        this.superPanel?.dispatchMessage(message)
    }

    /**
     * Dispatched messages can be received by override this method.
     * @param message recevied message
     */
    onMessage(message: any) { }

    /**
     * Called when this module is mounted
     */
    onMounted() { }

    /**
     * Called when this module is unmounted
     */
    onUnmounted() { }
}

export abstract class VMModule<M extends Object, V extends ViewHolder> extends Module {
    private vm?: ViewModel<M, V>
    private vh?: V
    abstract getViewModelClass(): ClassType<ViewModel<M, V>>

    abstract getState(): M

    abstract getViewHolderClass(): ClassType<V>

    getViewModel() {
        return this.vm
    }

    build(root: Group): void {
        this.vh = new (this.getViewHolderClass())
        this.vm = new (this.getViewModelClass())(this.getState(), this.vh)
        this.vm.context = this.context
        this.vm.attach(root)
    }
}

export abstract class ModularPanel extends Module {
    private modules: Panel[]
    private scheduledRebuild?: NodeJS.Timeout

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

    get mountedModules() {
        return this.modules.filter(e => !(e instanceof Module) || e.mounted)
    }

    onMessage(message: any) {
        this.mountedModules.forEach(e => {
            if (e instanceof Module) {
                e.onMessage(message)
            }
        })
    }

    onStructureChanged(module: Module, mounted: boolean) {
        if (this.superPanel) {
            this.superPanel.onStructureChanged(module, mounted)
        } else {
            if (!!!this.scheduledRebuild) {
                this.scheduledRebuild = setTimeout(() => {
                    this.scheduledRebuild = undefined
                    this.getRootView().children.length = 0
                    this.build(this.getRootView())
                }, 0)
            }
        }
    }

    build(root: Group) {
        const groupView = this.setupShelf(root)
        this.mountedModules.forEach(e => {
            Reflect.set(e, "__root__", groupView)
            e.build(groupView)
        })
    }

    onCreate() {
        super.onCreate()
        this.mountedModules.forEach(e => {
            e.context = this.context
            e.onCreate()
        })
    }

    onDestroy() {
        super.onDestroy()
        this.mountedModules.forEach(e => {
            e.onDestroy()
        })
    }

    onShow() {
        super.onShow()
        this.mountedModules.forEach(e => {
            e.onShow()
        })
    }

    onHidden() {
        super.onHidden()
        this.mountedModules.forEach(e => {
            e.onHidden()
        })
    }

    onRenderFinished() {
        super.onRenderFinished()
        this.mountedModules.forEach(e => {
            e.onRenderFinished()
        })
    }
}
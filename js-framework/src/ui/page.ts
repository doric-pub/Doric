import { View } from "./view";

export abstract class Page {
    onCreate(): void { }
    onDestory(): void { }
    onShow(): void { }
    onHidden(): void { }

    abstract build(): View


    /**
     * Native Call
     */
    private __onCreate__(): void {
        this.onCreate()
    }

    private __onDestory__(): void {
        this.onDestory()
    }

    private __onShow__(): void {
        this.onShow()
    }

    private __onHidden__(): void {
        this.onHidden()
    }

    private __build__(): View {
        return this.build()
    }
}
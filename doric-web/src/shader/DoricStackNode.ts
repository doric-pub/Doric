import { DoricGroupViewNode } from "./DoricViewNode";
import { DoricLayoutType, FrameSize } from "./DoricLayouts";

export class DoricStackNode extends DoricGroupViewNode {

    build() {
        const ret = document.createElement('div')
        ret.doricLayout.layoutType = DoricLayoutType.Stack
        return ret
    }
}

export class DoricRootNode extends DoricStackNode {
    mostFrameSize: FrameSize = {width:0,height:0}
    setupRootView(rootView: HTMLElement) {
        rootView.doricLayout.layoutType = DoricLayoutType.Stack
        this.view = rootView
    }

    requestLayout(): void {
        if (this.isSizeEqual({width:0,height:0})) {
            this.view.doricLayout.apply()
        } else {
            this.view.doricLayout.applyWithSize(this.mostFrameSize)
        }
        super.requestLayout()
    }

    isSizeEqual(frameSize: FrameSize) {
        return this.mostFrameSize.width === frameSize.width && this.mostFrameSize.height === frameSize.height
    }

}
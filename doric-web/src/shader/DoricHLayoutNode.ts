import { DoricGroupViewNode } from "./DoricViewNode";
import { LEFT, RIGHT, CENTER_X, CENTER_Y, TOP, BOTTOM, toPixelString } from "./DoricLayouts";
import { DoricLayoutType } from "./DoricLayouts";

export class DoricHLayoutNode extends DoricGroupViewNode {
    space = 0
    gravity = 0
    build() {
        const ret = document.createElement('div')
        ret.doricLayout.layoutType = DoricLayoutType.HLayout
        return ret
    }

    blendProps(v: HTMLElement, propName: string, prop: any) {
        if (propName === 'space') {
            this.view.doricLayout.spacing = prop
        } else if (propName === 'gravity') {
            this.view.doricLayout.gravity = prop
        } else {
            super.blendProps(v, propName, prop)
        }
    }

    layout() {
        super.layout()
        this.childNodes.forEach((e, idx) => {
            e.view.style.flexShrink = "0"
            if (e.layoutConfig?.weight) {
                e.view.doricLayout.weight = e.layoutConfig?.weight
            }

            e.view.doricLayout.marginLeft = e.layoutConfig?.margin?.left || 0
            const rightMargin = e.layoutConfig?.margin?.right || 0
            e.view.doricLayout.marginRight = (idx === this.childNodes.length - 1) ? rightMargin : this.space + rightMargin
            e.view.doricLayout.marginTop = e.layoutConfig?.margin?.top || 0
            e.view.doricLayout.marginBottom = e.layoutConfig?.margin?.bottom || 0
            e.view.doricLayout.alignment = e.layoutConfig?.alignment || 0
        })
    }
}
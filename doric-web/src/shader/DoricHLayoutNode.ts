import { DoricGroupViewNode } from "./DoricViewNode";
import { LEFT, RIGHT, CENTER_X, CENTER_Y, TOP, BOTTOM, toPixelString } from "./DoricLayouts";
import { DoricLayoutType } from "./DoricLayouts";

export class DoricHLayoutNode extends DoricGroupViewNode {
    space = 0
    gravity = 0
    build() {
        const ret = document.createElement('div')
        // ret.style.display = "flex"
        // ret.style.flexDirection = "row"
        // ret.style.flexWrap = "nowrap"
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

    // layout() {
    //     super.layout()
    //     this.childNodes.forEach((e, idx) => {
    //         e.view.style.flexShrink = "0"
    //         if (e.layoutConfig?.weight) {
    //             e.view.style.flex = `${e.layoutConfig?.weight}`
    //         }
    //         e.view.style.marginLeft = toPixelString(e.layoutConfig?.margin?.left || 0)
    //         const rightMargin = e.layoutConfig?.margin?.right || 0
    //         e.view.style.marginRight = toPixelString(
    //             (idx === this.childNodes.length - 1) ? rightMargin : this.space + rightMargin)
    //         e.view.style.marginTop = toPixelString(e.layoutConfig?.margin?.top || 0)
    //         e.view.style.marginBottom = toPixelString(e.layoutConfig?.margin?.bottom || 0)
    //         if ((e.layoutConfig.alignment & TOP) === TOP) {
    //             e.view.style.alignSelf = "flex-start"
    //         } else if ((e.layoutConfig.alignment & BOTTOM) === BOTTOM) {
    //             e.view.style.alignSelf = "flex-end"
    //         } else if ((e.layoutConfig.alignment & CENTER_Y) === CENTER_Y) {
    //             e.view.style.alignSelf = "center"
    //         }
    //     })
    // }
}
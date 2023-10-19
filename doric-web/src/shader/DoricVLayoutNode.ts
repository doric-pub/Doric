import { DoricGroupViewNode } from "./DoricViewNode";
import {  DoricLayoutType } from "./DoricLayouts";

export class DoricVLayoutNode extends DoricGroupViewNode {
    space = 0
    gravity = 0

    build() {
        const ret = document.createElement('div')
        // ret.style.display = "flex"
        // ret.style.flexDirection = "column"
        // ret.style.flexWrap = "nowrap"
        ret.doricLayout.layoutType = DoricLayoutType.VLayout
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
    //         e.view.style.marginTop = toPixelString(e.layoutConfig?.margin?.top || 0)
    //         const bottomMargin = e.layoutConfig?.margin?.bottom || 0
    //         e.view.style.marginBottom = toPixelString(
    //             (idx === this.childNodes.length - 1) ? bottomMargin: this.space + bottomMargin)
    //         e.view.style.marginLeft = toPixelString(e.layoutConfig?.margin?.left || 0)
    //         e.view.style.marginRight = toPixelString(e.layoutConfig?.margin?.right || 0)
    //         if ((e.layoutConfig.alignment & LEFT) === LEFT) {
    //             e.view.style.alignSelf = "flex-start"
    //         } else if ((e.layoutConfig.alignment & RIGHT) === RIGHT) {
    //             e.view.style.alignSelf = "flex-end"
    //         } else if ((e.layoutConfig.alignment & CENTER_X) === CENTER_X) {
    //             e.view.style.alignSelf = "center"
    //         }
    //     })
    // }
}
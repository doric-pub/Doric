import { DoricGroupViewNode } from "./DoricViewNode";
import {  DoricLayoutType } from "./DoricLayouts";
import { CENTER_X, LEFT, RIGHT } from "doric";

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

    layout() {
        super.layout()
        this.childNodes.forEach((e, idx) => {
            e.view.style.flexShrink = "0"
            if (e.layoutConfig?.weight) {
                e.view.doricLayout.weight = e.layoutConfig?.weight
            }
            e.view.doricLayout.marginTop = e.layoutConfig?.margin?.top || 0
            const bottomMargin = e.layoutConfig?.margin?.bottom || 0
            e.view.doricLayout.marginBottom = (idx === this.childNodes.length - 1) ? bottomMargin : this.space + bottomMargin
            e.view.doricLayout.marginLeft = e.layoutConfig?.margin?.left || 0
            e.view.doricLayout.marginRight = e.layoutConfig?.margin?.right || 0
            e.view.doricLayout.alignment = e.layoutConfig?.alignment || 0    
        })
    }
}
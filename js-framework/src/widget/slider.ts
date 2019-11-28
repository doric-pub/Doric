import { Superview, View, Property, IView } from "./view";
import { Stack } from "./layouts";
import { layoutConfig } from "../util/layoutconfig";

export class SlideItem extends Stack {
    /**
     * Set to reuse native view
     */
    @Property
    identifier?: string
}

export interface ISlider extends IView {
    renderPage: (index: number) => SlideItem
    itemCount: number
    batchCount?: number
}

export class Slider extends Superview implements ISlider {
    private cachedViews: Map<string, SlideItem> = new Map

    private ignoreDirtyCallOnce = false

    allSubviews() {
        return this.cachedViews.values()
    }
    @Property
    itemCount = 0

    @Property
    renderPage!: (index: number) => SlideItem

    @Property
    batchCount = 3


    private getItem(itemIdx: number) {
        let view = this.cachedViews.get(`${itemIdx}`)
        if (view === undefined) {
            view = this.renderPage(itemIdx)
            view.superview = this
            this.cachedViews.set(`${itemIdx}`, view)
        }
        return view
    }

    isDirty() {
        if (this.ignoreDirtyCallOnce) {
            this.ignoreDirtyCallOnce = false
            //Ignore the dirty call once.
            return false
        }
        return super.isDirty()
    }

    private renderBunchedItems(start: number, length: number) {
        this.ignoreDirtyCallOnce = true;
        return new Array(Math.min(length, this.itemCount - start)).fill(0).map((_, idx) => {
            const slideItem = this.getItem(start + idx)
            return slideItem.toModel()
        })
    }
}

export function slideItem(item: View) {
    return (new SlideItem).also((it) => {
        it.layoutConfig = layoutConfig().wrap()
        it.addChild(item)
    })
}

export function slider(config: ISlider) {
    const ret = new Slider
    for (let key in config) {
        Reflect.set(ret, key, Reflect.get(config, key, config), ret)
    }
    return ret
}
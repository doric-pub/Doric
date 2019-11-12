import { Text, Image, LayoutConfig, View, IText, IImage } from './view'
import { Stack, HLayout, VLayout } from './layout'

export function text(config: IText) {
    const ret = new Text
    for (let key in config) {
        Reflect.set(ret, key, Reflect.get(config, key, config), ret)
    }
    return ret
}

export function image(config: IImage) {
    const ret = new Image
    for (let key in config) {
        Reflect.set(ret, key, Reflect.get(config, key, config), ret)
    }
    return ret
}

export function stack(views: View[]) {
    const ret = new Stack
    for (let v of views) {
        ret.addChild(v)
    }
    return ret
}

export function hlayout(views: View[]) {
    const ret = new HLayout
    for (let v of views) {
        ret.addChild(v)
    }
    return ret
}

export function vlayout(views: View[]) {
    const ret = new VLayout
    for (let v of views) {
        ret.addChild(v)
    }
    return ret
}
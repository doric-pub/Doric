import { Text, Image, HLayout, VLayout, Stack, LayoutConfig, View } from './view'
import { Color, GradientColor } from '../util/color'
import { Gravity } from '../util/gravity'

export interface IView {
    width?: number
    height?: number
    bgColor?: Color | GradientColor
    corners?: number | { leftTop?: number; rightTop?: number; leftBottom?: number; rightBottom?: number }
    border?: { width: number; color: Color; }
    shadow?: { color: Color; opacity: number; radius: number; offsetX: number; offsetY: number }
    alpha?: number
    hidden?: boolean
    padding?: {
        left?: number,
        right?: number,
        top?: number,
        bottom?: number,
    }
    layoutConfig?: LayoutConfig
    onClick?: Function
    identifier?: string
}
export interface IText extends IView {
    text?: string
    textColor?: Color
    textSize?: number
    maxLines?: number
    textAlignment?: Gravity
}

export interface IImage extends IView {
    imageUrl?: string
}

export interface IStack extends IView {
    gravity?: Gravity
}

export interface IVLayout extends IView {
    space?: number
    gravity?: Gravity
}

export interface IHLayout extends IView {
    space?: number
    gravity?: Gravity
}
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
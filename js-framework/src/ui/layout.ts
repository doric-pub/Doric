import { LayoutConfig, Group, Property, IView } from "./view";
import { Gravity } from "../util/gravity";

export interface StackConfig extends LayoutConfig {

}

export interface LinearConfig extends LayoutConfig {
    weight?: number
}

export interface IStack extends IView {
    gravity?: Gravity
}

export class Stack extends Group implements IStack {
    @Property
    gravity?: Gravity
}



export class Root extends Stack {

}
class LinearLayout extends Group {
    @Property
    space?: number

    @Property
    gravity?: Gravity
}

export interface IVLayout extends IView {
    space?: number
    gravity?: Gravity
}

export class VLayout extends LinearLayout implements VLayout {
}


export interface IHLayout extends IView {
    space?: number
    gravity?: Gravity
}

export class HLayout extends LinearLayout implements IHLayout {
}

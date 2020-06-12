const SPECIFIED = 1;
const START = 1 << 1;
const END = 1 << 2;
const SHIFT_X = 0;
const SHIFT_Y = 4;
export const LEFT = (START | SPECIFIED) << SHIFT_X;
export const RIGHT = (END | SPECIFIED) << SHIFT_X;
export const TOP = (START | SPECIFIED) << SHIFT_Y;
export const BOTTOM = (END | SPECIFIED) << SHIFT_Y;
export const CENTER_X = SPECIFIED << SHIFT_X;
export const CENTER_Y = SPECIFIED << SHIFT_Y;
export const CENTER = CENTER_X | CENTER_Y;
export class Gravity {
    constructor() {
        this.val = 0;
    }
    left() {
        const val = this.val | LEFT;
        const ret = new Gravity;
        ret.val = val;
        return ret;
    }
    right() {
        const val = this.val | RIGHT;
        const ret = new Gravity;
        ret.val = val;
        return ret;
    }
    top() {
        const val = this.val | TOP;
        const ret = new Gravity;
        ret.val = val;
        return ret;
    }
    bottom() {
        const val = this.val | BOTTOM;
        const ret = new Gravity;
        ret.val = val;
        return ret;
    }
    center() {
        const val = this.val | CENTER;
        const ret = new Gravity;
        ret.val = val;
        return ret;
    }
    centerX() {
        const val = this.val | CENTER_X;
        const ret = new Gravity;
        ret.val = val;
        return ret;
    }
    centerY() {
        const val = this.val | CENTER_Y;
        const ret = new Gravity;
        ret.val = val;
        return ret;
    }
    toModel() {
        return this.val;
    }
}
Gravity.origin = new Gravity;
Gravity.Center = Gravity.origin.center();
Gravity.CenterX = Gravity.origin.centerX();
Gravity.CenterY = Gravity.origin.centerY();
Gravity.Left = Gravity.origin.left();
Gravity.Right = Gravity.origin.right();
Gravity.Top = Gravity.origin.top();
Gravity.Bottom = Gravity.origin.bottom();
export function gravity() {
    return new Gravity;
}

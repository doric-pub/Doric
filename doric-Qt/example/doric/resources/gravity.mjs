// gravity.mjs
export function enumerate() {
    const SPECIFIED = 1;
    const START = 1 << 1;
    const END = 1 << 2;
    const SHIFT_X = 0;
    const SHIFT_Y = 4;
    const LEFT = (START | SPECIFIED) << SHIFT_X;
    const RIGHT = (END | SPECIFIED) << SHIFT_X;
    const TOP = (START | SPECIFIED) << SHIFT_Y;
    const BOTTOM = (END | SPECIFIED) << SHIFT_Y;
    const CENTER_X = SPECIFIED << SHIFT_X;
    const CENTER_Y = SPECIFIED << SHIFT_Y;
    const CENTER = CENTER_X | CENTER_Y;

    var gravity = {
        SPECIFIED,
        START,
        END,
        SHIFT_X,
        SHIFT_Y,
        LEFT,
        RIGHT,
        TOP,
        BOTTOM,
        CENTER_X,
        CENTER_Y,
        CENTER
    }

    return gravity
}

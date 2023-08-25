
export interface GradientColor {
    start?: number;
    end?: number;
    colors?: number[];
    locations?: number[];
    orientation?: number;
  }
  
export enum GradientOrientation {
    /** draw the gradient from the top to the bottom */
    TOP_BOTTOM = 0,
    /** draw the gradient from the top-right to the bottom-left */
    TR_BL,
    /** draw the gradient from the right to the left */
    RIGHT_LEFT,
    /** draw the gradient from the bottom-right to the top-left */
    BR_TL,
    /** draw the gradient from the bottom to the top */
    BOTTOM_TOP,
    /** draw the gradient from the bottom-left to the top-right */
    BL_TR,
    /** draw the gradient from the left to the right */
    LEFT_RIGHT,
    /** draw the gradient from the top-left to the bottom-right */
    TL_BR,
}

export function toRGBAString(color: number) {
    let strs = []
    for (let i = 0; i < 32; i += 8) {
        strs.push(((color >> i) & 0xff))
    }
    strs = strs.reverse()
    /// RGBAd
    return `rgba(${strs[1]},${strs[2]},${strs[3]},${strs[0] / 255})`
}

export function generateGradientColorDesc(colors: string[], locations?:number[]) {
    if (!locations) {
        return colors.join(', ')
    }

    if (colors.length !== locations.length) {
      throw new Error("Colors and locations arrays must have the same length.");
    }
  
    const gradientStops = colors.map((color, index) => `${color} ${locations[index] * 100}%`);
    return gradientStops.join(", ");
}

export function generateGradientOrientationDesc(orientation: GradientOrientation) {
    switch (orientation) {
        case GradientOrientation.TR_BL :
            return 'to bottom left'
        case GradientOrientation.RIGHT_LEFT:
            return 'to left'
        case GradientOrientation.BR_TL:
            return 'to top left'
        case GradientOrientation.BOTTOM_TOP:
            return 'to top'
        case GradientOrientation.BL_TR:
            return 'to top right'
        case GradientOrientation.LEFT_RIGHT:
            return 'to right'
        case GradientOrientation.TL_BR:
            return 'to bottom right'
        default:
            return 'to bottom'
    }
}
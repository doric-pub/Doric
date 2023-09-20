
Object.defineProperty(HTMLElement.prototype, "doricLayout", {
    get() {
        let layout = this.getAttribute("__doric_layout__");
        if (!layout) {
            layout = new DoricLayout();
            layout.width = this.style.width
            layout.height = this.style.height
            layout.view = this
            this.setAttribute("__doric_layout__", JSON.stringify(layout))
        }
        return this._doricLayout;
    },

    set(layout: DoricLayout) {
        this.setAttribute("__doric_layout__", JSON.stringify(layout))   
    },
    enumerable: false,
    configurable: true
})

export enum LayoutSpec {
    EXACTLY = 0,
    WRAP_CONTENT = 1,
    AT_MOST = 2,
}

const SPECIFIED = 1
const START = 1 << 1
const END = 1 << 2

const SHIFT_X = 0
const SHIFT_Y = 4

export const LEFT = (START | SPECIFIED) << SHIFT_X
export const RIGHT = (END | SPECIFIED) << SHIFT_X

export const TOP = (START | SPECIFIED) << SHIFT_Y
export const BOTTOM = (END | SPECIFIED) << SHIFT_Y

export const CENTER_X = SPECIFIED << SHIFT_X
export const CENTER_Y = SPECIFIED << SHIFT_Y

export const CENTER = CENTER_X | CENTER_Y

export type FrameSize = {
    width: number,
    height: number,
}
export function toPixelString(v: number) {
    return `${v}px`
}

export function pixelString2Number(v: string) {
    return parseFloat(v.substring(0, v.indexOf("px")))
}

enum DoricMeasureSpecMode {
    Unspecified = 0,
    Exactly = 1,
    AtMost = 2,
}

interface DoricMeasureSpec {
    mode: DoricMeasureSpecMode;
    size: number;
}

interface DoricSizeAndState { 
    size: number;
    state: number;
}

enum DoricLayoutType {
    Undefined = 0,
    Stack = 1,
    VLayout = 2,
    HLayout = 3,
}

export class DoricLayout {
    widthSpec: LayoutSpec = LayoutSpec.EXACTLY;
    heightSpec: LayoutSpec = LayoutSpec.EXACTLY;
    alignment = LEFT | TOP;
    gravity = LEFT | TOP;
    width: number = 0;
    height: number = 0;
    spacing: number = 0;

    marginLeft: number = 0;
    marginTop: number = 0;
    marginRight: number = 0;
    marginBottom: number = 0;

    paddingLeft: number = 0;
    paddingTop: number = 0;
    paddingRight: number = 0;
    paddingBottom: number = 0;

    weight: number = 0;
    view!: HTMLElement;

    layoutType: DoricLayoutType = DoricLayoutType.Undefined;
    disabled: boolean = false;

    maxWidth: number = Number.MAX_VALUE;
    maxHeight: number = Number.MAX_VALUE;
    minWidth: number = -1;
    minheight: number = -1;

    resolved: boolean = false;

    _measuredWidth: number = 0;
    _measuredHeight: number = 0;
    measuredX: number = 0;
    measuredY: number = 0;

    undefined: boolean = false;
    corners: number[] = [];
    totalLength: number = 0;

    measuredState: number = 0;

    set measuredWidth(measuredWidth: number) {
        this._measuredWidth = Math.max(0, measuredWidth);
    }

    get measuredWidth() {
        return this._measuredWidth;
    }

    set measuredHeight(measuredHeight: number) {
        this._measuredHeight = Math.max(0, measuredHeight);
    }

    get measuredHeight() {
        return this._measuredHeight;
    }
    
    applyWithSize(frameSize: FrameSize) {
        this.resolved = false
        this.measure(frameSize)
        this.setFrame()
        this.resolved = true
    }

    apply() {
        this.applyWithSize({width:pixelString2Number(this.view.style.width), 
                            height:pixelString2Number(this.view.style.height)})
    }

    measure(targetSize:FrameSize) {
        this.doMeasure(targetSize)
        this.layout()
    }
    
    getRootMeasureSpec(targetSize:number, spec:LayoutSpec, size:number) {
        switch (spec) {
            case LayoutSpec.AT_MOST:
                return this.doricMeasureSpecMake(DoricMeasureSpecMode.Exactly, targetSize)
            case LayoutSpec.WRAP_CONTENT:
                return this.doricMeasureSpecMake(DoricMeasureSpecMode.AtMost, targetSize)
            default:
                return this.doricMeasureSpecMake(DoricMeasureSpecMode.Exactly, size)
        }
    }

    doMeasure(targetSize:FrameSize) {
        const widthSpec:DoricMeasureSpec = this.getRootMeasureSpec(targetSize.width, this.widthSpec, this.width)
        const HeightSpec:DoricMeasureSpec = this.getRootMeasureSpec(targetSize.height, this.heightSpec, this.height)
        this.measureSelf(widthSpec, HeightSpec)
    }

    takenWidth() {
        return this.measuredWidth + this.marginLeft + this.marginRight
    }

    takenHeight() {
        return this.measuredHeight + this.marginTop + this.marginBottom
    }

    measureSelf(widthSpec:DoricMeasureSpec, heightSpec:DoricMeasureSpec) {
        switch(this.layoutType) {
            case DoricLayoutType.Stack:
                this.stackMeasure(widthSpec, heightSpec)
                break
            case DoricLayoutType.VLayout: 
                this.verticalMeasure(widthSpec, heightSpec)
                break
            case DoricLayoutType.HLayout:
                this.horizontalMeasure(widthSpec, heightSpec)
                break
            default:
                this.undefinedMeasure(widthSpec, heightSpec)
                break   
        }
        if (this.measuredWidth > this.maxWidth || this.measuredHeight > this.maxHeight) {
            const widthSpec = this.doricMeasureSpecMake(DoricMeasureSpecMode.AtMost, Math.min(this.measuredWidth, this.maxWidth))
            const heightSpec = this.doricMeasureSpecMake(DoricMeasureSpecMode.AtMost, Math.min(this.measuredHeight, this.maxHeight))
            this.measureSelf(widthSpec, heightSpec)
        }
    }

    stackMeasure(widthMeasureSpec: DoricMeasureSpec, heightMeasureSpec: DoricMeasureSpec) {

    }

    verticalMeasure(widthMeasureSpec: DoricMeasureSpec, heightMeasureSpec: DoricMeasureSpec) {

    }

    horizontalMeasure(widthMeasureSpec: DoricMeasureSpec, heightMeasureSpec: DoricMeasureSpec) {

    }

    undefinedMeasure(widthMeasureSpec: DoricMeasureSpec, heightMeasureSpec: DoricMeasureSpec) {

    }

    getChildMeasureSpec(spec:DoricMeasureSpec, padding:number, childLayoutSpec: LayoutSpec, childSize:number) {

    }
    
    measureChild(child:DoricLayout, widthSpec:DoricMeasureSpec, usedWidth:number, heightSpec:DoricMeasureSpec, usedHeight:number) {

    }

    resolveSizeAndState(size:number, spec:DoricMeasureSpec, childMeasuredState:number) {

    }

    layout() {
        switch (this.layoutType) {
            case DoricLayoutType.Stack:
                this.layoutStack()
                break
            case DoricLayoutType.HLayout:
                this.layoutHLayout()
                break
            case DoricLayoutType.VLayout:
                this.layoutVLayout()
                break
            default:
                break
        }       
    }

    setFrame() {

    }

    layoutStack() {

    }

    layoutHLayout() {

    }

    layoutVLayout() {

    }

    doricMeasureSpecMake(mode:DoricMeasureSpecMode, size:number) {
        const measureSpec: DoricMeasureSpec = {
            mode: mode,
            size: size,
        }
        return measureSpec
    }
}

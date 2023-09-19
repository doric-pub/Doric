import { LayoutSpec, FrameSize, pixelString2Number } from "./DoricViewNode";

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
    DoricUndefined = 0,
    DoricStack = 1,
    DoricVLayout = 2,
    DoricHLayout = 3,
}

export enum DoricGravity {
    Specified = 1,
    Start = 1 << 1,
    End = 1 << 2,
    Shift_X = 0,
    Shift_Y = 4,
    Left = (Start | Specified) << Shift_X,
    Right = (End | Specified) << Shift_X,
    Top = (Start | Specified) << Shift_Y,
    Bottom = (End | Specified) << Shift_Y,
    Center_X = Specified << Shift_X,
    Center_Y = Specified << Shift_Y,
    Center = Center_X | Center_Y,
}

export class DoricLayout {
    widthSpec: LayoutSpec = LayoutSpec.EXACTLY;
    heightSpec: LayoutSpec = LayoutSpec.EXACTLY;
    alignment: DoricGravity = DoricGravity.Left | DoricGravity.Top;
    gravity: DoricGravity = DoricGravity.Left | DoricGravity.Top;
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
    view: HTMLElement | undefined;

    layoutType: DoricLayoutType = DoricLayoutType.DoricUndefined;
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

    set measuredHeight(measuredHeight: number) {
        this._measuredHeight = Math.max(0, measuredHeight);
    }

    applyWithSize(frameSize: FrameSize) {
        this.resolved = false
        this.measure(frameSize)
        this.setFrame()
        this.resolved = true
    }

    apply() {
        if (this.view) {
            this.applyWithSize({width:pixelString2Number(this.view.style.width), 
                                height:pixelString2Number(this.view.style.height)})
        }
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
            case DoricLayoutType.DoricStack:
                this.stackMeasure(widthSpec, heightSpec)
                break
            case DoricLayoutType.DoricVLayout: 
                this.verticalMeasure(widthSpec, heightSpec)
                break
            case DoricLayoutType.DoricHLayout:
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
            case DoricLayoutType.DoricStack:
                this.layoutStack()
                break
            case DoricLayoutType.DoricHLayout:
                this.layoutHLayout()
                break
            case DoricLayoutType.DoricVLayout:
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
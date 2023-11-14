interface HTMLElement {
    _doricLayout: DoricLayout
    doricLayout: DoricLayout;
    
    _viewNode: DoricViewNode
    viewNode: DoricViewNode;
}

declare enum LayoutSpec {
    EXACTLY = 0,
    WRAP_CONTENT = 1,
    AT_MOST = 2
}
type FrameSize = {
    width: number;
    height: number;
};
declare enum DoricLayoutType {
    Undefined = 0,
    Stack = 1,
    VLayout = 2,
    HLayout = 3
}

interface DoricMeasureSpec {
    mode: DoricMeasureSpecMode;
    size: number;
}

declare enum DoricMeasureSpecMode {
    Unspecified = 0,
    Exactly = 1,
    AtMost = 2
}

interface DoricSizeAndState { 
    size: number;
    state: number;
}

declare class DoricViewNode {
    measureSize: () => FrameSize;
}
declare class DoricLayout {
    widthSpec: LayoutSpec;
    heightSpec: LayoutSpec;
    alignment: number;
    gravity: number;
    width: number;
    height: number;
    spacing: number;
    marginLeft: number;
    marginTop: number;
    marginRight: number;
    marginBottom: number;
    paddingLeft: number;
    paddingTop: number;
    paddingRight: number;
    paddingBottom: number;
    weight: number;
    view: HTMLElement;
    layoutType: DoricLayoutType;
    disabled: boolean;
    _maxWidth: number;
    _maxHeight: number
    _minWidth: number;
    _minHeight: number;
    resolved: boolean;
    _measuredWidth: number;
    _measuredHeight: number;
    measuredX: number;
    measuredY: number;
    undefined: boolean;
    corners: number[];
    totalLength: number;
    measuredState: number;
    set maxHeight(maxheight: number);
    get maxHeight(): number;
    set maxWidth(maxwidth: number);
    get maxwidth(): number;
    set minWidth(minWidth: number);
    get minWidth(): number;
    set minHeight(minHeight: number);
    get minHeight(): number;
    set measuredWidth(measuredWidth: number);
    get measuredWidth(): number;
    set measuredHeight(measuredHeight: number);
    get measuredHeight(): number;
    applyWithSize(frameSize: FrameSize): void;
    apply(): void;
    measure(targetSize: FrameSize): void;
    getRootMeasureSpec(targetSize:number, spec:LayoutSpec, size:number):DoricMeasureSpec;
    doMeasure(targetSize: FrameSize): void;
    measureSelf(widthSpec:DoricMeasureSpec, heightSpec:DoricMeasureSpec): void;
    layout(): void;
    takenWidth(): number;
    takenHeight(): number;
    stackMeasure(widthMeasureSpec: DoricMeasureSpec, heightMeasureSpec: DoricMeasureSpec): void;
    verticalMeasure(widthMeasureSpec: DoricMeasureSpec, heightMeasureSpec: DoricMeasureSpec): void;
    horizontalMeasure(widthMeasureSpec: DoricMeasureSpec, heightMeasureSpec: DoricMeasureSpec): void;
    undefinedMeasure(widthMeasureSpec: DoricMeasureSpec, heightMeasureSpec: DoricMeasureSpec): void;
    getChildMeasureSpec(spec:DoricMeasureSpec, padding:number, childLayoutSpec: LayoutSpec, childSize:number): DoricMeasureSpec;
    measureChild(child:DoricLayout, widthSpec:DoricMeasureSpec, usedWidth:number, heightSpec:DoricMeasureSpec, usedHeight:number): void;
    resolveSizeAndState(size:number, spec:DoricMeasureSpec, childMeasuredState:number):DoricSizeAndState;
    setFrame():void;
    layoutStack(): void;
    layoutHLayout(): void;
    layoutVLayout(): void;
    doricMeasureSpecMake(mode:DoricMeasureSpecMode, size:number):DoricMeasureSpec;
    forceUniformWidth(heightMeasureSpec:DoricMeasureSpec):DoricMeasureSpec;
}

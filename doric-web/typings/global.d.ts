interface HTMLElement {
    doricLayout: any;
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
    maxWidth: number;
    maxHeight: number;
    minWidth: number;
    minheight: number;
    resolved: boolean;
    measuredX: number;
    measuredY: number;
    undefined: boolean;
    corners: number[];
    totalLength: number;
    measuredState: number;
    set measuredWidth(measuredWidth: number);
    get measuredWidth(): number;
    set measuredHeight(measuredHeight: number);
    get measuredHeight(): number;
    applyWithSize(frameSize: FrameSize): void;
    apply(): void;
    measure(targetSize: FrameSize): void;
}

Object.defineProperty(HTMLElement.prototype, "doricLayout", {
    get() {
        // const archivedLayout: string = this.getAttribute("__doric_layout__");
        // const layout = new DoricLayout();
        // if (archivedLayout) {
        //     const archivedLayoutObj = JSON.parse(archivedLayout)
            
        //     for (let key in archivedLayoutObj) {
        //         Reflect.set(layout, key, Reflect.get(archivedLayoutObj, key, archivedLayoutObj))
        //     }
        //     layout.view = this
        //     return layout
        // } else {
        //     layout.width = this.offsetWidth
        //     layout.height = this.offsetHeight
        //     layout.view = this
        //     this.setAttribute("__doric_layout__", JSON.stringify(layout))
        // }
        // return layout
    },

    set(layout: DoricLayout) {
        // this.setAttribute("__doric_layout__", JSON.stringify(layout))   
        this._dor
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

export enum DoricMeasureSpecMode {
    Unspecified = 0,
    Exactly = 1,
    AtMost = 2,
}

export interface DoricMeasureSpec {
    mode: DoricMeasureSpecMode;
    size: number;
}

export interface DoricSizeAndState { 
    size: number;
    state: number;
}

export enum DoricLayoutType {
    Undefined = 0,
    Stack = 1,
    VLayout = 2,
    HLayout = 3,
}

const DORIC_MEASURED_STATE_MASK = 0x11;

const DORIC_MEASURED_HEIGHT_STATE_SHIFT = 8;

const DORIC_MEASURED_STATE_TOO_SMALL = 0x01;

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
    minHeight: number = -1;

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
        this.applyWithSize({width:this.view.offsetWidth, 
                            height:this.view.offsetHeight})
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
        let maxWidth = 0
        let maxHeight = 0
        let childState = 0
        const measureMatchParentChildren = widthMeasureSpec.mode !== DoricMeasureSpecMode.Exactly || heightMeasureSpec.mode !== DoricMeasureSpecMode.Exactly
        const matchParentChildren = []
        const children = Array.from(this.view.children)
        for (const subView of children) {
            const childLayout = (subView as HTMLElement).doricLayout;
            if (childLayout.disabled) {
                continue
            }
            this.measureChild(childLayout, widthMeasureSpec, 0, heightMeasureSpec, 0)
            maxWidth = Math.max(maxWidth, childLayout.measuredWidth + childLayout.marginLeft + childLayout.marginRight)
            maxHeight = Math.max(maxHeight, childLayout.measuredHeight + childLayout.marginTop + childLayout.marginBottom)
            childState = childState | childLayout.measuredState
            if (measureMatchParentChildren) {
                if (childLayout.widthSpec === LayoutSpec.AT_MOST || childLayout.heightSpec === LayoutSpec.AT_MOST) {
                    matchParentChildren.push(childLayout)
                }
            }
        }

        maxWidth += this.paddingLeft + this.paddingRight
        maxHeight += this.paddingTop + this.paddingBottom

        maxWidth = Math.max(maxWidth, this.minWidth)
        maxHeight = Math.max(maxHeight, this.minHeight)

        const widthSizeAndState = this.resolveSizeAndState(maxWidth, widthMeasureSpec, childState)
        const heightSizeAndState = this.resolveSizeAndState(maxHeight, heightMeasureSpec, childState << DORIC_MEASURED_HEIGHT_STATE_SHIFT)

        this.measuredWidth = widthSizeAndState.size
        this.measuredHeight = heightSizeAndState.size

        this.measuredState = (widthSizeAndState.state << DORIC_MEASURED_HEIGHT_STATE_SHIFT) | heightSizeAndState.state

        if (matchParentChildren.length > 0) {
            for (const childLayout of matchParentChildren) {
                let childWidthMeasureSpec: DoricMeasureSpec = {
                    mode: DoricMeasureSpecMode.Unspecified,
                    size: 0,
                };
                if (childLayout.widthSpec === LayoutSpec.AT_MOST) {
                    childWidthMeasureSpec.mode = DoricMeasureSpecMode.Exactly;
                    childWidthMeasureSpec.size = Math.max(0, this.measuredWidth - this.paddingLeft - this.paddingRight - childLayout.marginLeft - childLayout.marginRight)
                } else {
                    childWidthMeasureSpec = this.getChildMeasureSpec(widthMeasureSpec, this.paddingLeft + this.paddingRight + childLayout.marginLeft + childLayout.marginRight, childLayout.widthSpec, childLayout.width)
                }

                let childHeightMeasureSpec: DoricMeasureSpec = {
                    mode: DoricMeasureSpecMode.Unspecified,
                    size: 0,
                };
                if (childLayout.heightSpec === LayoutSpec.AT_MOST) {
                    childHeightMeasureSpec.mode = DoricMeasureSpecMode.Exactly;
                    childHeightMeasureSpec.size = Math.max(0, this.measuredHeight - this.paddingTop - this.paddingBottom - childLayout.marginTop - childLayout.marginBottom)
                } else {
                    childHeightMeasureSpec = this.getChildMeasureSpec(heightMeasureSpec, this.paddingTop + this.paddingBottom + childLayout.marginTop + childLayout.marginBottom, childLayout.heightSpec, childLayout.height)
                }
                childLayout.measureSelf(childWidthMeasureSpec, childHeightMeasureSpec)
            }
        }
    }
    

    verticalMeasure(widthMeasureSpec: DoricMeasureSpec, heightMeasureSpec: DoricMeasureSpec) {
        let maxWidth = 0
        let totalLength = 0
        let totalWeight = 0
        let hadExtraSpace = false

        let widthMode = widthMeasureSpec.mode
        let heightMode = heightMeasureSpec.mode

        let skippedMeasure = false
        let matchWidth = false
        let allFillParent = true

        let weightedMaxWidth = 0
        let alternativeMaxWidth = 0
        let childState = 0

        const children = Array.from(this.view.children)
        for (const subView of children) {
            const childLayout = (subView as HTMLElement).doricLayout
            if (childLayout.disabled) {
                continue
            }
            hadExtraSpace = true
            totalLength += this.spacing
            totalWeight += childLayout.weight

            if (heightMode === DoricMeasureSpecMode.Exactly && childLayout.heightSpec === LayoutSpec.EXACTLY && childLayout.height === 0 && childLayout.weight > 0) {
                totalLength = Math.max(totalLength, totalLength + childLayout.marginTop + childLayout.marginBottom)
                skippedMeasure = true
            } else {
                let oldHeight = Number.MIN_VALUE
                if (childLayout.heightSpec === LayoutSpec.EXACTLY && childLayout.height === 0 && childLayout.weight > 0) {
                    oldHeight = 0
                    childLayout.heightSpec = LayoutSpec.WRAP_CONTENT
                }
                this.measureChild(childLayout, widthMeasureSpec, 0, heightMeasureSpec, totalWeight === 0 ? totalLength : 0)
                if (oldHeight !== Number.MIN_VALUE) {
                    childLayout.heightSpec = LayoutSpec.EXACTLY
                    childLayout.height = oldHeight
                }
                const childHeight = childLayout.measuredHeight
                totalLength = Math.max(totalLength, totalLength + childHeight + childLayout.marginTop + childLayout.marginBottom)
            }

            let matchWidthLocally = false
            if (widthMode !== DoricMeasureSpecMode.Exactly && childLayout.widthSpec === LayoutSpec.AT_MOST) {
                matchWidth = true
                matchWidthLocally = true
            }

            const margin = childLayout.marginLeft + childLayout.marginRight
            const measuredWidth = childLayout.measuredWidth + margin
            maxWidth = Math.max(maxWidth, measuredWidth)

            childState = childState | childLayout.measuredState
            allFillParent = allFillParent && childLayout.widthSpec === LayoutSpec.AT_MOST
            if (childLayout.weight > 0) {
                weightedMaxWidth = Math.max(weightedMaxWidth, matchWidthLocally ? margin : measuredWidth)
            } else {
                alternativeMaxWidth = Math.max(alternativeMaxWidth, matchWidthLocally ? margin : measuredWidth)
            }
        }

        if (hadExtraSpace) {
            totalLength -= this.spacing
        }
        totalLength += this.paddingTop + this.paddingBottom
        let heightSize = totalLength
        heightSize = Math.max(heightSize, this.minHeight)
        const heightSizeAndState = this.resolveSizeAndState(heightSize, heightMeasureSpec, 0)
        heightSize = heightSizeAndState.size

        let delta = heightSize - totalLength
        if (skippedMeasure || (delta !== 0 && totalWeight > 0)) {
            let weightSum = totalWeight
            totalLength = 0
            const children = Array.from(this.view.children)
            for (const subView of children) {
                const childLayout = (subView as HTMLElement).doricLayout
                if (childLayout.disabled) {
                    continue
                }
                const childExtra = childLayout.weight
                if (childExtra > 0) {
                    const share = childExtra * delta / weightSum
                    weightSum -= childExtra
                    delta -= share
                    const childWidthMeasureSpec = this.getChildMeasureSpec(widthMeasureSpec, this.paddingLeft + this.paddingRight + childLayout.marginLeft + childLayout.marginRight, childLayout.widthSpec, childLayout.width)
                    if (!(childLayout.heightSpec === LayoutSpec.WRAP_CONTENT && childLayout.height === 0) || heightMode !== DoricMeasureSpecMode.Exactly) {
                        let childHeight = childLayout.measuredHeight + share
                        if (childHeight < 0) {
                            childHeight = 0
                        }
                        childLayout.measureSelf(childWidthMeasureSpec, this.doricMeasureSpecMake(DoricMeasureSpecMode.Exactly, childHeight))
                    } else {
                        childLayout.measureSelf(childWidthMeasureSpec, this.doricMeasureSpecMake(DoricMeasureSpecMode.Exactly, share > 0 ? share : 0))
                    }
                    childState = childState | (childLayout.measuredState & (DORIC_MEASURED_STATE_MASK >> DORIC_MEASURED_HEIGHT_STATE_SHIFT))
                }

                const margin = childLayout.marginLeft + childLayout.marginRight
                const measuredWidth = childLayout.measuredWidth + margin
                maxWidth = Math.max(maxWidth, measuredWidth)

                const matchWidthLocally = widthMode !== DoricMeasureSpecMode.Exactly && childLayout.widthSpec === LayoutSpec.AT_MOST
                alternativeMaxWidth = Math.max(alternativeMaxWidth, matchWidthLocally ? margin : measuredWidth)
                allFillParent = allFillParent && childLayout.widthSpec === LayoutSpec.AT_MOST
                totalLength = Math.max(totalLength, totalLength + childLayout.measuredHeight + childLayout.marginTop + childLayout.marginBottom)
                totalLength += this.spacing    
            }
            if (hadExtraSpace) {
                totalLength -= this.spacing
            }
            totalLength += this.paddingTop + this.paddingBottom
        } else {
            alternativeMaxWidth = Math.max(alternativeMaxWidth, weightedMaxWidth)
        }

        if (!allFillParent && widthMode !== DoricMeasureSpecMode.Exactly) {
            maxWidth = alternativeMaxWidth
        }
        maxWidth += this.paddingLeft + this.paddingRight
        maxWidth = Math.max(maxWidth, this.minWidth)

        const widthSizeAndState = this.resolveSizeAndState(maxWidth, widthMeasureSpec, childState)
        this.measuredWidth = widthSizeAndState.size
        this.measuredHeight = heightSize
        this.measuredState = (widthSizeAndState.state << DORIC_MEASURED_HEIGHT_STATE_SHIFT) | heightSizeAndState.state
        if (matchWidth) {
            this.forceUniformWidth(heightMeasureSpec)
        }
        this.totalLength = totalLength
    }

    horizontalMeasure(widthMeasureSpec: DoricMeasureSpec, heightMeasureSpec: DoricMeasureSpec) {
        let maxHeight = 0
        let totalLength = 0
        let totalWeight = 0
        let hadExtraSpace = false

        const widthMode = widthMeasureSpec.mode
        const heightMode = heightMeasureSpec.mode

        let skippedMeasure = false
        let matchHeight = false
        let allFillParent = true

        let weightedMaxHeight = 0
        let alternativeMaxHeight = 0
        let isExactly = widthMode === DoricMeasureSpecMode.Exactly

        let childState = 0

        const children = Array.from(this.view.children)
        for (const subview of children) {
            const childLayout = (subview as HTMLElement).doricLayout
            if (childLayout.disabled) {
                continue
            }
            hadExtraSpace = true
            totalLength += this.spacing
            totalWeight += childLayout.weight
            if (widthMode === DoricMeasureSpecMode.Exactly && childLayout.widthSpec === LayoutSpec.EXACTLY && childLayout.width === 0 && childLayout.weight > 0) {
                if (isExactly) {
                    totalLength += childLayout.marginLeft + childLayout.marginRight
                } else {
                    totalLength = Math.max(totalLength, totalLength + childLayout.marginLeft + childLayout.marginRight)
                }
                skippedMeasure = true
            } else {
                let oldWidth = Number.MIN_VALUE
                if (childLayout.widthSpec === LayoutSpec.EXACTLY && childLayout.width === 0 && childLayout.weight > 0) {
                    oldWidth = 0
                    childLayout.widthSpec = LayoutSpec.WRAP_CONTENT
                }
                this.measureChild(childLayout, widthMeasureSpec, totalWeight === 0 ? totalWeight : 0, heightMeasureSpec, 0)
                if (oldWidth !== Number.MIN_VALUE) {
                    childLayout.widthSpec = LayoutSpec.EXACTLY
                    childLayout.width = oldWidth
                }
                const childWidth = childLayout.measuredWidth
                if (isExactly) {
                    totalLength += childWidth + childLayout.marginLeft + childLayout.marginRight
                } else {
                    totalLength = Math.max(totalLength, totalLength + childWidth + childLayout.marginLeft + childLayout.marginRight)
                }
            }

            let matchHeightLocally = false
            if (heightMode !== DoricMeasureSpecMode.Exactly && childLayout.heightSpec === LayoutSpec.AT_MOST) {
                matchHeight = true
                matchHeightLocally = true
            }
            const margin = childLayout.marginTop + childLayout.marginBottom
            const childHeight = childLayout.measuredHeight + margin
            childState = childState | childLayout.measuredState
            maxHeight = Math.max(maxHeight, childHeight)
            allFillParent  = allFillParent && childLayout.heightSpec === LayoutSpec.AT_MOST

            if (childLayout.weight > 0) {
                weightedMaxHeight = Math.max(weightedMaxHeight, matchHeightLocally ? margin : childHeight)
            } else {
                alternativeMaxHeight = Math.max(alternativeMaxHeight, matchHeightLocally ? margin : childHeight)
            }
        }

        if (hadExtraSpace) {
            totalLength -= this.spacing
        }
        totalLength += this.paddingLeft + this.paddingRight
        let widthSize = totalLength
        widthSize = Math.max(widthSize, this.minWidth)
        const widthSizeAndState = this.resolveSizeAndState(widthSize, widthMeasureSpec, 0)
        widthSize = widthSizeAndState.size

        let delta = widthSize - totalLength
        if (skippedMeasure || (delta !== 0 && totalWeight > 0)) {
            let weightSum = totalWeight
            totalLength = 0
            const children = Array.from(this.view.children)
            for (const subview of children) {
                const childLayout = (subview as HTMLElement).doricLayout
                if (childLayout.disabled) {
                    continue
                }
                const childExtra = childLayout.weight
                if (childExtra > 0) {
                    const share = childExtra * delta / weightSum
                    weightSum -= childExtra
                    delta -= share

                    const childHeightMeasureSpec = this.getChildMeasureSpec(heightMeasureSpec, this.paddingTop + this.paddingBottom + childLayout.marginTop + childLayout.marginBottom, childLayout.heightSpec, childLayout.height)
                    if (!(childLayout.widthSpec === LayoutSpec.EXACTLY && childLayout.width === 0) || widthMode !== DoricMeasureSpecMode.Exactly) {
                        let childWidth = childLayout.measuredWidth + share
                        if (childWidth < 0) {
                            childWidth = 0
                        }
                        childLayout.measureSelf(this.doricMeasureSpecMake(DoricMeasureSpecMode.Exactly, childWidth), childHeightMeasureSpec)
                    } else {
                        childLayout.measureSelf(this.doricMeasureSpecMake(DoricMeasureSpecMode.Exactly, share > 0 ? share : 0), childHeightMeasureSpec)
                    }
                    childState = childState | (childLayout.measuredState & DORIC_MEASURED_STATE_MASK)
                }
                if (isExactly) {
                    totalLength += childLayout.measuredWidth + childLayout.marginLeft + childLayout.marginRight
                } else {
                    totalLength = Math.max(totalLength, totalLength + childLayout.measuredWidth + childLayout.marginLeft + childLayout.marginRight)
                }
                totalLength += this.spacing
                const matchHeightLocally = heightMode !== DoricMeasureSpecMode.Exactly && childLayout.heightSpec === LayoutSpec.AT_MOST
                const margin = childLayout.marginTop + childLayout.marginBottom
                const childHeight = childLayout.measuredHeight + margin
                maxHeight = Math.max(maxHeight, childHeight)
                alternativeMaxHeight = Math.max(alternativeMaxHeight, matchHeightLocally ? margin : childHeight)
                allFillParent = allFillParent && childLayout.heightSpec === LayoutSpec.AT_MOST
            }
            
            if (hadExtraSpace) {
                totalLength -= this.spacing
            }

            totalLength += this.paddingLeft + this.paddingRight  
        } else {
            alternativeMaxHeight = Math.max(alternativeMaxHeight, weightedMaxHeight)
        }
        if (!allFillParent && heightMode !== DoricMeasureSpecMode.Exactly) {
            maxHeight = alternativeMaxHeight
        }
        maxHeight += this.paddingTop + this.paddingBottom
        maxHeight = Math.max(maxHeight, this.minHeight)
        this.measuredWidth = widthSize
        const heightSizeAndState = this.resolveSizeAndState(maxHeight, heightMeasureSpec, childState << DORIC_MEASURED_HEIGHT_STATE_SHIFT)
        this.measuredHeight = heightSizeAndState.size
        this.measuredState = ((widthSizeAndState.state | (childState & DORIC_MEASURED_STATE_MASK)) << DORIC_MEASURED_HEIGHT_STATE_SHIFT) | heightSizeAndState.state
        if (matchHeight) {
            this.forceUniformWidth(widthMeasureSpec)
        }
        this.totalLength = totalLength
    }

    undefinedMeasure(widthMeasureSpec: DoricMeasureSpec, heightMeasureSpec: DoricMeasureSpec) {

    }

    getChildMeasureSpec(spec:DoricMeasureSpec, padding:number, childLayoutSpec: LayoutSpec, childSize:number) {
        const specMode = spec.mode
        const specSize = spec.size

        const size = Math.max(0, specSize - padding)

        let resultSize = 0
        let resultMode = 0

        switch (specMode) {
            case DoricMeasureSpecMode.Exactly:
                if (childLayoutSpec === LayoutSpec.EXACTLY) {
                    resultSize = childSize
                    resultMode = DoricMeasureSpecMode.Exactly
                } else if (childLayoutSpec === LayoutSpec.AT_MOST) {
                    resultSize = size
                    resultMode = DoricMeasureSpecMode.Exactly
                } else if (childLayoutSpec === LayoutSpec.WRAP_CONTENT) {
                    resultSize = size
                    resultMode = DoricMeasureSpecMode.AtMost
                }
                break
            case DoricMeasureSpecMode.AtMost:
                if (childLayoutSpec === LayoutSpec.EXACTLY) {
                    resultSize = childSize
                    resultMode = DoricMeasureSpecMode.Exactly
                } else if (childLayoutSpec === LayoutSpec.AT_MOST) {
                    resultSize = size
                    resultMode = DoricMeasureSpecMode.AtMost
                } else if (childLayoutSpec === LayoutSpec.WRAP_CONTENT) {
                    resultSize = size
                    resultMode = DoricMeasureSpecMode.AtMost
                }
                break
            case DoricMeasureSpecMode.Unspecified:
                if (childLayoutSpec === LayoutSpec.EXACTLY) {
                    resultSize = childSize
                    resultMode = DoricMeasureSpecMode.Exactly
                } else if (childLayoutSpec === LayoutSpec.AT_MOST) {
                    resultSize = size
                    resultMode = DoricMeasureSpecMode.Unspecified
                } else if (childLayoutSpec === LayoutSpec.WRAP_CONTENT) {
                    resultSize = size
                    resultMode = DoricMeasureSpecMode.Unspecified
                }
                break
            default:
                break
        }
        return this.doricMeasureSpecMake(resultMode, resultSize)
    }
    
    measureChild(child:DoricLayout, widthSpec:DoricMeasureSpec, usedWidth:number, heightSpec:DoricMeasureSpec, usedHeight:number) {
        const childWidthMeasureSpec = this.getChildMeasureSpec(widthSpec, this.paddingLeft + this.paddingRight + this.marginLeft + this.marginRight + usedWidth, child.widthSpec, child.width)
        const childHeightMeasureSpec = this.getChildMeasureSpec(heightSpec, this.paddingTop + this.paddingBottom + this.marginTop + this.marginBottom + usedHeight, child.heightSpec, child.height)
        child.measureSelf(childWidthMeasureSpec, childHeightMeasureSpec)
    }

    resolveSizeAndState(size:number, spec:DoricMeasureSpec, childMeasuredState:number) {
        let result: DoricSizeAndState = {size: 0, state: 0}
        const specMode = spec.mode
        const specSize = spec.size
        switch (specMode) {
            case DoricMeasureSpecMode.AtMost:
                if (specSize < size) {
                    result.size = specSize
                    result.state = DORIC_MEASURED_STATE_TOO_SMALL
                } else {
                    result.size = size
                }
                break
            case DoricMeasureSpecMode.Exactly:
                result.size = specSize
                break
            case DoricMeasureSpecMode.Unspecified:
            default:
                result.size = size
                break
        }
        result.state = result.state | (childMeasuredState & DORIC_MEASURED_STATE_MASK)
        return result
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
        if (this.layoutType !== DoricLayoutType.Undefined) {
            const children = Array.from(this.view.children)
            for (const subView of children) {
                const childLayout = (subView as HTMLElement).doricLayout
                childLayout.setFrame()
            }
        }
        const originalX = this.measuredX
        const originalY = this.measuredY
        const originalWidth = this.measuredWidth
        const originalHeight = this.measuredHeight
        
        
    }

    layoutStack() {
        const children = Array.from(this.view.children)
        for (const subView of children) {
            const layout = (subView as HTMLElement).doricLayout
            if (layout.disabled) {
                continue
            }
            layout.layout()
            let gravity = layout.alignment
            if ((gravity & LEFT) === LEFT) {
                layout.measuredX = this.paddingLeft
            } else if ((gravity & RIGHT) === RIGHT) {
                layout.measuredX = this.measuredWidth - this.paddingRight - layout.measuredWidth
            } else if ((gravity & CENTER_X) === CENTER_X) {
                layout.measuredX = (this.measuredWidth - layout.measuredWidth) / 2
            } else {
                layout.measuredX = this.paddingLeft
            }

            if ((gravity & TOP) === TOP) {
                layout.measuredY = this.paddingTop
            } else if ((gravity & BOTTOM) === BOTTOM) {
                layout.measuredY = this.measuredHeight - this.paddingBottom - layout.measuredHeight
            } else if ((gravity & CENTER_Y) === CENTER_Y) {
                layout.measuredY = (this.measuredHeight - layout.measuredHeight) / 2
            } else {
                layout.measuredY = this.paddingTop
            }

            if (!gravity) {
                gravity = LEFT | TOP
            }
            if (layout.marginLeft && !((gravity & RIGHT) === RIGHT)) {
                layout.measuredX += layout.marginLeft
            }
            if (layout.marginRight && !((gravity & LEFT) === LEFT)) {
                layout.measuredX -= layout.marginRight
            }
            if (layout.marginTop && !((gravity & BOTTOM) === BOTTOM)) {
                layout.measuredY += layout.marginTop
            }
            if (layout.marginBottom && !((gravity & TOP) === TOP)) {
                layout.measuredY -= layout.marginBottom
            }
        }
    }

    layoutHLayout() {
        let xStart = this.paddingLeft
        if ((this.gravity & LEFT) === LEFT) {
            xStart = this.paddingLeft
        } else if ((this.gravity & RIGHT) === RIGHT) {
            xStart = this.measuredWidth - this.totalLength - this.paddingRight
        } else if ((this.gravity & CENTER_X) === CENTER_X) {
            xStart = (this.measuredWidth - this.totalLength - this.paddingLeft - this.paddingRight) / 2 + this.paddingLeft
        }
        const children = Array.from(this.view.children)
        for (const subView of children) {
            const layout = (subView as HTMLElement).doricLayout
            if (layout.disabled) {
                continue
            }
            layout.layout()
            let gravity = layout.alignment | this.gravity
            if ((gravity & TOP) === TOP) {
                layout.measuredY = this.paddingTop
            } else if ((gravity & BOTTOM) === BOTTOM) {
                layout.measuredY = this.measuredHeight - this.paddingBottom - layout.measuredHeight
            } else if ((gravity & CENTER_Y) === CENTER_Y) {
                layout.measuredY = (this.measuredHeight - layout.measuredHeight) / 2
            } else {
                this.measuredY = this.paddingTop
            }

            if (!gravity) {
                gravity = TOP
            }
            if (layout.marginTop && !((gravity & BOTTOM) === BOTTOM)) {
                layout.measuredY += layout.marginTop
            }
            if (layout.marginBottom && !((gravity & TOP) === TOP)) {
                layout.measuredY -= layout.marginBottom
            }
            layout.measuredX = xStart + layout.marginLeft
            xStart += this.spacing + layout.takenWidth()
        }
    }

    layoutVLayout() {
        let yStart = this.paddingTop
        if ((this.gravity & TOP) === TOP) {
            yStart = this.paddingTop
        } else if ((this.gravity & BOTTOM) === BOTTOM) {
            yStart = this.measuredHeight - this.totalLength - this.paddingBottom
        } else if ((this.gravity & CENTER_Y) === CENTER_Y) {
            yStart = (this.measuredHeight - this.totalLength - this.paddingTop - this.paddingBottom) / 2 + this.paddingTop
        }
        const children = Array.from(this.view.children)
        for (const subView of children) {
            const layout = (subView as HTMLElement).doricLayout
            if (layout.disabled) {
                continue
            }
            layout.layout()
            let gravity = layout.alignment | this.gravity
            if ((gravity & LEFT) === LEFT) {
                layout.measuredX = this.paddingLeft
            } else if ((gravity & RIGHT) === RIGHT) {
                layout.measuredX = this.measuredWidth - this.paddingRight - layout.measuredWidth
            } else if ((gravity & CENTER_X) === CENTER_X) {
                layout.measuredX = (this.measuredWidth - layout.measuredWidth) / 2
            } else {
                layout.measuredX = this.paddingLeft
            }
            if (!gravity) {
                gravity = LEFT
            }
            if (layout.marginLeft && !((gravity & RIGHT) === RIGHT)) {
                layout.measuredX += layout.marginLeft
            }
            if (layout.marginRight && !((gravity & LEFT) === LEFT)) {
                layout.measuredX -= layout.marginRight
            } 
            layout.measuredY = yStart + layout.marginTop
            yStart += this.spacing + layout.takenHeight()
        }
    }

    doricMeasureSpecMake(mode:DoricMeasureSpecMode, size:number) {
        const measureSpec: DoricMeasureSpec = {
            mode: mode,
            size: size,
        }
        return measureSpec
    }

    forceUniformWidth(heightMeasureSpec:DoricMeasureSpec) {
        let uniformMeasureSpec:DoricMeasureSpec = {
            mode: DoricMeasureSpecMode.Exactly,
            size: this.measuredWidth
        }
        const children = Array.from(this.view.children)
        for (const subview of children) {
            const childLayout = (subview as HTMLElement).doricLayout
            if (childLayout.disabled) {
                continue
            }
            if (childLayout.widthSpec === LayoutSpec.AT_MOST) {
                const oldHeight = childLayout.height
                const oldHeightSpec = childLayout.heightSpec
                childLayout.height = childLayout.measuredHeight
                childLayout.heightSpec = LayoutSpec.EXACTLY
                this.measureChild(childLayout, uniformMeasureSpec, 0, heightMeasureSpec, 0)
                childLayout.height = oldHeight
                childLayout.heightSpec = oldHeightSpec
            }
        }
    }
}

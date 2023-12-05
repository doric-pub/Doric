import { Color, GradientColor, GradientOrientation, LayoutSpec, View, } from 'doric';
import { DoricContext, getGlobalObject, ViewStackProcessor } from './sandbox';

const GradientDirection = getGlobalObject("GradientDirection");
const Visibility = getGlobalObject("Visibility");

export abstract class DoricViewNode<T extends View> {
  context: DoricContext;

  elmtId?: number;
  view: T;

  firstRender = false;

  abstract TAG: any

  constructor(context: DoricContext, t: T) {
    this.context = context;
    this.view = t;
  }

  render() {
    const firstRender = this.elmtId === undefined;
    if (firstRender) {
      this.elmtId = ViewStackProcessor.AllocateNewElmetIdForNextComponent();
    }
    if (firstRender || this.isDirty()) {
      ViewStackProcessor.StartGetAccessRecordingFor(this.elmtId);
      if (firstRender || this.isDirty()) {
        this.blend(this.view);
      }
      if (!firstRender) {
        this.pop();
      }
      ViewStackProcessor.StopGetAccessRecording();
      if (!firstRender) {
        this.context.viewPU.finishUpdateFunc(this.elmtId);
      }
    }
    this.pushing(this.view);
    if (firstRender) {
      this.pop();
    }
  }

  isDirty() {
    return Object.keys(this.view.dirtyProps).filter(e => e !== "children" && e !== "subviews").length > 0;
  }

  abstract pushing(v: T);

  abstract blend(v: T);

  abstract pop();

  commonConfig(v: T) {
    this.TAG.id(v.viewId) // for inspector

    // onClick
    if (v.onClick) {
      this.TAG.onClick(v.onClick);
    }

    // backgroundColor
    if (v.backgroundColor instanceof Color) {
      /// pure color
      this.TAG.backgroundColor(v.backgroundColor.toModel());
    } else if (v.backgroundColor instanceof Object) {
      /// gradient color
      const gradientColor = v.backgroundColor as GradientColor

      let direction;
      switch (gradientColor.orientation) {
        case GradientOrientation.TOP_BOTTOM:
          direction = GradientDirection.Bottom
          break
        case GradientOrientation.TR_BL:
          direction = GradientDirection.LeftBottom
          break
        case GradientOrientation.RIGHT_LEFT:
          direction = GradientDirection.Left
          break
        case GradientOrientation.BR_TL:
          direction = GradientDirection.LeftTop
          break
        case GradientOrientation.BOTTOM_TOP:
          direction = GradientDirection.Top
          break
        case GradientOrientation.BL_TR:
          direction = GradientDirection.RightTop
          break
        case GradientOrientation.LEFT_RIGHT:
          direction = GradientDirection.Right
          break
        case GradientOrientation.TL_BR:
          direction = GradientDirection.RightBottom
          break
      }

      const colors = []
      if (gradientColor.start && gradientColor.end) {
        colors.push([gradientColor.start, 0])
        colors.push([gradientColor.end, 1])
      } else if (gradientColor.colors) {
        if (gradientColor.locations && gradientColor.colors.length === gradientColor.locations.length) {
          gradientColor.colors.forEach((color, index) => {
            colors.push([color, gradientColor.locations[index]])
          })
        } else {
          gradientColor.colors.forEach((color, index) => {
            colors.push([color, 0 + 1 / (gradientColor.colors.length - 1) * index])
          })
        }
      }
      this.TAG.linearGradient({
        direction: direction,
        colors: colors
      })
    }

    // alpha
    if (v.alpha !== undefined) {
      this.TAG.opacity(v.alpha)
    }

    // border
    if (v.border) {
      this.TAG.borderWidth(v.border.width)
      this.TAG.borderColor(v.border.color)
    }

    // corners
    if (v.corners) {
      if (typeof v.corners === "number") {
        this.TAG.borderRadius(v.corners)
      } else if (typeof v.corners === "object") {
        const corners = v.corners as {
          leftTop?: number;
          rightTop?: number;
          leftBottom?: number;
          rightBottom?: number;
        }
        this.TAG.borderRadius({
          topLeft: corners.leftTop?? 0,
          topRight: corners.rightTop?? 0,
          bottomLeft: corners.leftBottom?? 0,
          bottomRight: corners.rightBottom?? 0,
        })
      }
    }

    // shadow
    if (v.shadow) {
      this.TAG.shadow(v.shadow)
    }

    if (v.hidden) {
      this.TAG.visibility(Visibility.None)
    } else {
      this.TAG.visibility(Visibility.Visible)
    }

    // layoutConfig
    /// margin
    if (v.layoutConfig?.margin) {
      this.TAG.margin(v.layoutConfig?.margin)
    }
    /// weight
    if (v.layoutConfig?.weight) {
      this.TAG.layoutWeight(v.layoutConfig?.weight)
    }

    const widthSpec = v.layoutConfig?.widthSpec?? LayoutSpec.JUST;
    const heightSpec = v.layoutConfig?.heightSpec?? LayoutSpec.JUST;
    switch (widthSpec) {
      case LayoutSpec.FIT:
        break;
      case LayoutSpec.MOST:
        this.TAG.width("100%");
        break;
      case LayoutSpec.JUST:
      default:
        this.TAG.width(v.width);
        break;
    }

    switch (heightSpec) {
      case LayoutSpec.MOST:
        this.TAG.height("100%");
        break;
      case LayoutSpec.FIT:
        break;
      case LayoutSpec.JUST:
      default:
        this.TAG.height(v.height);
        break;
    }

  }
}

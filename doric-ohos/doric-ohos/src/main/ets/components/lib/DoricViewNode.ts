import { Color, View, LayoutSpec, } from 'doric';
import { DoricContext, ViewStackProcessor } from './sandbox';


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
    if (v.onClick) {
      this.TAG.onClick(v.onClick);
    }
    if (v.backgroundColor instanceof Color) {
      this.TAG.backgroundColor(v.backgroundColor.toModel());
    }

    if (v.alpha !== undefined) {
      this.TAG.opacity(v.alpha)
    }
    if (v.layoutConfig?.margin) {
      this.TAG.margin(v.layoutConfig?.margin)
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

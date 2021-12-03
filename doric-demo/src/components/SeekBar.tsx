import {
  GestureContainer,
  ViewComponent,
  Stack,
  Color,
  LayoutSpec,
  BridgeContext,
  loge,
  Panel,
} from "doric";

@ViewComponent
export class SeekBar extends GestureContainer {
  private content: Stack;
  private maxWidth = 0;
  context?: BridgeContext;
  onProgressChanged?: (progress: number) => void;

  set progress(progress: number) {
    if (this.maxWidth === 0) {
      Promise.resolve().then(() => {
        if (this.context) {
          (this.context.entity as Panel).addOnRenderFinishedCallback(
            async () => {
              this.maxWidth = await this.getWidth(this.context!!);
              this.content.width = this.maxWidth * progress;
            }
          );
        }
      });
    } else {
      this.content.width = this.maxWidth * progress;
    }
  }
  constructor() {
    super();
    this.content = new Stack();
    this.content.layoutConfig = {
      widthSpec: LayoutSpec.JUST,
      heightSpec: LayoutSpec.MOST,
    };
    this.content.backgroundColor = Color.RED;
    this.onTouchDown = async (event) => {
      if (!this.context) {
        return;
      }
      this.maxWidth = await this.getWidth(this.context);
      event.x = Math.max(0, event.x);
      this.content.width = event.x;
      this.onProgressChanged?.(
        Math.max(0, Math.min(1, event.x / this.maxWidth))
      );
    };
    this.onTouchMove = async (event) => {
      if (!this.context) {
        return;
      }
      event.x = Math.max(0, event.x);
      this.content.width = event.x;
      this.onProgressChanged?.(
        Math.max(0, Math.min(1, event.x / this.maxWidth))
      );
    };
    this.addChild(this.content);
  }
  set contentColor(color: Color) {
    this.content.backgroundColor = color;
  }
}

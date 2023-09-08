import { horizontalList } from 'doric';
import { DoricGroupViewNode } from "./DoricViewNode";
import { NestedSliderView } from '../widgets/NestedSliderView';

export class DoricNestedSliderNode extends DoricGroupViewNode {
  onPageSelectedFuncId = "";
  scrollable = true;

  blendProps(v: HTMLElement, propName: string, prop: any) {
    if (propName === "scrollable") {
      this.scrollable = prop;
    } else if (propName === "onPageSlided") {
      this.onPageSelectedFuncId = prop;
    } else if (propName === "slidePosition") {
      setTimeout(() => {
        this.slidePage({ page: prop, smooth: false });
      });
    } else {
      super.blendProps(v, propName, prop);
    }
  }

  build() {
    return NestedSliderView({
      scrollable: () => this.scrollable, onPageSelected: index => {
        if (this.onPageSelectedFuncId.length > 0) {
          this.callJSResponse(this.onPageSelectedFuncId, index);
        }
      }
    });
  }

  layout(): void {
    super.layout();
    this.childNodes.forEach((e, idx) => {
      e.view.style.display = "inline-block";
      e.view.style.width = "100%";
      e.view.style.height = "100%";
    });
  }

  getSlidedPage() {
    return Math.round(this.view.scrollLeft / this.view.offsetWidth);
  }

  slidePage(params: { page: number; smooth: boolean }) {
    if (params.smooth) {
      this.view.scrollTo({
        left: this.view.offsetWidth * params.page,
        behavior: "smooth",
      });
    } else {
      this.view.scrollTo({
        left: this.view.offsetWidth * params.page,
      });
    }
    if (this.onPageSelectedFuncId.length > 0) {
      this.callJSResponse(this.onPageSelectedFuncId, params.page);
    }
  }
}

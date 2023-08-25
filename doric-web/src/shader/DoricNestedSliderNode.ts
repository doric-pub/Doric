import { DoricGroupViewNode } from "./DoricViewNode";

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
    const ret = document.createElement("div");
    ret.style.overflow = "hidden";
    ret.style.display = "inline";
    ret.style.whiteSpace = "nowrap";
    let touchStartX = 0;
    let currentIndex = 0;
    let isDragging = false;
    const handleTouchStart = (x: number) => {
      if (!this.scrollable) return;
      currentIndex = Math.round(ret.scrollLeft / ret.offsetWidth);
      touchStartX = x;
      isDragging = true;
    };
    ret.onmousedown = (ev) => handleTouchStart(ev.pageX);
    ret.ontouchstart = (ev) => handleTouchStart(ev.touches[0].pageX);
    const handleTouchMove = (x: number) => {
      if (!this.scrollable || !isDragging) return;
      const offsetX = (touchStartX - x) * 3;
      ret.scrollTo({
        left: currentIndex * ret.offsetWidth + offsetX,
      });
    };
    ret.onmousemove = (ev) => handleTouchMove(ev.pageX);
    ret.ontouchmove = (ev) => handleTouchMove(ev.touches[0].pageX);
    const handleTouchCancel = () => {
      if (!this.scrollable) return;
      isDragging = false;
      let originInndex = currentIndex;
      currentIndex = Math.round(ret.scrollLeft / ret.offsetWidth);
      ret.scrollTo({
        left: currentIndex * ret.offsetWidth,
        behavior: "smooth",
      });
      if (originInndex !== currentIndex) {
        if (this.onPageSelectedFuncId.length > 0) {
          this.callJSResponse(this.onPageSelectedFuncId, currentIndex);
        }
      }
    };
    ret.onmouseup = ret.ontouchcancel = ret.ontouchend = handleTouchCancel;
    return ret;
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

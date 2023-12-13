import { Slider, View } from 'doric';
import { createDoricViewNode } from '../lib/Registry';
import { getGlobalObject, ViewStackProcessor } from '../lib/sandbox'
import { SuperNode } from '../lib/SuperNode';

const Swiper = getGlobalObject("Swiper");
const ForEach = getGlobalObject("ForEach");

export class SliderNode extends SuperNode<Slider> {
  TAG = Swiper;

  forEachElmtId?: number;

  pushing(v: Slider) {
    const firstRender = this.forEachElmtId === undefined;
    if (!firstRender && !this.view.isDirty()) {
      return;
    }

    if (firstRender) {
      this.forEachElmtId = ViewStackProcessor.AllocateNewElmetIdForNextComponent();
    }

    const children: View[] = []
    for (let i = 0;i != v.itemCount; i++) {
      const child = v.renderPage(i)
      children.push(child)
    }

    children.forEach((child) => {
      let childNode = this.childNodes.get(child.viewId);
      if (childNode) {
        childNode.render();
      }
    });

    ViewStackProcessor.StartGetAccessRecordingFor(this.forEachElmtId);
    ForEach.create();
    let diffIndexArray = []; // New indexes compared to old one.
    let newIdArray = children.map(e => e.viewId);
    let idDuplicates = [];

    ForEach.setIdArray(this.forEachElmtId, newIdArray, diffIndexArray, idDuplicates);

    diffIndexArray.forEach((idx) => {
      const child = children[idx];
      let childNode = this.childNodes.get(child.viewId);
      if (!childNode) {
        childNode = createDoricViewNode(this.context, child);
        this.childNodes.set(child.viewId, childNode);
      }
      ForEach.createNewChildStart(childNode.view.viewId, this.context.viewPU);
      childNode.render();
      ForEach.createNewChildFinish(childNode.view.viewId, this.context.viewPU);
    });

    if (!firstRender) {
      ForEach.pop();
    }
    ViewStackProcessor.StopGetAccessRecording();
    if (firstRender) {
      ForEach.pop();
    } else {
      this.context.viewPU.finishUpdateFunc(this.forEachElmtId);
    }
  }

  pop() {
    Swiper.pop();
  }

  blend(v: Slider) {
    Swiper.create();

    // commonConfig
    this.commonConfig(v)
  }
}

import { Group } from 'doric';
import { DoricViewNode } from './DoricViewNode';
import { createDoricViewNode } from './Registry';
import { getGlobalObject, ViewStackProcessor } from './sandbox';
import { SuperNode } from './SuperNode';

const ForEach = getGlobalObject("ForEach");

export abstract class GroupNode<T extends Group> extends SuperNode<T> {

  forEachElmtId?: number;

  pushing(v: T) {
    const firstRender = this.forEachElmtId === undefined;
    if (!firstRender && !this.view.isDirty()) {
      return;
    }


    if (firstRender) {
      this.forEachElmtId = ViewStackProcessor.AllocateNewElmetIdForNextComponent();
    }
    v.children.forEach((child) => {
      let childNode = this.childNodes.get(child.viewId);
      if (childNode) {
        childNode.render();
      }
    });

    ViewStackProcessor.StartGetAccessRecordingFor(this.forEachElmtId);
    ForEach.create();
    const children = v.children;
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
}

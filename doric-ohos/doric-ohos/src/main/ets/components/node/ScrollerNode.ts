import { Scroller as DoricScroller } from 'doric'
import { getGlobalObject, ViewStackProcessor } from '../lib/sandbox'
import { createDoricViewNode } from '../lib/Registry'
import { SuperNode } from '../lib/SuperNode'

const ForEach = getGlobalObject("ForEach")
const Scroll = getGlobalObject("Scroll")
const Alignment = getGlobalObject("Alignment")
const ScrollDirection = getGlobalObject("ScrollDirection")
const BarState = getGlobalObject("BarState")
const Scroller = getGlobalObject("Scroller")

export class ScrollerNode extends SuperNode<DoricScroller> {
  TAG = Scroll

  forEachElmtId?: number

  private scroller = new Scroller()

  pushing(v: DoricScroller) {
    const firstRender = this.forEachElmtId === undefined
    if (!firstRender && !this.view.isDirty()) {
      return
    }


    if (firstRender) {
      this.forEachElmtId = ViewStackProcessor.AllocateNewElmetIdForNextComponent()
    }
    [v.content].forEach((child) => {
      let childNode = this.childNodes.get(child.viewId)
      if (childNode) {
        childNode.render()
      }
    })

    ViewStackProcessor.StartGetAccessRecordingFor(this.forEachElmtId)
    ForEach.create()
    const children = [v.content]
    let diffIndexArray = [] // New indexes compared to old one.
    let newIdArray = children.map(e => e.viewId)
    let idDuplicates = []

    ForEach.setIdArray(this.forEachElmtId, newIdArray, diffIndexArray, idDuplicates)

    diffIndexArray.forEach((idx) => {
      const child = children[idx]
      let childNode = this.childNodes.get(child.viewId)
      if (!childNode) {
        childNode = createDoricViewNode(this.context, child)
        this.childNodes.set(child.viewId, childNode)
      }
      ForEach.createNewChildStart(childNode.view.viewId, this.context.viewPU)
      childNode.render()
      ForEach.createNewChildFinish(childNode.view.viewId, this.context.viewPU)
    })

    if (!firstRender) {
      ForEach.pop()
    }
    ViewStackProcessor.StopGetAccessRecording()
    if (firstRender) {
      ForEach.pop()
    } else {
      this.context.viewPU.finishUpdateFunc(this.forEachElmtId)
    }
  }

  pop() {
    Scroll.pop()
  }

  blend(v: DoricScroller) {
    Scroll.create(this.scroller)
    Scroll.scrollBar(BarState.Off)
    Scroll.align(Alignment.TopStart) // align to top start, otherwise default is center x
    Scroll.scrollable(ScrollDirection.Vertical)

    // commonConfig
    this.commonConfig(v)
  }
}

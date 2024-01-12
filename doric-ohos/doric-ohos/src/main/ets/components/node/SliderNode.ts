import { SlideItem, Slider } from 'doric'
import { createDoricViewNode } from '../lib/Registry'
import { getGlobalObject, ViewStackProcessor } from '../lib/sandbox'
import { SuperNode } from '../lib/SuperNode'

const Swiper = getGlobalObject("Swiper")
const ForEach = getGlobalObject("ForEach")
const SwiperController = getGlobalObject("SwiperController")

export class SliderNode extends SuperNode<Slider> {
  TAG = Swiper

  forEachElmtId?: number

  private swiperController = new SwiperController()

  pushing(v: Slider) {
    const firstRender = this.forEachElmtId === undefined
    if (!firstRender && !this.view.isDirty()) {
      return
    }

    if (firstRender) {
      this.forEachElmtId = ViewStackProcessor.AllocateNewElmetIdForNextComponent()
    }

    const children = []
    for (let itemIdx = 0;itemIdx != v.itemCount; itemIdx++) {
      const cachedView = (v as any).cachedViews.get(`${itemIdx}`)
      let child
      if (cachedView) {
        child = cachedView
      } else {
        (v as any).renderBunchedItems(itemIdx, 1)
        child = (v as any).cachedViews.get(`${itemIdx}`) as SlideItem
      }
      children.push(child)
    }

    children.forEach((child) => {
      let childNode = this.childNodes.get(child.viewId)
      if (childNode) {
        childNode.render()
      }
    })

    ViewStackProcessor.StartGetAccessRecordingFor(this.forEachElmtId)
    ForEach.create()
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
    Swiper.pop()
  }

  blend(v: Slider) {
    Swiper.create(this.swiperController)
    Swiper.indicator(false)

    // onPageSlided
    if (v.onPageSlided) {
      Swiper.onChange((index) => {
        v.onPageSlided(index)
      })
    }

    // loop
    if (v.loop !== undefined) {
      Swiper.loop(v.loop)
    }

    // scrollable
    if (v.scrollable !== undefined) {
      Swiper.disableSwipe(!v.scrollable)
    }

    // slidePosition
    if (v.slidePosition !== undefined) {
      this.slidePage({
        page: v.slidePosition
      })
    }

    // commonConfig
    this.commonConfig(v)
  }

  blendSubNodes(v: Slider) {

  }

  private slidePage(props: any) {
    return new Promise((resolve, reject) => {
      const result = getInspectorByKey(this.view.viewId)
      let currentIndex = parseInt(JSON.parse(result).$attrs.index)

      if (props.page !== undefined) {
        if (props.page > currentIndex) {
          for (let index = 0; index < (props.page - currentIndex); index++) {
            this.swiperController.showNext()
          }
        } else {
          for (let index = 0; index < (currentIndex - props.page); index++) {
            this.swiperController.showPrevious()
          }
        }
      }
    })
  }

  private getSlidedPage() {
    return new Promise((resolve, reject) => {
      const result = getInspectorByKey(this.view.viewId)
      resolve(parseInt(JSON.parse(result).$attrs.index))
    })
  }
}

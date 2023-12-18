import { NestedSlider } from 'doric'
import { getGlobalObject } from '../lib/sandbox'
import { GroupNode } from '../lib/GroupNode'

const Swiper = getGlobalObject("Swiper")
const SwiperController = getGlobalObject("SwiperController")

export class NestedSliderNode extends GroupNode<NestedSlider> {
  TAG = Swiper

  private swiperController = new SwiperController()

  pop() {
    Swiper.pop()
  }

  blend(v: NestedSlider) {
    Swiper.create(this.swiperController)
    Swiper.indicator(false)

    // onPageSlided
    if (v.onPageSlided) {
      Swiper.onChange((index) => {
        v.onPageSlided(index)
      })
    }

    // commonConfig
    this.commonConfig(v)
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

import { Image as DoricImage, ScaleType } from 'doric'
import { DoricViewNode } from '../lib/DoricViewNode'
import { getGlobalObject } from '../lib/sandbox'

const Image = getGlobalObject("Image")
const ImageFit = getGlobalObject("ImageFit")

export class ImageNode extends DoricViewNode<DoricImage> {
  TAG = Image

  pushing(v: DoricImage) {
  }

  pop() {
    Image.pop()
  }

  blend(v: DoricImage) {
    if (v.imageUrl) {
      Image.create(v.imageUrl)
    } else if (v.image) {
      Image.create("")
    } else if (v.imageBase64) {
      Image.create(v.imageBase64)
    }
    Image.fitOriginalSize(true)

    // isBlur
    if (v.isBlur) {
      Image.blur(70)
    }

    // scaleType
    switch (v.scaleType) {
      case ScaleType.ScaleToFill:
        Image.objectFit(ImageFit.Fill)
        break
      case ScaleType.ScaleAspectFit:
        Image.objectFit(ImageFit.Contain)
        break
      case ScaleType.ScaleAspectFill:
        Image.objectFit(ImageFit.Cover)
        break
      default:
        Image.objectFit(ImageFit.Fill)
        break
    }

    // loadCallback
    if (v.loadCallback) {
      this.TAG.onComplete((event?: {
        width: number
        height: number
        componentWidth: number
        componentHeight: number
        loadingStatus: number
      }) => {
        v.loadCallback({ width: event.width, height: event.height, animated: false })
      })
    }

    this.commonConfig(v)
  }
}

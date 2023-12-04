import { AssetsResource, Image as DoricImage, Resource } from 'doric';
import { DoricViewNode } from '../lib/DoricViewNode';
import { getGlobalObject } from '../lib/sandbox';

const Image = getGlobalObject("Image");

export class ImageNode extends DoricViewNode<DoricImage> {
  TAG = Image;

  pushing(v: DoricImage) {
  }

  pop() {
    Image.pop();
  }

  blend(v: DoricImage) {
    if (v.imageUrl) {
      Image.create(v.imageUrl)
    } else if (v.image) {
      if (v.image instanceof Resource) {
        Image.create("")
      }
    }

    Image.fitOriginalSize(true);
    this.commonConfig(v)
  }
}

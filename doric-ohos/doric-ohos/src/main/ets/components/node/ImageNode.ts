import { Image as DoricImage } from 'doric';
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
    Image.create(v.imageUrl)
    Image.fitOriginalSize(true);
    this.commonConfig(v)
  }
}

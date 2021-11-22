import {
  Base64Resource,
  DrawableResource,
  Group,
  Panel,
  jsx,
  Color,
  layoutConfig,
  Image,
  RemoteResource,
  MainBundleResource,
  Scroller,
  VLayout,
  Text,
  Gravity,
  createRef,
  loge,
} from "doric";
import { colors, label } from "./utils";
import { img_base64 } from "./image_base64";

@Entry
export class ImageProcessorDemo extends Panel {
  build(root: Group): void {
    const iv = createRef<Image>();
    <Scroller parent={root} layoutConfig={layoutConfig().most()}>
      <VLayout
        layoutConfig={layoutConfig().mostWidth().fitHeight()}
        space={10}
        gravity={Gravity.Center}
      >
        <Text
          layoutConfig={layoutConfig().mostWidth().justHeight()}
          textSize={30}
          textColor={Color.WHITE}
          backgroundColor={colors[5]}
          textAlignment={Gravity.Center}
          height={50}
        >
          Image Processor
        </Text>
        <Image ref={iv} imageUrl="https://doric.pub/logo.png" />
        <Text
          onClick={async () => {
            const imageInfo = await iv.current.getImageInfo(context);
            loge(imageInfo);
            const pixels = await iv.current.getImagePixels(context);
            loge(pixels.byteLength);
            const data = new Uint8Array(pixels);
            for (let i = 0; i < data.length - 4; i += 4) {
              data[i + 3] = 12;
            }
            iv.current.imagePixels = {
              width: imageInfo.width,
              height: imageInfo.height,
              pixels: pixels,
            };
          }}
        >
          Transparent
        </Text>
      </VLayout>
    </Scroller>;
  }
}

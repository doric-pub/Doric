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
export class ResourceDemo extends Panel {
  build(root: Group): void {
    const iv = createRef<Image>();
    async function click() {
      const imageInfo = await iv.current.getImageInfo(context);
      loge(imageInfo);
      const pixels = await iv.current.getImagePixels(context);
      loge(pixels.byteLength);
      const data = new Uint8Array(pixels);
      for (let i = 0; i < data.length - 4; i += 4) {
        data[i + 3] = 0xff / 3;
      }
      iv.current.imagePixels = {
        width: imageInfo.width,
        height: imageInfo.height,
        pixels: pixels,
      };
    }
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
          Resource Demo
        </Text>
        {label("Button")}
        <Image
          image={
            Environment.platform === "Android"
              ? new DrawableResource("doric_icon_back")
              : new MainBundleResource("Hanabi.ttf")
          }
        />
        <Image
          image={
            new RemoteResource("https://p.upyun.com/demo/webp/webp/jpg-0.webp")
          }
        />
        <Image
          ref={iv}
          image={new Base64Resource(img_base64[0])}
          onClick={async () => {
            await click();
          }}
        />
      </VLayout>
    </Scroller>;
  }
}

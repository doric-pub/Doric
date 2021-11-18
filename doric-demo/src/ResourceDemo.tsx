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
  resourceLoader,
  imageDecoder,
  createRef,
  loge,
} from "doric";
import { colors, label } from "./utils";
import { img_base64 } from "./image_base64";

@Entry
export class ResourceDemo extends Panel {
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
          Image Demo
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
          image={new Base64Resource(img_base64[0])}
          ref={iv}
          onClick={async () => {
            const resource = new RemoteResource(
              "https://p.upyun.com/demo/webp/webp/jpg-0.webp"
            );
            const rawData = await resourceLoader(context).load(resource);
            loge(rawData.byteLength);
            const imageInfo = await imageDecoder(context).getImageInfo(
              resource
            );
            loge(imageInfo);
            const pixels = await imageDecoder(context).decodeToPixels(resource);
            const unit8Array = new Uint8Array(pixels);
            for (let i = 0; i < unit8Array.length; i += 4) {
              unit8Array[i] -= 20;
            }
            loge(pixels.byteLength);
            iv.current.image = resource;
          }}
        />
      </VLayout>
    </Scroller>;
  }
}

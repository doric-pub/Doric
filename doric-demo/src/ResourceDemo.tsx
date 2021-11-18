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
} from "doric";
import { colors, label } from "./utils";
import { img_base64 } from "./image_base64";
import { loge } from "doric/lib/src/util/log";

@Entry
export class ResourceDemo extends Panel {
  build(root: Group): void {
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
          onClick={async () => {
            const resource = new RemoteResource(
              "https://p.upyun.com/demo/webp/webp/jpg-0.webp"
            );
            const rawData = await resourceLoader(context).load(resource);
            loge(rawData.byteLength);
          }}
        />
      </VLayout>
    </Scroller>;
  }
}

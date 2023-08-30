import { AssetsResource, AndroidAssetsResource, Base64Resource, DrawableResource, Group, Panel, coordinator, text, gravity, Color, LayoutSpec, log, vlayout, scroller, layoutConfig, image, ScaleType, Image, modal, RemoteResource, MainBundleResource } from "doric";
import { colors, label } from "./utils";
import { img_base64 } from "./image_base64";

const imageUrl = 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.jj20.com%2Fup%2Fallimg%2F1112%2F12101P11147%2F1Q210011147-3.jpg&refer=http%3A%2F%2Fpic.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1662787633&t=99942c90360f55bbcfe00fa140d1c1df'

import logo from "./images/logo_w.png"
import button from "./images/button.png"

@Entry
class ImageDemo extends Panel {
  build(rootView: Group): void {
    let imageView: Image
    scroller(
      vlayout(
        [
          text({
            text: "Image Demo",
            layoutConfig: layoutConfig().configWidth(LayoutSpec.MOST),
            textSize: 30,
            textColor: Color.WHITE,
            backgroundColor: colors[5],
            textAlignment: gravity().center(),
            height: 50,
          }),

          label("Button"),
          image({
            image:
              Environment.platform === "Android"
                ? new AndroidAssetsResource(
                  "assets/The_Parthenon_in_Athens.jpeg"
                )
                : new MainBundleResource(
                  "assets/The_Parthenon_in_Athens.jpeg"
                ),
          }),
          image({
            image: new AssetsResource("The_Parthenon_in_Athens.jpeg"),
          }),
          image({
            image: new RemoteResource(
              "https://p.upyun.com/demo/webp/webp/jpg-0.webp"
            ),
          }),
          image({
            image: new Base64Resource(img_base64[0]),
            scaleType: ScaleType.ScaleToFill,
            layoutConfig: {
              widthSpec: LayoutSpec.FIT,
              heightSpec: LayoutSpec.FIT,
            },
          }),
          image({
            imageBase64: button,
            scaleType: ScaleType.ScaleToFill,
            layoutConfig: {
              widthSpec: LayoutSpec.JUST,
              heightSpec: LayoutSpec.JUST,
            },
            width: 200,
            height: 150 / 2.75,
            stretchInset: {
              left: 100,
              top: 0,
              right: 100,
              bottom: 0,
            },
            imageScale: 2.75,
          }),
          image({
            imageBase64: button,
            scaleType: ScaleType.ScaleToFill,
            layoutConfig: {
              widthSpec: LayoutSpec.JUST,
              heightSpec: LayoutSpec.JUST,
            },
            width: 200,
            height: 75,
            stretchInset: {
              left: 100,
              top: 0,
              right: 100,
              bottom: 0,
            },
            imageScale: 2,
          }),
          label("Gif "),
          image({
            imageUrl:
              "https://www.w3.org/People/mimasa/test/imgformat/img/w3c_home_animation.gif",
            scaleType: ScaleType.ScaleToFill,
            imageScale: 3,
          }),
          label("APNG"),
          image({
            imageUrl:
              "https://upload.wikimedia.org/wikipedia/commons/1/14/Animated_PNG_example_bouncing_beach_ball.png",
          }),
          label("Animated WebP"),
          image({
            imageUrl:
              "https://p.upyun.com/demo/webp/webp/animated-gif-0.webp",
          }),
          label("WebP"),
          (imageView = image({
            imageUrl: "https://p.upyun.com/demo/webp/webp/jpg-0.webp",
            layoutConfig: layoutConfig().just(),
            width: 200,
            height: 200,
            loadCallback: (ret) => {
              if (ret) {
                imageView.width = ret.width;
                imageView.height = ret.height;
              }
            },
          })),
          label("ScaleToFill"),
          image({
            imageUrl,
            width: 300,
            height: 300,
            isBlur: true,
            border: {
              width: 2,
              color: Color.GRAY,
            },
            scaleType: ScaleType.ScaleToFill,
            layoutConfig: layoutConfig().just(),
            loadCallback: (ret) => { },
          }),
          label("ScaleAspectFit"),
          image({
            imageUrl,
            width: 300,
            height: 300,
            border: {
              width: 2,
              color: Color.GRAY,
            },
            scaleType: ScaleType.ScaleAspectFit,
            layoutConfig: layoutConfig().just(),
          }),
          label("ScaleAspectFill"),
          image({
            imageUrl,
            width: 300,
            height: 300,
            border: {
              width: 2,
              color: Color.GRAY,
            },
            scaleType: ScaleType.ScaleAspectFill,
            layoutConfig: layoutConfig().just(),
          }),
          label("ImageBase64"),
          image({
            imageBase64: img_base64[0],
            width: 300,
            height: 300,
            border: {
              width: 2,
              color: Color.GRAY,
            },
            scaleType: ScaleType.ScaleAspectFill,
            layoutConfig: layoutConfig().just(),
          }),
          label("StretchInset 1"),
          image({
            imageBase64: img_base64[1],
            height: 60,
            width: 134,
            scaleType: ScaleType.ScaleAspectFill,
            layoutConfig: layoutConfig().just(),
          }),
          image({
            imageBase64: img_base64[1],
            height: 60,
            width: 294,
            scaleType: ScaleType.ScaleToFill,
            layoutConfig: layoutConfig().just(),
            stretchInset: {
              left: 0.85,
              top: 0,
              right: 0.149,
              bottom: 0,
            },
          }),

          label("StretchInset 2"),
          image({
            image: new AssetsResource("coupon_bg2.png"),
            height: 48,
            width: 78,
            scaleType: ScaleType.ScaleAspectFill,
            layoutConfig: layoutConfig().just(),
          }),
          image({
            image: new AssetsResource("coupon_bg2.png"),
            height: 48,
            width: 78 * 3,
            scaleType: ScaleType.ScaleToFill,
            imageScale: 1,
            layoutConfig: layoutConfig().just(),
            stretchInset: {
              left: 0,
              top: 0,
              right: 76,
              bottom: 0,
            },
          }),

          label("tileInset 1"),
          image({
            image: new AssetsResource("dididi.png"),
            height: 78,
            width: 84,
            backgroundColor: Color.BLACK,
            scaleType: ScaleType.ScaleAspectFill,
            layoutConfig: layoutConfig().just(),
          }),
          image({
            image: new AssetsResource("dididi.png"),
            height: 78,
            width: 84 * 3,
            imageScale: 1,
            backgroundColor: Color.BLACK,
            scaleType: ScaleType.Tile,
            layoutConfig: layoutConfig().just(),
          }),

          label("tileInset 2"),
          image({
            image: new AssetsResource("123.png"),
            height: 288 / 2,
            width: 154 / 2,
            scaleType: ScaleType.ScaleAspectFill,
            layoutConfig: layoutConfig().just(),
          }),
          image({
            image: new AssetsResource("123.png"),
            height: 288,
            width: 154,
            imageScale: 2,
            scaleType: ScaleType.Tile,
            layoutConfig: layoutConfig().just(),
          }),
          label("placeHolder"),
          image({
            imageUrl: "https://p.upyun.com/eror.404",
            layoutConfig: layoutConfig().just(),
            height: 100,
            width: 100,
            placeHolderColor: Color.GREEN,
            errorColor: Color.RED,
          }),
        ],
        {
          layoutConfig: layoutConfig().most().configHeight(LayoutSpec.FIT),
          gravity: gravity().center(),
          space: 10,
        }
      ),
      {
        layoutConfig: layoutConfig().most(),
      }
    )
      .also((it) => {
        coordinator(context).verticalScrolling({
          scrollable: it,
          scrollRange: {
            start: 0,
            end: 100,
          },
          target: "NavBar",
          changing: {
            name: "backgroundColor",
            start: Color.WHITE,
            end: Color.RED,
          },
        });
        coordinator(context).verticalScrolling({
          scrollable: it,
          scrollRange: {
            start: 0,
            end: 100,
          },
          target: imageView,
          changing: {
            name: "width",
            start: 10,
            end: 200,
          },
        });
      })
      .in(rootView);
  }
  onDestroy() {
    modal(context).toast('onDestroy')
  }
}
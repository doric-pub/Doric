import { AssetsResource, AndroidAssetsResource, Base64Resource, DrawableResource, Group, Panel, coordinator, text, gravity, Color, LayoutSpec, log, vlayout, scroller, layoutConfig, image, ScaleType, Image, modal, RemoteResource, MainBundleResource, hlayout } from "doric";
import { colors, label } from "./utils";
import { img_base64 } from "./image_base64";

const landscapeImageUrl = 'https://www.adorama.com/alc/wp-content/uploads/2018/11/landscape-photography-tips-yosemite-valley-feature.jpg'
const portraitImageUrl = 'https://i0.wp.com/digital-photography-school.com/wp-content/uploads/2018/05/portrait-lighting-landscape-photography-dps-4.jpg?w=500&ssl=1'

// import logo from "./images/logo_w.png"
// import button from "./images/button.png"
const button = "data:image/png;base64,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"

export class ImageDemo extends Panel {
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
            (Environment as any).platform === "Android"
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
        label("Blur"),
        image({
          imageUrl: landscapeImageUrl,
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
        label("ScaleToFill"),
        image({
          imageUrl: landscapeImageUrl,
          width: 300,
          height: 300,
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
          imageUrl: landscapeImageUrl,
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
          imageUrl: landscapeImageUrl,
          width: 300,
          height: 300,
          border: {
            width: 2,
            color: Color.GRAY,
          },
          scaleType: ScaleType.ScaleAspectFill,
          layoutConfig: layoutConfig().just(),
        }),

        label("ScaleAspectFitLeftTop"),
        hlayout([
        image({
          imageUrl: landscapeImageUrl,
          width: 150,
          height: 150,
          border: {
            width: 2,
            color: Color.GRAY,
          },
          scaleType: ScaleType.ScaleAspectFitLeftTop,
          layoutConfig: layoutConfig().just(),
        }),
        image({
          imageUrl: portraitImageUrl,
          width: 150,
          height: 150,
          border: {
            width: 2,
            color: Color.GRAY,
          },
          scaleType: ScaleType.ScaleAspectFitLeftTop,
          layoutConfig: layoutConfig().just(),
        }),
        ], { space: 30 }),

        label("ScaleAspectFitLeftBottom"),
        hlayout([
        image({
          imageUrl: landscapeImageUrl,
          width: 150,
          height: 150,
          border: {
            width: 2,
            color: Color.GRAY,
          },
          scaleType: ScaleType.ScaleAspectFitLeftBottom,
          layoutConfig: layoutConfig().just(),
        }),
        image({
          imageUrl: portraitImageUrl,
          width: 150,
          height: 150,
          border: {
            width: 2,
            color: Color.GRAY,
          },
          scaleType: ScaleType.ScaleAspectFitLeftBottom,
          layoutConfig: layoutConfig().just(),
        }),
        ], { space: 30 }),

        label("ScaleAspectFitRightTop"),
        hlayout([
        image({
          imageUrl: landscapeImageUrl,
          width: 150,
          height: 150,
          border: {
            width: 2,
            color: Color.GRAY,
          },
          scaleType: ScaleType.ScaleAspectFitRightTop,
          layoutConfig: layoutConfig().just(),
        }),
        image({
          imageUrl: portraitImageUrl,
          width: 150,
          height: 150,
          border: {
            width: 2,
            color: Color.GRAY,
          },
          scaleType: ScaleType.ScaleAspectFitRightTop,
          layoutConfig: layoutConfig().just(),
        }),
        ], { space: 30 }),

        label("ScaleAspectFitRightBottom"),
        hlayout([
        image({
          imageUrl: landscapeImageUrl,
          width: 150,
          height: 150,
          border: {
            width: 2,
            color: Color.GRAY,
          },
          scaleType: ScaleType.ScaleAspectFitRightBottom,
          layoutConfig: layoutConfig().just(),
        }),
        image({
          imageUrl: portraitImageUrl,
          width: 150,
          height: 150,
          border: {
            width: 2,
            color: Color.GRAY,
          },
          scaleType: ScaleType.ScaleAspectFitRightBottom,
          layoutConfig: layoutConfig().just(),
        }),
        ], { space: 30 }),

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
        // coordinator(context).verticalScrolling({
        //   scrollable: it,
        //   scrollRange: {
        //     start: 0,
        //     end: 100,
        //   },
        //   target: "NavBar",
        //   changing: {
        //     name: "backgroundColor",
        //     start: Color.WHITE,
        //     end: Color.RED,
        //   },
        // });
        // coordinator(context).verticalScrolling({
        //   scrollable: it,
        //   scrollRange: {
        //     start: 0,
        //     end: 100,
        //   },
        //   target: imageView,
        //   changing: {
        //     name: "width",
        //     start: 10,
        //     end: 200,
        //   },
        // });
      })
      .into(rootView);
  }
  onDestroy() {
    modal(context).toast('onDestroy')
  }
}
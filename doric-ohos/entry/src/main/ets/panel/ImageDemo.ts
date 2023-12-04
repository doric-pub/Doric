import {
  AndroidAssetsResource,
  AssetsResource,
  Base64Resource,
  Color,
  coordinator,
  DrawableResource,
  gravity,
  Group,
  hlayout,
  image,
  Image,
  layoutConfig,
  LayoutSpec,
  log,
  MainBundleResource,
  modal,
  Panel,
  RemoteResource,
  ScaleType,
  scroller,
  text,
  vlayout
} from 'doric';
import { colors, label } from './utils';
import { img_base64 } from './image_base64';

const landscapeImageUrl = 'https://www.adorama.com/alc/wp-content/uploads/2018/11/landscape-photography-tips-yosemite-valley-feature.jpg'
const portraitImageUrl = 'https://i0.wp.com/digital-photography-school.com/wp-content/uploads/2018/05/portrait-lighting-landscape-photography-dps-4.jpg?w=500&ssl=1'

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
      // .also((it) => {
      //   coordinator(context).verticalScrolling({
      //     scrollable: it,
      //     scrollRange: {
      //       start: 0,
      //       end: 100,
      //     },
      //     target: "NavBar",
      //     changing: {
      //       name: "backgroundColor",
      //       start: Color.WHITE,
      //       end: Color.RED,
      //     },
      //   });
      //   coordinator(context).verticalScrolling({
      //     scrollable: it,
      //     scrollRange: {
      //       start: 0,
      //       end: 100,
      //     },
      //     target: imageView,
      //     changing: {
      //       name: "width",
      //       start: 10,
      //       end: 200,
      //     },
      //   });
      // })
      .into(rootView);
  }

  onDestroy() {
    modal(context).toast('onDestroy')
  }
}
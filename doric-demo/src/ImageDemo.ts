import { Group, Panel, List, text, gravity, Color, Stack, LayoutSpec, list, NativeCall, listItem, log, vlayout, Gravity, hlayout, Text, scroller, layoutConfig, image, IView, IVLayout, ScaleType, Image } from "doric";
import { colors, label } from "./utils";
import { img_base64 } from "./image_base64";
const imageUrl = 'https://img.zcool.cn/community/01e75b5da933daa801209e1ffa4649.jpg@1280w_1l_2o_100sh.jpg'

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
                    label('Gif'),
                    image({
                        imageUrl: "https://misc.aotu.io/ONE-SUNDAY/world-cup_2014_42.gif",
                        scaleType: ScaleType.ScaleToFill,
                        loadCallback: function (ret) {
                            log('this')
                            log('loadCallback', ret)
                        }
                    }),
                    label('APNG'),
                    image({
                        imageUrl: "https://misc.aotu.io/ONE-SUNDAY/world_cup_2014_42.png",
                        loadCallback: (ret) => {
                        }
                    }),
                    label('Animated WebP'),
                    image({
                        imageUrl: "https://p.upyun.com/demo/webp/webp/animated-gif-0.webp",
                        loadCallback: (ret) => {
                        }
                    }),
                    label('WebP'),
                    imageView = image({
                        imageUrl: "https://p.upyun.com/demo/webp/webp/jpg-0.webp",
                        loadCallback: (ret) => {
                            if (ret) {
                                imageView.width = ret.width
                                imageView.height = ret.height
                            }
                        }
                    }),
                    label('ScaleToFill'),
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
                        loadCallback: (ret) => {
                        }
                    }),
                    label('ScaleAspectFit'),
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
                    label('ScaleAspectFill'),
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
                    label('ImageBase64'),
                    image({
                        imageBase64: img_base64,
                        width: 300,
                        height: 300,
                        border: {
                            width: 2,
                            color: Color.GRAY,
                        },
                        scaleType: ScaleType.ScaleAspectFill,
                        layoutConfig: layoutConfig().just(),
                    }),
                ],
                {
                    layoutConfig: layoutConfig().most().configHeight(LayoutSpec.FIT),
                    gravity: gravity().center(),
                    space: 10,
                }),
            {
                layoutConfig: layoutConfig().most(),
            }
        ).in(rootView)
    }
}
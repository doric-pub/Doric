import { Group, Panel, coordinator, text, gravity, Color, LayoutSpec, log, vlayout, scroller, layoutConfig, image, ScaleType, Image, modal } from "doric";
import { colors, label } from "./utils";
import { img_base64 } from "./image_base64";

const imageUrl = 'https://img.zcool.cn/community/01e75b5da933daa801209e1ffa4649.jpg@1280w_1l_2o_100sh.jpg'

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
                    label('Animated WebP'),
                    image({
                        imageUrl: "https://p.upyun.com/demo/webp/webp/animated-gif-0.webp",
                        loadCallback: (ret) => {
                        }
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
        ).also(it => {
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
                }
            })
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
                }
            })
        }).in(rootView)
    }
    onDestroy() {
        modal(context).toast('onDestroy')
    }
}
import { Group, Panel, List, text, gravity, Color, Stack, LayoutSpec, list, NativeCall, listItem, log, vlayout, Gravity, hlayout, Text, scroller, layoutConfig, image, IView, IVLayout, ScaleType } from "doric";
import { colors, label } from "./utils";
const imageUrl = 'https://img.zcool.cn/community/01e75b5da933daa801209e1ffa4649.jpg@1280w_1l_2o_100sh.jpg'
@Entry
class ImageDemo extends Panel {
    build(rootView: Group): void {
        scroller(vlayout([
            text({
                text: "Image Demo",
                layoutConfig: layoutConfig().w(LayoutSpec.AT_MOST),
                textSize: 30,
                textColor: Color.WHITE,
                bgColor: colors[5],
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
            image({
                imageUrl: "https://p.upyun.com/demo/webp/webp/jpg-0.webp",
                loadCallback: (ret) => {
                }
            }),
            label('ScaleToFill'),
            image({
                imageUrl,
                width: 300,
                height: 300,
                border: {
                    width: 2,
                    color: Color.GRAY,
                },
                scaleType: ScaleType.ScaleToFill,
                layoutConfig: layoutConfig().exactly(),
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
                layoutConfig: layoutConfig().exactly(),
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
                layoutConfig: layoutConfig().exactly(),
            }),
        ]).apply({
            layoutConfig: layoutConfig().atmost().h(LayoutSpec.WRAP_CONTENT),
            gravity: gravity().center(),
            space: 10,
        } as IVLayout)).apply({
            layoutConfig: layoutConfig().atmost(),
        }).in(rootView)
    }
}
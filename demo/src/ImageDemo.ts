import { Group, Panel, List, text, gravity, Color, Stack, LayoutSpec, list, NativeCall, listItem, log, vlayout, Gravity, hlayout, Text, scroller, layoutConfig, image, IView, IVLayout, ScaleType } from "doric";
import { colors, label } from "./utils";
const imageUrl = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1574244792703&di=c49ed8cd284c367fa8f00065a85428bd&imgtype=0&src=http%3A%2F%2Fimg3.iqilu.com%2Fdata%2Fattachment%2Fforum%2F201308%2F21%2F201709zikkhkjh7dgfi9f0.jpg'
@Entry
class ImageDemo extends Panel {
    build(rootView: Group): void {
        scroller(vlayout([
            text({
                text: "Image Demo",
                layoutConfig: layoutConfig().w(LayoutSpec.AT_MOST),
                textSize: 30,
                textColor: Color.WHITE,
                bgColor: colors[1],
                textAlignment: gravity().center(),
                height: 50,
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
                    log('loadCallback', ret)
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
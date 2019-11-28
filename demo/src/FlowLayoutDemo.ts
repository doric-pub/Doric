import { Group, Panel, flowlayout, layoutConfig, FlowLayoutItem, text, Color, IFlowLayout, LayoutSpec, Gravity } from "doric";
import { colors, label } from "./utils";

const imageUrls = [
    'http://b.hiphotos.baidu.com/image/pic/item/908fa0ec08fa513db777cf78376d55fbb3fbd9b3.jpg',
    'http://f.hiphotos.baidu.com/image/pic/item/0e2442a7d933c8956c0e8eeadb1373f08202002a.jpg',
    'http://f.hiphotos.baidu.com/image/pic/item/b151f8198618367aa7f3cc7424738bd4b31ce525.jpg',
    'http://b.hiphotos.baidu.com/image/pic/item/0eb30f2442a7d9337119f7dba74bd11372f001e0.jpg',
    'http://a.hiphotos.baidu.com/image/h%3D300/sign=b38f3fc35b0fd9f9bf175369152cd42b/9a504fc2d5628535bdaac29e9aef76c6a6ef63c2.jpg',
    'http://h.hiphotos.baidu.com/image/pic/item/810a19d8bc3eb1354c94a704ac1ea8d3fd1f4439.jpg',
    'http://calonye.com/wp-content/uploads/2015/08/0-wx_fmtgiftpwebpwxfrom5wx_lazy1-9.gif',
    'http://hbimg.b0.upaiyun.com/ca29ea125b7f2d580f573e48eb594b1ef509757f34a08-m0hK45_fw658',
    'https://misc.aotu.io/ONE-SUNDAY/SteamEngine.png',
]
@Entry
class FlowDemo extends Panel {
    build(rootView: Group): void {
        flowlayout({
            layoutConfig: layoutConfig().atmost(),
            itemCount: 500,
            columnCount: 3,
            columnSpace: 10,
            rowSpace: 10,
            renderItem: (idx) => {
                return new FlowLayoutItem().apply({
                    bgColor: colors[idx % colors.length],
                    height: 50 + (idx % 3) * 20,
                    layoutConfig: layoutConfig().w(LayoutSpec.AT_MOST),
                }).also(it => {
                    it.addChild(text({
                        text: `${idx}`,
                        textColor: Color.WHITE,
                        textSize: 20,
                        layoutConfig: layoutConfig().wrap().a(Gravity.Center)
                    }))
                })
            },
        })
            .in(rootView)
    }
}
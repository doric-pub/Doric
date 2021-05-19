import { Group, Panel, stack, layoutConfig, scroller, Color, image, gravity, text } from "doric";

@Entry
class SimpleDemo extends Panel {
    build(rootView: Group) {
        let tabImage = image({
            imageRes: "qrc:/resource/main/pic_tab_welfare.png",
            layoutConfig: layoutConfig().fit().configMargin({
                top: 440,
            })
        })
        stack([
            scroller(stack([
                image({
                    imageRes: "qrc:/resource/main/pic_cp_gift_box.png",
                }),
                image({
                    imageRes: "qrc:/resource/main/icon_cp_gift_box_tips.png",
                    layoutConfig: layoutConfig().fit().configMargin({
                        top: 23,
                        right: 23
                    }).configAlignment(gravity().right())
                }),
                text({
                    text: " 购买并开启1个誓言礼盒\r\n即可获得1个邀请组CP的道具",
                    textColor: Color.parse("#66588D"),
                    fontStyle: "bold",
                    textSize: 14,
                    layoutConfig: layoutConfig().fit().configAlignment(gravity().centerX()).configMargin({
                        top: 110
                    })
                }),
                image({
                    imageRes: "qrc:/resource/main/pic_cp_invitation_2.png",
                    layoutConfig: layoutConfig().fit().configAlignment(gravity().centerX()).configMargin({
                        top: 166
                    })
                }),
                text({
                    text: "誓言邀请函",
                    textColor: Color.parse("#FF5C6F"),
                    fontStyle: "bold",
                    textSize: 16,
                    layoutConfig: layoutConfig().fit().configAlignment(gravity().centerX()).configMargin({
                        top: 300
                    })
                }),

                tabImage,
                stack([], {
                    layoutConfig: layoutConfig().just().configMargin({
                        top: 440,
                        left: 30
                    }),
                    width: 170,
                    height: 48,
                    onClick: () => {
                        tabImage.imageRes = "qrc:/resource/main/pic_tab_welfare.png"
                    }
                }),
                stack([], {
                    layoutConfig: layoutConfig().just().configMargin({
                        top: 440,
                        left: 200
                    }),
                    width: 170,
                    height: 48,
                    onClick: () => {
                        tabImage.imageRes = "qrc:/resource/main/pic_tab_condition.png"
                    }
                }),
            ], {
                width: 400,
                height: 759,
                layoutConfig: layoutConfig().just(),
                backgroundColor: Color.RED
            }), {
                layoutConfig: layoutConfig().most(),
            })
        ], {
            layoutConfig: layoutConfig().just(),
            width: 400,
            height: 600
        }).in(rootView)
    }
}
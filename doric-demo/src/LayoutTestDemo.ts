import { Panel, Group, vlayout, LayoutSpec, text, Color, gravity, stack, layoutConfig, scroller, Gravity, View } from "doric";

function grid(title: string, view: View) {
    return vlayout(
        [
            text({
                text: title,
                backgroundColor: Color.parse("#3498db"),
                textColor: Color.WHITE,
                textAlignment: Gravity.CenterX,
                layoutConfig: {
                    widthSpec: LayoutSpec.MOST,
                    heightSpec: LayoutSpec.JUST,
                },
                height: 30
            }),
            stack(
                [
                    view
                ],
                {
                    layoutConfig: layoutConfig().just(),
                    width: 300,
                    height: 300,
                    backgroundColor: Color.parse("#ecf0f1"),
                })
        ])

}
function content() {
    return stack(
        [],
        {
            layoutConfig: {
                widthSpec: LayoutSpec.JUST,
                heightSpec: LayoutSpec.JUST,
                margin: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10
                }
            },
            width: 100,
            height: 100,
            backgroundColor: Color.parse("#34495e")
        })
}

function case1() {
    return stack(
        [
            stack(
                [
                    content(),
                ],
                {
                    layoutConfig: layoutConfig().most(),
                })
        ],
        {
            layoutConfig: layoutConfig().fit(),
            padding: {
                left: 10, right: 10,
                top: 10, bottom: 10
            },
            backgroundColor: Color.parse("#9b59b6")
        }
    )
}

function case2() {
    return stack(
        [
            stack(
                [],
                {
                    layoutConfig: layoutConfig().most(),
                    backgroundColor: Color.parse("#1abc9c")
                }),
            content(),
        ],
        {
            layoutConfig: layoutConfig().fit(),
            padding: {
                left: 10, right: 10,
                top: 10, bottom: 10
            },
            backgroundColor: Color.parse("#9b59b6")
        }
    )
}

function case3() {
    return stack(
        [
            case1(),
        ],
        {
            layoutConfig: layoutConfig().fit(),
            padding: {
                left: 10, right: 10,
                top: 10, bottom: 10
            },
            backgroundColor: Color.parse("#2ecc71")
        }
    )
}

function case4() {
    return stack(
        [
            case2(),
        ],
        {
            layoutConfig: layoutConfig().fit(),
            padding: {
                left: 10, right: 10,
                top: 10, bottom: 10
            },
            backgroundColor: Color.parse("#2ecc71")
        }
    )
}

function case5() {
    return stack(
        [
            case3(),
        ],
        {
            layoutConfig: layoutConfig().fit(),
            padding: {
                left: 10, right: 10,
                top: 10, bottom: 10
            },
            backgroundColor: Color.parse("#3498db")
        }
    )
}


function case6() {
    return stack(
        [
            case3(),
        ],
        {
            layoutConfig: layoutConfig().fit(),
            padding: {
                left: 10, right: 10,
                top: 10, bottom: 10
            },
            backgroundColor: Color.parse("#3498db")
        }
    )
}
@Entry
class LayoutTest extends Panel {
    build(root: Group) {
        scroller(
            vlayout(
                [
                    grid(
                        "Stack fit -> most -> just",
                        case1(),
                    ),
                    grid(
                        "Stack fit -> most, just",
                        case2(),
                    ),
                    grid(
                        "Stack fit -> fit -> most -> just",
                        case3(),
                    ),
                    grid(
                        "Stack fit -> fit -> most, just",
                        case4(),
                    ),
                    grid(
                        "Stack fit -> fit -> fit -> most -> just",
                        case5(),
                    ),
                    grid(
                        "Stack fit -> fit -> fit -> most, just",
                        case6(),
                    ),
                ],
                {
                    layoutConfig: {
                        widthSpec: LayoutSpec.MOST,
                        heightSpec: LayoutSpec.FIT,
                    },
                    gravity: Gravity.CenterX,
                    space: 20,
                }),
            {
                layoutConfig: layoutConfig().most(),
            }).in(root)
    }
}
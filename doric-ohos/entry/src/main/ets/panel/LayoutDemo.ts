
import { Group, Panel, text, gravity, Color, LayoutSpec, vlayout, hlayout, scroller, layoutConfig, stack, Gravity } from "doric";

const colors = [
  "#f0932b",
  "#eb4d4b",
  "#6ab04c",
  "#e056fd",
  "#686de0",
  "#30336b",
]

function box(idx = 0) {
  return stack([], {
    width: 20,
    height: 20,
    layoutConfig: layoutConfig().just(),
    backgroundColor: Color.parse(colors[idx || 0])
  })
}

function boxStr(str: string, idx = 0) {
  return text({
    width: 20,
    height: 20,
    text: str,
    textColor: Color.WHITE,
    layoutConfig: layoutConfig().just(),
    backgroundColor: Color.parse(colors[idx || 0])
  })
}

function label(str: string) {
  return text({
    text: str,
    textSize: 16,
  })
}

export class LayoutDemo extends Panel {
  build(rootView: Group) {
    scroller(
      hlayout(
        [
        vlayout(
          [
          label("Horizontal Layout(Align to Top)"),
          hlayout(
            [
            box().apply({
              height: 20
            }),
            box().apply({
              height: 40
            }),
            box().apply({
              height: 60
            }),
            box().apply({
              height: 40
            }),
            box().apply({
              height: 20
            }),
            ],
            {
              space: 20
            }
          ),
          label("Horizontal Layout(Align to Bottom)"),
          hlayout(
            [
            box().apply({
              height: 20
            }),
            box().apply({
              height: 40
            }),
            box().apply({
              height: 60
            }),
            box().apply({
              height: 40
            }),
            box().apply({
              height: 20
            }),
            ],
            {
              space: 20,
              gravity: Gravity.Bottom
            }),
          label("Horizontal Layout(Align to Center)"),
          hlayout(
            [
            box().apply({
              height: 20
            }),
            box().apply({
              height: 40
            }),
            box().apply({
              height: 60
            }),
            box().apply({
              height: 40
            }),
            box().apply({
              height: 20
            }),
            ],
            {
              space: 20,
              gravity: Gravity.Center
            }
          ),
          label("Horizontal Layout(Weight)"),
          hlayout(
            [
            boxStr('weight=1', 3).apply({
              layoutConfig: {
                widthSpec: LayoutSpec.JUST,
                heightSpec: LayoutSpec.JUST,
                weight: 1,
              }
            }),
            box(2),
            box(4),
            ],
            {
              width: 200,
              height: 30,
              layoutConfig: {
                widthSpec: LayoutSpec.JUST,
                heightSpec: LayoutSpec.JUST,
              },
              backgroundColor: Color.parse('#eeeeee'),
              gravity: gravity().center(),
            }),
          hlayout(
            [
            box(3),
            boxStr('weight=1', 2).apply({
              layoutConfig: {
                widthSpec: LayoutSpec.JUST,
                heightSpec: LayoutSpec.JUST,
                weight: 1,
              }
            }),
            box(4),
            ],
            {
              width: 200,
              height: 30,
              layoutConfig: {
                widthSpec: LayoutSpec.JUST,
                heightSpec: LayoutSpec.JUST,
              },
              backgroundColor: Color.parse('#eeeeee'),
              gravity: gravity().center(),
            }
          ),
          hlayout(
            [
            box(3),
            box(2),
            boxStr('weight=1', 4).apply({
              layoutConfig: {
                widthSpec: LayoutSpec.JUST,
                heightSpec: LayoutSpec.JUST,
                weight: 1,
              }
            }),
            ],
            {
              width: 200,
              height: 30,
              layoutConfig: {
                widthSpec: LayoutSpec.JUST,
                heightSpec: LayoutSpec.JUST,
              },
              backgroundColor: Color.parse('#eeeeee'),
              gravity: gravity().center(),
            }
          ),
          hlayout(
            [
            boxStr('weight=1', 3).apply({
              layoutConfig: {
                widthSpec: LayoutSpec.JUST,
                heightSpec: LayoutSpec.JUST,
                weight: 1,
              }
            }),
            boxStr('weight=1', 2).apply({
              layoutConfig: {
                widthSpec: LayoutSpec.JUST,
                heightSpec: LayoutSpec.JUST,
                weight: 1,
              }
            }),
            box(4),
            ],
            {
              width: 200,
              height: 30,
              layoutConfig: {
                widthSpec: LayoutSpec.JUST,
                heightSpec: LayoutSpec.JUST,
              },
              backgroundColor: Color.parse('#eeeeee'),
              gravity: gravity().center(),
            }
          ),
          hlayout(
            [
            boxStr('weight=1', 3).apply({
              layoutConfig: {
                widthSpec: LayoutSpec.JUST,
                heightSpec: LayoutSpec.JUST,
                weight: 1,
              }
            }),
            boxStr('weight=1', 2).apply({
              layoutConfig: {
                widthSpec: LayoutSpec.JUST,
                heightSpec: LayoutSpec.JUST,
                weight: 1,
              }
            }),
            boxStr('weight=1', 4).apply({
              layoutConfig: {
                widthSpec: LayoutSpec.JUST,
                heightSpec: LayoutSpec.JUST,
                weight: 1,
              }
            }),
            ],
            {
              width: 200,
              height: 30,
              layoutConfig: {
                widthSpec: LayoutSpec.JUST,
                heightSpec: LayoutSpec.JUST,
              },
              backgroundColor: Color.parse('#eeeeee'),
              gravity: gravity().center(),
            }),
          ],
          {
            space: 20,
            gravity: Gravity.Center
          }
        ),
        vlayout(
          [
          label("Vertical Layout(Algin to Left)"),
          vlayout(
            [
            box(1).apply({
              width: 20
            }),
            box(1).apply({
              width: 40
            }),
            box(1).apply({
              width: 60
            }),
            box(1).apply({
              width: 40
            }),
            box(1).apply({
              width: 20
            }),
            ],
            {
              space: 20
            }),
          label("Vertical Layout(Algin to Right)"),
          vlayout(
            [
            box(1).apply({
              width: 20
            }),
            box(1).apply({
              width: 40
            }),
            box(1).apply({
              width: 60
            }),
            box(1).apply({
              width: 40
            }),
            box(1).apply({
              width: 20
            }),
            ],
            {
              space: 20,
              gravity: gravity().right(),
            }),
          label("Vertical Layout(Algin to Center)"),
          vlayout(
            [
            box(1).apply({
              width: 20
            }),
            box(1).apply({
              width: 40
            }),
            box(1).apply({
              width: 60
            }),
            box(1).apply({
              width: 40
            }),
            box(1).apply({
              width: 20
            }),
            ],
            {
              space: 20,
              gravity: gravity().center(),
            }),
          label("Vertical Layout(Weight)"),
          hlayout(
            [
            vlayout(
              [
              boxStr('weight=1', 3).apply({
                layoutConfig: {
                  widthSpec: LayoutSpec.MOST,
                  heightSpec: LayoutSpec.JUST,
                  weight: 1,
                },
              }),
              box(2).apply({
                layoutConfig: {
                  widthSpec: LayoutSpec.MOST,
                  heightSpec: LayoutSpec.JUST,
                }
              }),
              box(4).apply({
                layoutConfig: {
                  widthSpec: LayoutSpec.MOST,
                  heightSpec: LayoutSpec.JUST,
                }
              }),
              ],
              {
                width: 100,
                height: 200,
                layoutConfig: {
                  widthSpec: LayoutSpec.JUST,
                  heightSpec: LayoutSpec.JUST,
                },
                backgroundColor: Color.parse('#eeeeee'),
                gravity: gravity().center(),
              }),
            vlayout(
              [
              box(3).apply({
                layoutConfig: {
                  widthSpec: LayoutSpec.MOST,
                  heightSpec: LayoutSpec.JUST,
                },
              }),
              boxStr('weight=1', 2).apply({
                layoutConfig: {
                  widthSpec: LayoutSpec.MOST,
                  heightSpec: LayoutSpec.JUST,
                  weight: 1,
                }
              }),
              box(4).apply({
                layoutConfig: {
                  widthSpec: LayoutSpec.MOST,
                  heightSpec: LayoutSpec.JUST,
                }
              }),
              ],
              {
                width: 100,
                height: 200,
                layoutConfig: {
                  widthSpec: LayoutSpec.JUST,
                  heightSpec: LayoutSpec.JUST,
                },
                backgroundColor: Color.parse('#eeeeee'),
                gravity: gravity().center(),
              }),
            vlayout(
              [
              box(3).apply({
                layoutConfig: {
                  widthSpec: LayoutSpec.MOST,
                  heightSpec: LayoutSpec.JUST,
                },
              }),
              box(2).apply({
                layoutConfig: {
                  widthSpec: LayoutSpec.MOST,
                  heightSpec: LayoutSpec.JUST,
                },
              }),
              boxStr('weight=1', 4).apply({
                layoutConfig: {
                  widthSpec: LayoutSpec.MOST,
                  heightSpec: LayoutSpec.JUST,
                  weight: 1,
                }
              }),
              ],
              {
                width: 100,
                height: 200,
                layoutConfig: {
                  widthSpec: LayoutSpec.JUST,
                  heightSpec: LayoutSpec.JUST,
                },
                backgroundColor: Color.parse('#eeeeee'),
                gravity: gravity().center(),
              }),
            vlayout(
              [
              boxStr('weight=1', 3).apply({
                layoutConfig: {
                  widthSpec: LayoutSpec.MOST,
                  heightSpec: LayoutSpec.JUST,
                  weight: 1,
                },
              }),
              boxStr('weight=1', 2).apply({
                layoutConfig: {
                  widthSpec: LayoutSpec.MOST,
                  heightSpec: LayoutSpec.JUST,
                  weight: 1,
                }
              }),
              box(4).apply({
                layoutConfig: {
                  widthSpec: LayoutSpec.MOST,
                  heightSpec: LayoutSpec.JUST,
                }
              }),
              ],
              {
                width: 100,
                height: 200,
                layoutConfig: {
                  widthSpec: LayoutSpec.JUST,
                  heightSpec: LayoutSpec.JUST,
                },
                backgroundColor: Color.parse('#eeeeee'),
                gravity: gravity().center(),
              }),
            vlayout(
              [
              boxStr('weight=1', 3).apply({
                layoutConfig: {
                  widthSpec: LayoutSpec.MOST,
                  heightSpec: LayoutSpec.JUST,
                  weight: 1,
                },
              }),
              boxStr('weight=1', 2).apply({
                layoutConfig: {
                  widthSpec: LayoutSpec.MOST,
                  heightSpec: LayoutSpec.JUST,
                  weight: 1,
                }
              }),
              boxStr('weight=1', 4).apply({
                layoutConfig: {
                  widthSpec: LayoutSpec.MOST,
                  heightSpec: LayoutSpec.JUST,
                  weight: 1,
                }
              }),
              ],
              {
                width: 100,
                height: 200,
                layoutConfig: {
                  widthSpec: LayoutSpec.JUST,
                  heightSpec: LayoutSpec.JUST,
                },
                backgroundColor: Color.parse('#eeeeee'),
                gravity: gravity().center(),
              }),
            ],
            {
              space: 20
            }),
          ],
          {
            space: 20,
            gravity: Gravity.Left
          })
        ],
        {
          space: 20
        }),
      {
        layoutConfig: layoutConfig().most()
      }
    ).into(rootView)
  }
}
import { Panel, Group, layoutConfig, stack, list, listItem, scroller, hlayout } from "doric"
import { colors } from "./utils"

export class ScrollerInListDemo extends Panel {

  private data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

  build(root: Group) {
    stack(
      [
      list({
        itemCount: this.data.length,
        renderItem: (idx) => {
          if (idx % 3 === 0) {
            return listItem(
              scroller(
                hlayout([
                stack([]).apply({
                  layoutConfig: layoutConfig().justWidth().justHeight(),
                  height: 80,
                  width: 160,
                  backgroundColor: colors[idx % colors.length],
                }),
                stack([]).apply({
                  layoutConfig: layoutConfig().justWidth().justHeight(),
                  height: 80,
                  width: 160,
                  backgroundColor: colors[idx % colors.length],
                }),
                stack([]).apply({
                  layoutConfig: layoutConfig().justWidth().justHeight(),
                  height: 80,
                  width: 160,
                  backgroundColor: colors[idx % colors.length],
                }),
                stack([]).apply({
                  layoutConfig: layoutConfig().justWidth().justHeight(),
                  height: 80,
                  width: 160,
                  backgroundColor: colors[idx % colors.length],
                }),
                stack([]).apply({
                  layoutConfig: layoutConfig().justWidth().justHeight(),
                  height: 80,
                  width: 160,
                  backgroundColor: colors[idx % colors.length],
                }),
                stack([]).apply({
                  layoutConfig: layoutConfig().justWidth().justHeight(),
                  height: 80,
                  width: 160,
                  backgroundColor: colors[idx % colors.length],
                })
                ]).apply({
                  space: 10,
                })
              ).apply({
                layoutConfig: layoutConfig().mostWidth().justHeight(),
                height: 80,
              })
            )
          } else {
            return listItem(
              hlayout([
              stack([]).apply({
                layoutConfig: layoutConfig().mostWidth().justHeight(),
                height: 80,
                backgroundColor: colors[idx % colors.length],
              }),
              ]).apply({
                space: 10,
              })
            )
          }
        },
        layoutConfig: layoutConfig().most(),
      })
      ],
      {
        layoutConfig: layoutConfig().most()
      }
    ).into(root)
  }
}
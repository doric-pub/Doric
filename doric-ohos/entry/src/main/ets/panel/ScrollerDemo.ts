import { Color, Group, layoutConfig, LayoutSpec, Panel, scroller, vlayout } from 'doric';
import { label } from './utils';

export class ScrollerDemo extends Panel {
  build(rootView: Group): void {
    scroller(
      vlayout([
      scroller(
        vlayout(new Array(100).fill(1).map(e => label('Scroll Content'))),
        {
          layoutConfig: layoutConfig().just(),
          width: 300,
          height: 500,
          backgroundColor: Color.RED,
        }
      ),
      scroller(
        vlayout(new Array(100).fill(1).map(e => label('Scroll Content'))),
        {
          layoutConfig: layoutConfig().just(),
          width: 300,
          height: 500,
          backgroundColor: Color.BLUE,
        }
      )
      ]),
      {
        layoutConfig: layoutConfig().most().configHeight(LayoutSpec.JUST),
        height: 500,
        backgroundColor: Color.YELLOW,
      }
    ).into(rootView)
  }
}
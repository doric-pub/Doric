import { VLayout, Color as DoricColor } from 'doric';
import { Column } from './sandbox';
import { GroupNode } from './GroupNode';

export class VLayoutNode extends GroupNode<VLayout> {
    pop() {
        Column.pop();
    }

    blend(v: VLayout) {
        Column.create();
        Column.width('100%');
        Column.height(`50%`);
        Column.padding({ top: 100 });
        if (v.backgroundColor instanceof DoricColor) {
            Column.backgroundColor(v.backgroundColor.toModel());
        }
        if (v.onClick) {
            Column.onClick(v.onClick);
        }
    }
}

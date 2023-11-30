import { Root, Color as DoricColor } from 'doric';
import { Stack } from './sandbox';
import { GroupNode } from './GroupNode';



export class RootNode extends GroupNode<Root> {
    pop() {
        Stack.pop();
    }

    blend(v: Root) {
        Stack.create();
        Stack.width('100%');
        Stack.height(`100%`);
        if (v.backgroundColor instanceof DoricColor) {
            Stack.backgroundColor(v.backgroundColor.toModel());
        }
    }
}

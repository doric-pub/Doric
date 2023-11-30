import { View } from 'doric';
import { DoricContext, ViewStackProcessor } from './sandbox';


export abstract class DoricViewNode<T extends View> {
    context: DoricContext;

    elmtId?: number;
    view: T;

    firstRender = false;

    constructor(context: DoricContext, t: T) {
        this.context = context;
        this.view = t;
    }

    render() {
        const firstRender = this.elmtId === undefined;
        if (firstRender) {
            this.elmtId = ViewStackProcessor.AllocateNewElmetIdForNextComponent();
        }
        if (firstRender || this.isDirty()) {
            ViewStackProcessor.StartGetAccessRecordingFor(this.elmtId);
            if (firstRender || this.isDirty()) {
                this.blend(this.view);
            }
            if (!firstRender) {
                this.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
            if (!firstRender) {
                this.context.viewPU.finishUpdateFunc(this.elmtId);
            }
        }
        this.pushing(this.view);
        if (firstRender) {
            this.pop();
        }
    }

    isDirty() {
        return Object.keys(this.view.dirtyProps).filter(e => e !== "children" && e !== "subviews").length > 0;
    }

    abstract pushing(v: T);

    abstract blend(v: T);

    abstract pop();
}

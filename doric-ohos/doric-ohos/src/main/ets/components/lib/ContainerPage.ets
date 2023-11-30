import window from '@ohos.window';

import { ClassType } from "doric"
import { DoricPanel, ViewPU } from './Container';
import { initDoric } from './DoricInit';
import { DoricContext } from './sandbox';


initDoric();

// declare const Column: any;
//
// declare const ViewStackProcessor: any;
//
// declare const Stack: any;
//
// declare const Text: any;
//
// declare const ForEach: any;

@Component
export struct ContainerPage {
  clz: ClassType<DoricPanel>;
  extra: any
  @State simpleList: Array<Array<string>> = [['one', 'two', 'three'], ['one', 'two', 'three']];
  private doricContext: DoricContext

  initialRenderView() {
    const instance = new this.clz();
    this.doricContext = new DoricContext(this as any, instance);
    instance.context = this.doricContext;
    (instance.getRootView() as any).needUpdate = () => {
      console.log("Root needUpdate");
      (this as unknown as ViewPU).markNeedUpdate();
    }
    this.doricContext.callEntityMethod("__init__", this.extra)
    this.doricContext.callEntityMethod("__onCreate__")
    this.doricContext.callEntityMethod("__onShow__")
    window.getLastWindow(getContext(this)).then(window => {
      const rect = window.getWindowProperties().windowRect
      console.log("rect", rect.left, rect.top, rect.width, rect.height)
      this.doricContext.callEntityMethod("__build__", { width: rect.width, height: rect.height })
    });

    // {
    //   console.log("initialRender");
    //   const ViewStackProcessor = globalThis.ViewStackProcessor;
    //   (this as any).observeComponentCreation((elmtId, isInitialRender) => {
    //     ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
    //     Column.create();
    //     Column.width('100%');
    //     if (!isInitialRender) {
    //       Column.pop();
    //     }
    //     ViewStackProcessor.StopGetAccessRecording();
    //   });
    //   (this as any).observeComponentCreation((elmtId, isInitialRender) => {
    //     ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
    //     ForEach.create();
    //     const forEachItemGenFunction = _item => {
    //       const item = _item;
    //       (this as any).observeComponentCreation((elmtId, isInitialRender) => {
    //         ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
    //         Text.create(item);
    //         Text.fontSize(50);
    //         Text.onClick(() => {
    //           this.simpleList[0] += "11"
    //         });
    //         if (!isInitialRender) {
    //           Text.pop();
    //         }
    //         ViewStackProcessor.StopGetAccessRecording();
    //       });
    //       Text.pop();
    //     };
    //     (this as any).forEachUpdateFunction(elmtId, this.simpleList, forEachItemGenFunction, (s) => s, false, false);
    //     if (!isInitialRender) {
    //       ForEach.pop();
    //     }
    //     ViewStackProcessor.StopGetAccessRecording();
    //   });
    //   ForEach.pop();
    //   Column.pop();
    // }
    // @ts-ignore
    super.initialRenderView()
  }

  updateDirtyElements() {
    console.log("updateDirtyElements")

    // @ts-ignore
    super.updateDirtyElements()
    this.doricContext.hookAfterNativeCall()
  }

  onPageShow() {
    this.doricContext.callEntityMethod("__onShow__")
  }

  onPageHide() {
    this.doricContext.callEntityMethod("__onHidden__")
  }

  build() {
    // Column() {
    //   ForEach(this.simpleList, (item: string[]) => {
    //     ForEach(item, (itemE) => {
    //       Text(itemE).fontSize(50).onClick(() => {
    //         this.simpleList.push(['a','b'])
    //       })
    //     })
    //   })
    // }
    // .width('100%')
  }
}
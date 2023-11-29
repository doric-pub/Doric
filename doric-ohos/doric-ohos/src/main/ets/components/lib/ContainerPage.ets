import window from '@ohos.window';

import { ClassType } from "doric"
import { DoricPanel, ViewPU } from './Container';
import { initDoric } from './DoricInit';
import { DoricContext } from './sandbox';


initDoric();

@Component
export struct ContainerPage {
  clz: ClassType<DoricPanel>;
  extra: any
  private doricContext: DoricContext

  initialRenderView() {
    this.doricContext = new DoricContext(this as any)
    const instance = new this.clz();
    instance.context = this.doricContext;
    (instance.getRootView() as any).needUpdate = ()=>{
      console.log("Root needUpdate");
      (this as unknown as ViewPU).markNeedUpdate();
    }
    this.doricContext.entity = instance;
    this.doricContext.callEntityMethod("__init__", this.extra)
    this.doricContext.callEntityMethod("__onCreate__")
    this.doricContext.callEntityMethod("__onShow__")
    window.getLastWindow(getContext(this)).then(window => {
      const rect = window.getWindowProperties().windowRect
      console.log("rect", rect.left, rect.top, rect.width, rect.height)
      this.doricContext.callEntityMethod("__build__", { width: rect.width, height: rect.height })
    })
    // @ts-ignore
    super.initialRenderView()
  }

  updateDirtyElements(){
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
  }
}
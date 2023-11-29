
import { Panel } from 'doric';

export type DoricPanel = Panel

declare const ViewStackProcessor: any;
declare const Column: any;
declare const Row: any;
declare const Text: any;
declare const Image: any;
declare const Alignment: any;


declare function loadDocument(instance: ViewPU): void;

type UpdateFunc = (elmtId: number, isFirstRender: boolean) => void;

export declare abstract class ViewPU {
  constructor(parent: ViewPU, localStorage: any, elmtId?: number)

  markNeedUpdate(): void;
  findChildById(compilerAssignedUniqueChildId: string): ViewPU;
  syncInstanceId(): void;
  isFirstRender(): boolean;
  restoreInstanceId(): void;
  finishUpdateFunc(elmtId: number): void;
  getDeletedElemtIds(elmtIds: number[]): void; // caller allocates an empty Array<number>
  deletedElmtIdsHaveBeenPurged(elmtIds: number[]): void; // caller provides filled Array<number>
  isLazyItemRender(elmtId: number): boolean;
  setCardId(cardId: number): void;
  getCardId(): number;
  resetRecycleCustomNode(): void;

  markNeedUpdate(): void;
  updateDirtyElements(): void;
  protected abstract purgeVariableDependenciesOnElmtId(removedElmtId: number): void;
  abstract initialRender(): void;
  protected abstract rerender(): void;
  protected abstract updateRecycleElmtId(oldElmtId: number, newElmtId: number): void;

  abstract aboutToBeDeleted(): void;

  public observeComponentCreation(compilerAssignedUpdateFunc: UpdateFunc): void
}



export function injectViewPU(view: ViewPU) {
  view.initialRender = () => {
    view.observeComponentCreation((elmtId, isInitialRender) => {
      ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
      Column.create();
      Column.width('100%');
      Column.height(`100%`);
      Column.backgroundColor({ "id": 16777229, "type": 10001, params: [], "bundleName": "com.example.myapplication", "moduleName": "entry" });
      if (!isInitialRender) {
        Column.pop();
      }
      ViewStackProcessor.StopGetAccessRecording();
    });
    view.observeComponentCreation((elmtId, isInitialRender) => {
      ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
      Text.create(`Counter 11111`);
      Text.fontSize({ "id": 16777281, "type": 10002, params: [], "bundleName": "com.example.myapplication", "moduleName": "entry" });
      Text.fontColor({ "id": 16777239, "type": 10001, params: [], "bundleName": "com.example.myapplication", "moduleName": "entry" });
      Text.fontWeight(500);
      Text.align(Alignment.Center);
      if (!isInitialRender) {
        Text.pop();
      }
      ViewStackProcessor.StopGetAccessRecording();
    });
    Text.pop();
    view.observeComponentCreation((elmtId, isInitialRender) => {
      ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
      Text.create('Click to count');
      Text.fontSize("20fp");
      Text.fontColor("#FFFFFF");
      Text.fontWeight(500);
      Text.align(Alignment.Center);
      Text.margin({
        top: 20
      });
      Text.padding({
        left: 20, right: 20, top: 20, bottom: 20
      });
      Text.backgroundColor("#3498db");
      Text.onClick(() => {
        console.log("click1");
        //hilog.info(0x0000, 'osborn', 'click');
        //this.countData.counted++;
        //console.log("click2")
        //this.countData.counted++;
        // @ts-ignore
        view.markNeedUpdate()
      });
      if (!isInitialRender) {
        Text.pop();
      }
      ViewStackProcessor.StopGetAccessRecording();
    });
    Text.pop();
    Column.pop();
  }
}

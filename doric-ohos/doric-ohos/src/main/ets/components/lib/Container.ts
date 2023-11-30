import { Panel } from 'doric';

export type DoricPanel = Panel

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

  abstract initialRender(): void;

  abstract aboutToBeDeleted(): void;

  public observeComponentCreation(compilerAssignedUpdateFunc: UpdateFunc): void

  protected abstract purgeVariableDependenciesOnElmtId(removedElmtId: number): void;

  protected abstract rerender(): void;

  protected abstract updateRecycleElmtId(oldElmtId: number, newElmtId: number): void;
}


/**
 * ViewStackProcessor declaration
 *
 * Implemntation in C+ and exposed to JS
 *
 * all definitions in this file are framework internal
 */

declare class ViewStackProcessor {

  // make and return new elementId
  // will be used to create the next Component
  // this is used for first rneder case
  public static AllocateNewElmetIdForNextComponent(): number;

  // start Get access recording, and account all access to given elmtId
  // Note this can be a different elmtId than the one used to create new Component
  public static StartGetAccessRecordingFor(elmtId: number): void;

  /**
   * get the elmtId to which any get access shoudl be accounted
   * note this can be the same as the currently created elmtId (top of stack)
   * but also a different one (in case a whole subtree gets accounted its root elmtId)
   *
   * returns the elmtId given by StartGetAccessRecordingFor
   * -1 no access recording
   */
  public static GetElmtIdToAccountFor(): number;

  // Stop get access recording
  // also invalidates any reserved but unclaimed elmtId for Component creation
  public static StopGetAccessRecording(): void;


  /**
   * when nesting observeComponentCreation functions, such as in the case of
   * If, and the if branch creates a Text etc that requires an implict pop
   *  this function is needed after executing the inner observeComponentCreation
   *  and before read ViewStackProcessor.GetTopMostElementId(); on the outer one
   */
  public static ImplicitPopBeforeContinue(): void;

  /**
   * Called once JS update function has been executed, main component
   * and its wrapping components in the stack need to be 'Finished'
   * and then a local update be done on given main Element and
   * wrapping Elements
   * @param elmtId
   */
  public static FinishAndLocalUpdate(elmtId: number): void;


  /**
   * Returns a globally unique id from ElementRegister
   * JS signatire: MakeUniqueId() : number
   */
  public static MakeUniqueId(): number;

  /**
   * return true if the current Container uses PartialUpdate code path
   * see Container class foundation/arkui/ace_engine/frameworks/core/common/container.h
   * calls UsesNewPipeline static function
   */
  public static UsesNewPipeline();

  // Gets the framenode with tag and elmtId then pushes to the view stack.
  public static GetAndPushFrameNode(tag: string, elmtId: number): void;
}

export const GlobalViewStackProcessor: ViewStackProcessor = globalThis.ViewStackProcessor;

export function injectViewPU(view: ViewPU) {
  view.initialRender = () => {
    let count = 0;
    let myElmtId = 0;
    {
      const elmtId = ViewStackProcessor.AllocateNewElmetIdForNextComponent();
      console.log("elmtId", elmtId)
      ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
      Column.create();
      Column.width('100%');
      Column.height(`100%`);
      Column.padding({ top: 100 });
      Column.backgroundColor({
        "id": 16777229,
        "type": 10001,
        params: [],
        "bundleName": "com.example.myapplication",
        "moduleName": "entry"
      });
      ViewStackProcessor.StopGetAccessRecording();
    }

    {
      const elmtId = ViewStackProcessor.AllocateNewElmetIdForNextComponent();
      console.log("elmtId", elmtId)
      myElmtId = elmtId
      ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
      Text.create(`Counter ${count}`);
      Text.fontSize("20fp");
      Text.fontColor("#000000");
      Text.fontWeight(500);
      Text.align(Alignment.Center);
      Text.margin({
        top: 20
      });
      ViewStackProcessor.StopGetAccessRecording();
    }

    Text.pop();
    {
      const elmtId = ViewStackProcessor.AllocateNewElmetIdForNextComponent();
      console.log("elmtId", elmtId)
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
        console.log("click1", myElmtId);
        //hilog.info(0x0000, 'osborn', 'click');
        //this.countData.counted++;
        //console.log("click2")
        //this.countData.counted++;
        // @ts-ignore
        // view.markNeedUpdate()
        count++;

        ViewStackProcessor.StartGetAccessRecordingFor(myElmtId);
        Text.create(`Counter ${count}`);
        Text.fontSize("20fp");
        Text.fontColor("#000000");
        Text.fontWeight(500);
        Text.align(Alignment.Center);
        Text.margin({
          top: 20
        });
        Text.pop()
        ViewStackProcessor.StopGetAccessRecording();
        view.finishUpdateFunc(myElmtId)
      });
      ViewStackProcessor.StopGetAccessRecording();
    }
    Text.pop();
    Column.pop();
  }
}

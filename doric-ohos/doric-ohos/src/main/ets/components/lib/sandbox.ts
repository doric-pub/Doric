import {
  BridgeContext,
  uniqueId,
  ClassType,
  View,
  VLayout,
  Group,
  Root,
  Text as DoricText,
  Color as DoricColor,
} from 'doric';
import { DoricPanel, ViewPU } from './Container';


function wrapFunction(name: string, func: Function, thisArgument: any) {
  return function () {
    const args = [];
    for (let i = 0;i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    console.log("Call " + name, args.map(e => e.toString()).join(","));
    return Reflect.apply(func, thisArgument, args);
  }
}

function getGlobalObject(name: string) {
  return new Proxy(Reflect.get(globalThis, name), {
    get(target, p, receiver) {
      const raw = Reflect.get(target, p, receiver);
      if (typeof raw === 'function') {
        return wrapFunction(`${name}-${p.toString()}`, raw, target)
      }
      return raw;
    }
  })
}

const ForEach = getGlobalObject("ForEach");

const Column = getGlobalObject("Column");

const Stack = getGlobalObject("Stack");

const Text = getGlobalObject("Text");

const ViewStackProcessor = getGlobalObject("ViewStackProcessor");

function toString(message: any) {
  if (message instanceof Function) {
    return message.toString()
  } else if (message instanceof Object) {
    try {
      return JSON.stringify(message)
    } catch (e) {
      return message.toString()
    }
  } else if (message === undefined) {
    return "undefined"
  } else {
    return message.toString()
  }
}

export function log(...args: any) {
  let out = ""
  for (let i = 0; i < arguments.length; i++) {
    if (i > 0) {
      out += ','
    }
    out += toString(arguments[i])
  }
  console.log(out)
}

export function loge(...message: any) {
  let out = ""
  for (let i = 0; i < arguments.length; i++) {
    if (i > 0) {
      out += ','
    }
    out += toString(arguments[i])
  }
  console.error(out)
}

export function logw(...message: any) {
  let out = ""
  for (let i = 0; i < arguments.length; i++) {
    if (i > 0) {
      out += ','
    }
    out += toString(arguments[i])
  }
  console.warn(out)
}


export class DoricContext implements BridgeContext {
  entity: any

  id: string

  callbacks: Map<string, {
    resolve: Function,
    reject: Function,
    retained?: boolean
  }> = new Map

  viewPU: ViewPU

  pluginInstances: Map<string, DoricPlugin> = new Map

  rootNode: RootNode

  constructor(viewPU: ViewPU, entity: any, id?: string) {
    this.id = id??uniqueId("Context")
    this.viewPU = viewPU
    this.entity = entity
    this.rootNode = new RootNode(this, (entity as DoricPanel).getRootView())
    this.rootNode.render()
  }

  hookBeforeNativeCall() {
    if (this.entity && Reflect.has(this.entity, 'hookBeforeNativeCall')) {
      Reflect.apply(Reflect.get(this.entity, 'hookBeforeNativeCall'), this.entity, [])
    }
  }

  hookAfterNativeCall() {
    if (this.entity && Reflect.has(this.entity, 'hookAfterNativeCall')) {
      Reflect.apply(Reflect.get(this.entity, 'hookAfterNativeCall'), this.entity, [])
    }
  }

  async callNative(namespace: string, method: string, args?: any) {
    try {
      let plugin = this.pluginInstances.get(namespace);
      if (!plugin) {
        const pluginClz = pluginMetaInfo.get(namespace);
        if (!pluginClz) {
          throw (`Plugin ${namespace} is not implemented`)
          return
        }
        plugin = new pluginClz(this);
        this.pluginInstances.set(namespace, plugin);
      }

      const methodFunc = Reflect.get(plugin, method);
      if (!methodFunc) {
        throw (`Plugin ${namespace}'s method: ${method} is not implemented`)
      }
      return Reflect.apply(methodFunc, plugin, [args])
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  register(instance: Object) {
    this.entity = instance
  }

  function2Id(func: Function) {
    const functionId = uniqueId('function')
    this.callbacks.set(functionId, {
      resolve: func,
      reject: () => {
        loge("This should not be called")
      },
      retained: true,
    })
    return functionId
  }

  removeFuncById(funcId: string) {
    this.callbacks.delete(funcId)
  }

  callEntityMethod(methodName: string, args?: any) {
    if (this.entity === undefined) {
      loge(`Cannot find holder for context id:${this.id}`)
      return
    }
    if (Reflect.has(this.entity, methodName)) {
      const argumentsList: any = []
      for (let i = 1; i < arguments.length; i++) {
        argumentsList.push(arguments[i])
      }
      this.hookBeforeNativeCall()
      const ret = Reflect.apply(Reflect.get(this.entity, methodName), this.entity, argumentsList)
      return ret
    } else {
      loge(`Cannot find method for context id:${this.id},method name is:${methodName}`)
    }
  }
}

export abstract class DoricPlugin {
  context: DoricContext

  constructor(context: DoricContext) {
    this.context = context
  }
}

export abstract class DoricViewNode<T extends View> {
  context: DoricContext

  elmtId?: number
  view: T

  firstRender = false;

  constructor(context: DoricContext, t: T) {
    this.context = context
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
        this.context.viewPU.finishUpdateFunc(this.elmtId)
      }
    }
    this.pushing(this.view);
    if (firstRender) {
      this.pop();
    }
  }

  isDirty() {
    return Object.keys(this.view.dirtyProps).filter(e => e !== "children" && e !== "subviews").length > 0
  }

  abstract pushing(v: T)

  abstract blend(v: T)

  abstract pop()
}

const pluginMetaInfo: Map<string, ClassType<DoricPlugin>> = new Map


const viewNodeMetaInfo: Map<string, ClassType<DoricViewNode<any>>> = new Map


export function registerDoricPlugin(name: string, pluginClz: ClassType<DoricPlugin>) {
  pluginMetaInfo.set(name, pluginClz)
}

export function registerDoricViewNode(name: string, pluginClz: ClassType<DoricViewNode<any>>) {
  viewNodeMetaInfo.set(name, pluginClz)
}

export function createDoricViewNode<T extends View>(context: DoricContext, t: T): DoricViewNode<T> {

  const viewNodeClz = viewNodeMetaInfo.get(t.viewType());
  if (!viewNodeClz) {
    throw `Cannot find view node for ${t.viewType()}}`
  }

  return new viewNodeClz(context, t)
}


export abstract class GroupNode<T extends Group> extends DoricViewNode<T> {
  childNodes: Map<string, DoricViewNode<any>> = new Map
  forEachElmtId?: number

  pushing(v: T) {
    const firstRender = this.forEachElmtId === undefined;
    if (!firstRender && !this.view.isDirty()) {
      return;
    }


    if (firstRender) {
      this.forEachElmtId = ViewStackProcessor.AllocateNewElmetIdForNextComponent();
    }
    v.children.forEach((child) => {
      let childNode = this.childNodes.get(child.viewId)
      if (childNode) {
        childNode.render()
      }
    })

    ViewStackProcessor.StartGetAccessRecordingFor(this.forEachElmtId);
    ForEach.create();
    const children = v.children
    let diffIndexArray = []; // New indexes compared to old one.
    let newIdArray = children.map(e => e.viewId);
    let idDuplicates = [];

    ForEach.setIdArray(this.forEachElmtId, newIdArray, diffIndexArray, idDuplicates);

    diffIndexArray.forEach((idx) => {
      const child = children[idx];
      let childNode = this.childNodes.get(child.viewId)
      if (!childNode) {
        childNode = createDoricViewNode(this.context, child)
        this.childNodes.set(child.viewId, childNode)
      }
      ForEach.createNewChildStart(childNode.view.viewId, this.context.viewPU);
      childNode.render();
      ForEach.createNewChildFinish(childNode.view.viewId, this.context.viewPU);
    })

    if (!firstRender) {
      ForEach.pop();
    }
    ViewStackProcessor.StopGetAccessRecording();
    if (firstRender) {
      ForEach.pop();
    } else {
      this.context.viewPU.finishUpdateFunc(this.forEachElmtId)
    }
  }
}


class VLayoutNode extends GroupNode<VLayout> {
  pop() {
    Column.pop()
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
      Column.onClick(v.onClick)
    }
  }
}


export class RootNode extends GroupNode<Root> {
  pop() {
    Stack.pop()
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

declare const Alignment: any;

class TextNode extends DoricViewNode<DoricText> {
  pushing(v: DoricText) {
  }

  pop() {
    Text.pop()
  }

  blend(v: DoricText) {
    Text.create(v.text);
    Text.fontSize("20fp");
    Text.fontColor("#000000");
    Text.fontWeight(500);
    Text.align(Alignment.Center);
    Text.margin({
      top: 20
    });
    if (v.onClick) {
      Text.onClick(v.onClick)
    }
  }
}

viewNodeMetaInfo.set("Root", RootNode)

viewNodeMetaInfo.set("VLayout", VLayoutNode)

viewNodeMetaInfo.set("Text", TextNode)

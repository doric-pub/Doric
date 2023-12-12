import { BridgeContext, layoutConfig, stack, uniqueId, } from 'doric';
import { DoricPanel, ViewPU } from './Container';
import { createDoricPlugin } from './Registry';
import { PopoverRootNode, RootNode } from '../node/StackNode';

export const Alignment = getGlobalObject("Alignment");

function wrapFunction(name: string, func: Function, thisArgument: any) {
  return function () {
    const args = [];
    for (let i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    console.log("Call " + name, args.map(e => e.toString()).join(","));
    return Reflect.apply(func, thisArgument, args);
  }
}

export function getGlobalObject(name: string) {
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


export const ViewStackProcessor = getGlobalObject("ViewStackProcessor");

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

  popoverRootNode: PopoverRootNode

  constructor(viewPU: ViewPU, entity: any, id?: string) {
    this.id = id ?? uniqueId("Context")
    this.viewPU = viewPU
    this.entity = entity
    this.rootNode = new RootNode(this, (entity as DoricPanel).getRootView())
    this.rootNode.render()

    this.popoverRootNode = new PopoverRootNode(this, stack([], {
      layoutConfig: layoutConfig().most(),
    }))
    this.popoverRootNode.render()
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
        plugin = createDoricPlugin(this, namespace)
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

  targetViewNode(id: string) {
    if (id == this.rootNode.view.viewId) {
      return this.rootNode;
    }
    for (const key in this.popoverRootNode.childNodes.keys()) {
      if (id === this.popoverRootNode.childNodes.get(id).view.viewId) {
        return this.popoverRootNode.childNodes.get(id);
      }
    }
  }
}

export abstract class DoricPlugin {
  context: DoricContext

  constructor(context: DoricContext) {
    this.context = context
  }
}


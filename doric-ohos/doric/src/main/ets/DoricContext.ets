/*
 * Copyright [2019] [Doric.Pub]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  prepareContext,
  destroyContext,
  callEntityMethod
} from 'libdoric.so'
import { DoricNavigatorDelegate, DoricNavBarDelegate, DoricStatusBarDelegate } from './utils/DoricDelegates'
import { DoricContextRef, DoricRootNode, DoricViewNode } from './shader/DoricViewNode'
import { DoricNodeModel } from './shader/DoricNodeModel'
import { hilog } from '@kit.PerformanceAnalysisKit'

const TAG = 'DoricContext'
const DOMAIN = 0x8000

/**
 * DoricContextManager - Manages all active DoricContext instances.
 *
 * Aligned with iOS DoricContextManager.
 */
export class DoricContextManager {
  private static instance_: DoricContextManager | undefined = undefined
  private counter_: number = 0
  private contextMap_: Map<string, DoricContext> = new Map()

  static getInstance(): DoricContextManager {
    if (!DoricContextManager.instance_) {
      DoricContextManager.instance_ = new DoricContextManager()
    }
    return DoricContextManager.instance_!
  }

  createContext(context: DoricContext, script: string, source: string): string {
    this.counter_++
    const contextId = this.counter_.toString()
    context.contextId = contextId
    this.contextMap_.set(contextId, context)
    prepareContext(contextId, script, source)
    return contextId
  }

  destroyContext(context: DoricContext): void {
    const contextId = context.contextId
    this.contextMap_.delete(contextId)
    destroyContext(contextId)
  }

  getContext(contextId: string): DoricContext | undefined {
    return this.contextMap_.get(contextId)
  }

  getAliveContexts(): DoricContext[] {
    const result: DoricContext[] = []
    this.contextMap_.forEach((ctx) => {
      result.push(ctx)
    })
    return result
  }
}

class DoricInitialParams {
  width: number = 0
  height: number = 0
}

/**
 * DoricContext - Execution context for a single Doric panel.
 */
export class DoricContext implements DoricContextRef {
  contextId: string = ''
  source: string = ''
  script: string = ''
  extra: string = ''
  destroyed: boolean = false

  navigator: DoricNavigatorDelegate | undefined = undefined
  navBar: DoricNavBarDelegate | undefined = undefined
  statusBar: DoricStatusBarDelegate | undefined = undefined

  rootNode: DoricRootNode

  onRenderCallback: (() => void) | undefined = undefined

  private headNodes_: Map<string, Map<string, DoricViewNode>> = new Map()

  private pluginInstanceMap_: Map<string, Object> = new Map()

  private initialParams_: DoricInitialParams = new DoricInitialParams()

  constructor(script: string, source: string, extra?: string) {
    this.script = script
    this.source = source

    this.rootNode = new DoricRootNode(this)

    DoricContextManager.getInstance().createContext(this, script, source)

    if (extra !== undefined && extra.length > 0) {
      this.extra = extra
      this.callEntity('__init__', extra)
    }
    this.callEntity('__onCreate__')
  }

  callEntity(method: string, ...args: (string | number | boolean | string[])[]): string {
    if (this.destroyed) {
      return ''
    }
    return callEntityMethod(this.contextId, method, ...args)
  }

  build(width: number, height: number): void {
    this.initialParams_.width = width
    this.initialParams_.height = height
    this.callEntity('__build__', JSON.stringify(this.initialParams_))
  }

  onShow(): void {
    this.callEntity('__onShow__')
  }

  onHidden(): void {
    this.callEntity('__onHidden__')
  }

  onEnvChanged(): void {
    this.callEntity('__onEnvChanged__')
  }

  onRenderFinished(): void {
    if (this.onRenderCallback) {
      this.onRenderCallback()
    }
  }

  getRootNodeModel(): DoricNodeModel {
    return this.rootNode.nodeModel
  }

  targetViewNode(viewId: string): DoricViewNode | undefined {
    if (this.rootNode.viewId === viewId) {
      return this.rootNode
    }
    let found: DoricViewNode | undefined = undefined
    this.headNodes_.forEach((nodeMap: Map<string, DoricViewNode>) => {
      if (found === undefined) {
        const node = nodeMap.get(viewId)
        if (node !== undefined) {
          found = node
        }
      }
    })
    return found
  }

  addHeadNode(type: string, node: DoricViewNode): void {
    let nodeMap = this.headNodes_.get(type)
    if (nodeMap === undefined) {
      nodeMap = new Map()
      this.headNodes_.set(type, nodeMap)
    }
    nodeMap.set(node.viewId, node)
  }

  removeHeadNode(type: string, viewId: string): void {
    const nodeMap = this.headNodes_.get(type)
    if (nodeMap !== undefined) {
      nodeMap.delete(viewId)
    }
  }

  getHeadNodes(type: string): Map<string, DoricViewNode> | undefined {
    return this.headNodes_.get(type)
  }

  getPlugin(module: string): Object | undefined {
    return this.pluginInstanceMap_.get(module)
  }

  setPlugin(module: string, plugin: Object): void {
    this.pluginInstanceMap_.set(module, plugin)
  }

  reload(script: string): void {
    destroyContext(this.contextId)

    this.script = script
    this.destroyed = false

    this.rootNode.viewId = ''
    this.rootNode.clearSubModel()

    this.pluginInstanceMap_.clear()

    prepareContext(this.contextId, script, this.source)

    if (this.extra.length > 0) {
      this.callEntity('__init__', this.extra)
    }
    this.callEntity('__onCreate__')
    this.build(this.initialParams_.width, this.initialParams_.height)
    this.onShow()
  }

  teardown(): void {
    if (this.destroyed) {
      return
    }
    this.destroyed = true
    this.callEntity('__onDestroy__')
    this.pluginInstanceMap_.clear()
    this.headNodes_.clear()
    DoricContextManager.getInstance().destroyContext(this)
  }
}

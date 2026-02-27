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

import { DoricNativePlugin, DoricPluginMethodHandler, DoricThreadMode } from './DoricNativePlugin'
import { DoricPromise } from './DoricPromise'
import { DoricContext } from '../DoricContext'
import { DoricViewNode, DoricSuperNode, DoricRootNode } from '../shader/DoricViewNode'
import { hilog } from '@kit.PerformanceAnalysisKit'

const TAG = 'DoricShaderPlugin'
const DOMAIN = 0x8000

export class DoricShaderPlugin extends DoricNativePlugin {
  constructor(context: DoricContext) {
    super(context)
  }

  /**
   * All ShaderPlugin methods run on UI thread.
   */
  threadMode(_method: string): DoricThreadMode {
    return DoricThreadMode.UI
  }

  /**
   * Register method handlers.
   */
  getMethodMap(): Map<string, DoricPluginMethodHandler> {
    const map = new Map<string, DoricPluginMethodHandler>()

    map.set('render', (argument: string, promise: DoricPromise): void => {
      this.render(argument, promise)
    })

    map.set('command', (argument: string, promise: DoricPromise): void => {
      this.command(argument, promise)
    })

    return map
  }

  /**
   * Render a view node tree from the JS model.
   */
  private render(argument: string, promise: DoricPromise): void {
    if (argument === undefined || argument === null || argument.length === 0) {
      return
    }

    if (this.doricContext === undefined || this.doricContext.destroyed) {
      return
    }

    hilog.debug(DOMAIN, TAG, 'render: contextId=%{public}s', this.doricContext.contextId)

    let model: Record<string, Object>
    try {
      model = JSON.parse(argument) as Record<string, Object>
    } catch (e) {
      hilog.error(DOMAIN, TAG, 'render: failed to parse argument: %{public}s', (e as Error).message)
      return
    }

    const viewId = model['id'] as string
    const nodeType = model['type'] as string
    const props = model['props'] as Record<string, Object>

    const rootNode = this.doricContext.rootNode

    if ((rootNode.viewId === undefined || rootNode.viewId.length === 0) && nodeType === 'Root') {
      rootNode.viewId = viewId
      rootNode.nodeModel.viewId = viewId
      rootNode.blend(props)
      rootNode.requestLayout()
    } else {
      const viewNode = this.doricContext.targetViewNode(viewId)
      if (viewNode !== undefined) {
        viewNode.blend(props)
        viewNode.requestLayout()
      } else {
        hilog.warn(DOMAIN, TAG, 'render: viewNode not found for id: %{public}s', viewId)
      }
    }

    promise.resolve()
  }

  /**
   * Dispatch a command to a specific view node.
   */
  private command(argument: string, promise: DoricPromise): void {
    if (this.doricContext === undefined || this.doricContext.destroyed) {
      return
    }

    let model: Record<string, Object>
    try {
      model = JSON.parse(argument) as Record<string, Object>
    } catch (e) {
      hilog.error(DOMAIN, TAG, 'command: failed to parse argument: %{public}s', (e as Error).message)
      promise.reject(JSON.stringify('Failed to parse command argument'))
      return
    }

    const viewIds = model['viewIds'] as string[]
    const name = model['name'] as string
    const args = model['args']
    const argsStr = args !== undefined && args !== null ? JSON.stringify(args) : ''

    hilog.debug(DOMAIN, TAG, 'command: name=%{public}s, viewIds=%{public}s',
      name, JSON.stringify(viewIds))

    let viewNode: DoricViewNode | undefined = undefined

    if (viewIds !== undefined && viewIds.length > 0) {
      for (const viewId of viewIds) {
        if (viewNode === undefined) {
          viewNode = this.doricContext.targetViewNode(viewId)
        } else {
          if (viewNode instanceof DoricSuperNode) {
            viewNode = (viewNode as DoricSuperNode).subNodeWithViewId(viewId)
          }
        }
      }
    }

    if (viewNode === undefined) {
      promise.reject(JSON.stringify('Cannot find opposite view'))
    } else {
      const found = viewNode.callMethod(name, argsStr, promise)
      if (!found) {
        const errMsg = `Cannot find plugin method in node:${viewNode.type}, method:${name}`
        hilog.error(DOMAIN, TAG, 'command: %{public}s', errMsg)
        promise.reject(JSON.stringify(errMsg))
      }
    }
  }
}

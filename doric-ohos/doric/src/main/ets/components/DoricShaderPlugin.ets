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

/**
 * DoricShaderPlugin - The core plugin for rendering view nodes.
 *
 * Aligned with iOS DoricShaderPlugin.m:
 *   - render:(NSDictionary *)argument withPromise:(DoricPromise *)promise
 *   - command:(NSDictionary *)argument withPromise:(DoricPromise *)promise
 *
 * Aligned with Android ShaderPlugin.java:
 *   - @DoricPlugin(name = "shader")
 *   - render(JSObject, DoricPromise)
 *   - command(JSObject, DoricPromise)
 *
 * The ShaderPlugin is responsible for:
 *   1. render: Receiving the view model from JS and blending it into the native view tree
 *   2. command: Dispatching method calls to specific view nodes
 */
import { DoricNativePlugin, DoricPluginMethodHandler, DoricThreadMode } from './DoricPlugin'
import { DoricPromise } from './DoricPromise'
import { DoricContext } from './DoricContext'
import { DoricViewNode, DoricSuperNode, DoricRootNode } from './DoricViewNode'
import { hilog } from '@kit.PerformanceAnalysisKit'

const TAG = 'DoricShaderPlugin'
const DOMAIN = 0x8000

export class DoricShaderPlugin extends DoricNativePlugin {
  constructor(context: DoricContext) {
    super(context)
  }

  /**
   * All ShaderPlugin methods run on UI thread.
   * Aligned with iOS: - (DoricThreadMode)threadMode:(NSString *)method { return DoricThreadModeUI; }
   * Aligned with Android: @DoricMethod(thread = ThreadMode.UI)
   */
  threadMode(_method: string): DoricThreadMode {
    return DoricThreadMode.UI
  }

  /**
   * Register method handlers.
   * Aligned with iOS runtime method dispatch / Android @DoricMethod annotation.
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
   *
   * Aligned with iOS DoricShaderPlugin.render:withPromise:
   *
   * The argument is a JSON object with structure:
   * {
   *   "id": "<viewId>",
   *   "type": "Root" | "<nodeType>",
   *   "props": { ... }
   * }
   *
   * Logic:
   * 1. If rootNode has no viewId and type is "Root":
   *    - Assign viewId to rootNode
   *    - Blend props into rootNode
   *    - Request layout on rootNode
   * 2. Otherwise:
   *    - Find the target viewNode by viewId
   *    - Blend props into it
   *    - If it's not the rootNode, apply layout
   *    - Request layout
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
      // First render: assign viewId to root and blend
      // Aligned with iOS: self.doricContext.rootNode.viewId = viewId; [self.doricContext.rootNode blend:props];
      rootNode.viewId = viewId
      rootNode.nodeModel.viewId = viewId
      rootNode.blend(props)
      rootNode.requestLayout()
    } else {
      // Subsequent render: find target node and blend
      // Aligned with iOS: DoricViewNode *viewNode = [self.doricContext targetViewNode:viewId];
      const viewNode = this.doricContext.targetViewNode(viewId)
      if (viewNode !== undefined) {
        viewNode.blend(props)
        if (!(viewNode instanceof DoricRootNode)) {
          // For non-root nodes, apply layout locally
          // Aligned with iOS: [viewNode.view.doricLayout apply];
        }
        viewNode.requestLayout()
      } else {
        hilog.warn(DOMAIN, TAG, 'render: viewNode not found for id: %{public}s', viewId)
      }
    }

    promise.resolve()
  }

  /**
   * Dispatch a command to a specific view node.
   *
   * Aligned with iOS DoricShaderPlugin.command:withPromise:
   * Aligned with Android ShaderPlugin.command(JSObject, DoricPromise)
   *
   * The argument is a JSON object with structure:
   * {
   *   "viewIds": ["<viewId1>", "<viewId2>", ...],
   *   "name": "<methodName>",
   *   "args": <any>
   * }
   *
   * Logic:
   * 1. Walk the viewIds array to find the target node:
   *    - First viewId: lookup via doricContext.targetViewNode()
   *    - Subsequent viewIds: drill into SuperNode children
   * 2. If found, call the named method on the node
   * 3. If not found, reject the promise
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

    // Walk the viewId chain to find the target node
    // Aligned with iOS: for (NSString *viewId in viewIds) { ... }
    // Aligned with Android: for (JSValue value : viewIds) { ... }
    let viewNode: DoricViewNode | undefined = undefined

    if (viewIds !== undefined && viewIds.length > 0) {
      for (const viewId of viewIds) {
        if (viewNode === undefined) {
          // First level: find from context's registered nodes
          viewNode = this.doricContext.targetViewNode(viewId)
        } else {
          // Deeper levels: find from super node's children
          if (viewNode instanceof DoricSuperNode) {
            viewNode = (viewNode as DoricSuperNode).subNodeWithViewId(viewId)
          }
        }
      }
    }

    if (viewNode === undefined) {
      // Aligned with iOS: [promise reject:@"Cannot find opposite view"];
      // Aligned with Android: doricPromise.reject(new JavaValue("Cannot find opposite view"));
      promise.reject(JSON.stringify('Cannot find opposite view'))
    } else {
      // Dispatch the method call to the view node
      // Aligned with iOS: [self findClass:... target:viewNode method:name promise:promise argument:args];
      // Aligned with Android: method.invoke(targetViewNode, ...)
      const found = viewNode.callMethod(name, argsStr, promise)
      if (!found) {
        const errMsg = `Cannot find plugin method in node:${viewNode.type}, method:${name}`
        hilog.error(DOMAIN, TAG, 'command: %{public}s', errMsg)
        promise.reject(JSON.stringify(errMsg))
      }
    }
  }
}

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

import { DoricContext } from './DoricContext'
import { DoricViewNode, DoricGroupNode } from './DoricViewNode'
import { DoricNodeModel } from './DoricNodeModel'
import { DoricNodeRenderer } from './DoricNodeRenderer'
import { hilog } from '@kit.PerformanceAnalysisKit'

const TAG = 'DoricPanel'
const DOMAIN = 0x8000

/**
 * DoricPanel - ArkTS component that hosts a DoricContext.
 *
 * Aligned with iOS DoricPanel / DoricPanelView:
 *   - config: initialize with script/alias/extra
 *   - lifecycle: appear/disappear -> onShow/onHidden
 *   - size tracking: build on size change
 *
 * Rendering flow:
 *   JS -> nativeBridge -> DoricShaderPlugin.render() -> DoricViewNode.blend()
 *   -> Updates DoricNodeModel -> DoricContext.onRenderCallback
 *   -> Updates rootNodeModel_ (@State) -> ArkUI re-renders DoricNodeRenderer
 *
 * Usage:
 *   DoricPanel({
 *     script: 'your JS bundle content',
 *     alias: 'DemoPage',
 *     extra: '{}',  // optional JSON string
 *   })
 */
@Component
export struct DoricPanel {
  /** JS bundle script content */
  @Prop script: string = ''
  /** Script alias / source identifier */
  @Prop alias: string = ''
  /** Extra initialization data (JSON string) */
  @Prop extra: string = ''
  /** Callback when the panel frame size changes */
  frameChangedBlock?: (width: number, height: number) => void

  /** The DoricContext managed by this panel */
  private doricContext_: DoricContext | undefined = undefined
  /** Tracked rendered dimensions */
  private renderedWidth_: number = 0
  private renderedHeight_: number = 0
  /** Whether onShow has been called */
  private isShow_: boolean = false

  /**
   * The root node model for ArkUI rendering.
   * Updated when DoricShaderPlugin.render() modifies the view tree.
   */
  @State private rootNodeModel_: DoricNodeModel = new DoricNodeModel()

  /**
   * Render version counter - ensures @State change detection for structural updates.
   */
  @State private renderVersion_: number = 0

  /**
   * Get the underlying DoricContext.
   */
  getDoricContext(): DoricContext | undefined {
    return this.doricContext_
  }

  /**
   * Configure the panel with a script.
   * Aligned with iOS: - (void)config:(NSString *)script alias:(NSString *)alias extra:(NSString *)extra;
   *
   * Creates a DoricContext, sets up the rootNode's view (like iOS setupRootView),
   * and registers the render callback for ArkUI updates.
   */
  config(script: string, alias: string, extra: string): void {
    // Teardown existing context if any
    if (this.doricContext_) {
      this.doricContext_.onRenderCallback = undefined
      this.doricContext_.teardown()
    }

    this.doricContext_ = new DoricContext(script, alias, extra)

    // Register render callback
    this.doricContext_!.onRenderCallback = () => {
      this.rootNodeModel_ = this.doricContext_!.getRootNodeModel()
      this.renderVersion_++
      hilog.debug(DOMAIN, TAG, 'Render callback: rootNodeModel updated, version=%{public}d',
        this.renderVersion_)
    }

    // Set initial root node model
    this.rootNodeModel_ = this.doricContext_!.getRootNodeModel()

    hilog.info(DOMAIN, TAG, 'DoricPanel configured with alias: %{public}s, contextId: %{public}s',
      alias, this.doricContext_!.contextId)
  }

  /**
   * Handle click events from DoricNodeRenderer.
   */
  private handleNodeClick_(viewId: string, callbackId: string): void {
    if (this.doricContext_ && !this.doricContext_!.destroyed) {
      const rootNode = this.doricContext_!.rootNode
      const viewNode = this.findViewNode_(rootNode, viewId)
      if (viewNode !== undefined) {
        viewNode.callJSResponse(callbackId)
      }
    }
  }

  /**
   * Recursively find a view node by viewId.
   */
  private findViewNode_(node: DoricViewNode, viewId: string): DoricViewNode | undefined {
    if (node.viewId === viewId) {
      return node
    }
    if (node instanceof DoricGroupNode) {
      const groupNode = node as DoricGroupNode
      for (const child of groupNode.childNodes) {
        const found = this.findViewNode_(child, viewId)
        if (found !== undefined) {
          return found
        }
      }
    }
    return undefined
  }

  aboutToAppear(): void {
    hilog.info(DOMAIN, TAG, 'DoricPanel aboutToAppear, alias: %{public}s', this.alias)
    if (this.script.length > 0 && !this.doricContext_) {
      this.config(this.script, this.alias, this.extra)
    }
  }

  aboutToDisappear(): void {
    hilog.info(DOMAIN, TAG, 'DoricPanel aboutToDisappear, alias: %{public}s', this.alias)
    if (this.isShow_ && this.doricContext_) {
      this.isShow_ = false
      this.doricContext_!.onHidden()
    }
    // Teardown context when panel is fully removed
    if (this.doricContext_) {
      this.doricContext_!.onRenderCallback = undefined
      this.doricContext_!.teardown()
      this.doricContext_ = undefined
    }
  }

  onPageShow(): void {
    if (this.doricContext_ && !this.isShow_) {
      this.isShow_ = true
      this.doricContext_!.onShow()
    }
  }

  onPageHide(): void {
    if (this.doricContext_ && this.isShow_) {
      this.isShow_ = false
      this.doricContext_!.onHidden()
    }
  }

  build() {
    Stack() {
      // Render the Doric view tree via DoricNodeRenderer
      // Read renderVersion_ to ensure @State tracks changes
      if (this.renderVersion_ >= 0 && this.rootNodeModel_.type.length > 0) {
        DoricNodeRenderer({
          model: this.rootNodeModel_,
          onNodeClick: (viewId: string, callbackId: string) => {
            this.handleNodeClick_(viewId, callbackId)
          }
        })
      }
    }
    .width('100%')
    .height('100%')
    .onAreaChange((_oldValue: Area, newValue: Area) => {
      const newWidth = newValue.width as number
      const newHeight = newValue.height as number
      if (this.doricContext_ && (this.renderedWidth_ !== newWidth || this.renderedHeight_ !== newHeight)) {
        this.renderedWidth_ = newWidth
        this.renderedHeight_ = newHeight
        this.doricContext_!.build(newWidth, newHeight)

        if (!this.isShow_) {
          this.isShow_ = true
          this.doricContext_!.onShow()
        }

        if (this.frameChangedBlock) {
          this.frameChangedBlock(newWidth, newHeight)
        }
      }
    })
  }
}

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
import { DoricViewNode, DoricGroupNode } from './shader/DoricViewNode'
import { DoricNodeModel, DoricPoint } from './shader/DoricNodeModel'
import { DoricNodeRenderer } from './shader/DoricNodeRenderer'
import { hilog } from '@kit.PerformanceAnalysisKit'

const TAG = 'DoricPanel'
const DOMAIN = 0x8000

/**
 * DoricPanel - ArkTS component that hosts a DoricContext.
 */
@Component
export struct DoricPanel {
  @Prop script: string = ''
  @Prop alias: string = ''
  @Prop extra: string = ''
  frameChangedBlock?: (width: number, height: number) => void

  private doricContext_: DoricContext | undefined = undefined
  private renderedWidth_: number = 0
  private renderedHeight_: number = 0
  private isShow_: boolean = false

  @State private rootNodeModel_: DoricNodeModel = new DoricNodeModel()

  @State private renderVersion_: number = 0

  getDoricContext(): DoricContext | undefined {
    return this.doricContext_
  }

  config(script: string, alias: string, extra: string): void {
    if (this.doricContext_) {
      this.doricContext_.onRenderCallback = undefined
      this.doricContext_.teardown()
    }

    this.doricContext_ = new DoricContext(script, alias, extra)

    this.doricContext_!.onRenderCallback = () => {
      this.rootNodeModel_ = this.doricContext_!.getRootNodeModel()
      this.renderVersion_++
      hilog.debug(DOMAIN, TAG, 'Render callback: rootNodeModel updated, version=%{public}d',
        this.renderVersion_)
    }

    this.rootNodeModel_ = this.doricContext_!.getRootNodeModel()

    hilog.info(DOMAIN, TAG, 'DoricPanel configured with alias: %{public}s, contextId: %{public}s',
      alias, this.doricContext_!.contextId)
  }

  private handleNodeClick_(viewId: string, callbackId: string): void {
    if (this.doricContext_ && !this.doricContext_!.destroyed) {
      const rootNode = this.doricContext_!.rootNode
      const viewNode = this.findViewNode_(rootNode, viewId)
      if (viewNode !== undefined) {
        viewNode.callJSResponse(callbackId)
      }
    }
  }

  private handleNodeScroll_(viewId: string, callbackId: string, offset: DoricPoint): void {
    if (this.doricContext_ && !this.doricContext_!.destroyed) {
      const rootNode = this.doricContext_!.rootNode
      const viewNode = this.findViewNode_(rootNode, viewId)
      if (viewNode !== undefined) {
        viewNode.callJSResponse(callbackId, offset)
      }
    }
  }

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
      if (this.renderVersion_ >= 0 && this.rootNodeModel_.type.length > 0) {
        DoricNodeRenderer({
          model: this.rootNodeModel_,
          onNodeClick: (viewId: string, callbackId: string) => {
            this.handleNodeClick_(viewId, callbackId)
          },
          onNodeScroll: (viewId: string, callbackId: string, offset: DoricPoint) => {
            this.handleNodeScroll_(viewId, callbackId, offset)
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

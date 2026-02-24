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
import { hilog } from '@kit.PerformanceAnalysisKit'

const TAG = 'DoricPanel'
const DOMAIN = 0x8000

/**
 * DoricPanel - ArkTS component that hosts a DoricContext.
 *
 * Aligned with iOS DoricPanel (UIViewController):
 *   - config: initialize with script/alias/extra
 *   - lifecycle: appear/disappear -> onShow/onHidden
 *   - size tracking: build on size change
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
  @State private doricContext_: DoricContext | undefined = undefined
  /** Tracked rendered dimensions */
  private renderedWidth_: number = 0
  private renderedHeight_: number = 0
  /** Whether onShow has been called */
  private isShow_: boolean = false

  /**
   * Get the underlying DoricContext.
   */
  getDoricContext(): DoricContext | undefined {
    return this.doricContext_
  }

  /**
   * Configure the panel with a script.
   * Aligned with iOS: - (void)config:(NSString *)script alias:(NSString *)alias extra:(NSString *)extra;
   */
  config(script: string, alias: string, extra: string): void {
    // Teardown existing context if any
    if (this.doricContext_) {
      this.doricContext_.teardown()
    }

    this.doricContext_ = new DoricContext(script, alias, extra)
    hilog.info(DOMAIN, TAG, 'DoricPanel configured with alias: %{public}s, contextId: %{public}s',
      alias, this.doricContext_!.contextId)
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
      // Placeholder for Doric rendered content.
      // In a full implementation, the JS bridge would drive native node creation
      // via the nativeBridge callback. For now, this Stack serves as the root container
      // where DoricContext's rootNode content will be rendered.
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

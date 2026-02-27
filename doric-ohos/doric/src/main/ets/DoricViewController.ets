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
import { DoricJSLoaderManager } from './loader/DoricJSLoaderManager'
import { DoricNavigatorDelegate, DoricNavBarDelegate, DoricStatusBarDelegate } from './utils/DoricDelegates'
import { DoricViewNode, DoricGroupNode } from './shader/DoricViewNode'
import { DoricNodeModel } from './shader/DoricNodeModel'
import { DoricNodeRenderer } from './shader/DoricNodeRenderer'
import { window } from '@kit.ArkUI'
import { hilog } from '@kit.PerformanceAnalysisKit'

const TAG = 'DoricVC'
const DOMAIN = 0x8000

enum DoricVCState {
  LOADING,
  SUCCESS,
  ERROR
}

class DoricVCNavigatorDelegate implements DoricNavigatorDelegate {
  doric_navigator_push(source: string, alias: string, _animated: boolean, extra: string): void {
    hilog.info(DOMAIN, TAG, 'navigator_push: %{public}s', source)
    import('@ohos.router').then((routerModule) => {
      const params = new DoricPageParams()
      params.source = source
      params.alias = alias
      params.extra = extra || ''
      routerModule.default.pushNamedRoute({
        name: 'DoricPage',
        params: params as Object
      })
    })
  }

  doric_navigator_pop(_animated: boolean): void {
    hilog.info(DOMAIN, TAG, 'navigator_pop')
    import('@ohos.router').then((routerModule) => {
      routerModule.default.back()
    })
  }

  doric_navigator_popSelf(_animated: boolean): void {
    hilog.info(DOMAIN, TAG, 'navigator_popSelf')
    import('@ohos.router').then((routerModule) => {
      routerModule.default.back()
    })
  }

  doric_navigator_popToRoot(_animated: boolean): void {
    hilog.info(DOMAIN, TAG, 'navigator_popToRoot')
    import('@ohos.router').then((routerModule) => {
      routerModule.default.clear()
    })
  }
}

class DoricPageParams {
  source: string = ''
  alias: string = ''
  extra: string = ''
}

class DoricVCNavBarDelegate implements DoricNavBarDelegate {
  private vc_: DoricViewControllerState

  constructor(vc: DoricViewControllerState) {
    this.vc_ = vc
  }

  doric_navBar_isHidden(): boolean {
    return this.vc_.navBarHidden
  }

  doric_navBar_setHidden(hidden: boolean): void {
    hilog.info(DOMAIN, TAG, 'navBar_setHidden: %{public}s', hidden.toString())
    this.vc_.navBarHidden = hidden
  }

  doric_navBar_setTitle(title: string): void {
    hilog.info(DOMAIN, TAG, 'navBar_setTitle: %{public}s', title)
    this.vc_.navBarTitle = title
  }

  doric_navBar_setBackgroundColor(color: number): void {
    const hex = '#' + (color >>> 0).toString(16).padStart(8, '0')
    hilog.info(DOMAIN, TAG, 'navBar_setBgColor: %{public}s', hex)
    this.vc_.navBarBgColor = hex
  }

  doric_navBar_setLeft(_view: string): void {
    hilog.info(DOMAIN, TAG, 'navBar_setLeft (view config received)')
  }

  doric_navBar_setRight(_view: string): void {
    hilog.info(DOMAIN, TAG, 'navBar_setRight (view config received)')
  }

  doric_navBar_setCenter(_view: string): void {
    hilog.info(DOMAIN, TAG, 'navBar_setCenter (view config received)')
  }
}

class DoricVCStatusBarDelegate implements DoricStatusBarDelegate {
  private vc_: DoricViewControllerState

  constructor(vc: DoricViewControllerState) {
    this.vc_ = vc
  }

  doric_statusBar_setHidden(hidden: boolean): void {
    hilog.info(DOMAIN, TAG, 'statusBar_setHidden: %{public}s', hidden.toString())
    this.vc_.statusBarHidden = hidden
    this.applyStatusBar()
  }

  doric_statusBar_setMode(mode: number): void {
    hilog.info(DOMAIN, TAG, 'statusBar_setMode: %{public}d', mode)
    this.vc_.statusBarMode = mode
    this.applyStatusBar()
  }

  private applyStatusBar(): void {
    try {
      if (this.vc_.windowStage) {
        this.vc_.windowStage.getMainWindow().then((win: window.Window) => {
          const sysBarProps: window.SystemBarProperties = {
            statusBarContentColor: this.vc_.statusBarMode === 0 ? '#FFFFFF' : '#000000'
          }
          win.setWindowSystemBarProperties(sysBarProps)
          if (this.vc_.statusBarHidden) {
            win.setWindowSystemBarEnable([])
          } else {
            win.setWindowSystemBarEnable(['status'])
          }
        })
      }
    } catch (e) {
      hilog.warn(DOMAIN, TAG, 'Failed to apply status bar: %{public}s', (e as Error).message)
    }
  }
}

class DoricViewControllerState {
  navBarHidden: boolean = false
  navBarTitle: string = ''
  navBarBgColor: string = '#FFFFFF'
  statusBarHidden: boolean = false
  statusBarMode: number = 1
  windowStage: window.WindowStage | undefined = undefined
}

@Component
export struct DoricViewController {
  @Prop source: string = ''
  @Prop alias: string = ''
  @Prop extra: string = ''

  @State private state_: DoricVCState = DoricVCState.LOADING
  @State private navBarHidden_: boolean = false
  @State private navBarTitle_: string = ''
  @State private navBarBgColor_: ResourceColor = '#FFFFFF'
  @State private statusBarHidden_: boolean = false
  @State private statusBarMode_: number = 1
  @State private contextReady_: boolean = false

  @State private rootNodeModel_: DoricNodeModel = new DoricNodeModel()

  @State private renderVersion_: number = 0

  private doricContext_: DoricContext | undefined = undefined
  private renderedWidth_: number = 0
  private renderedHeight_: number = 0
  private isShow_: boolean = false

  private vcState_: DoricViewControllerState = new DoricViewControllerState()

  private navigatorDelegate_: DoricVCNavigatorDelegate = new DoricVCNavigatorDelegate()
  private navBarDelegate_: DoricVCNavBarDelegate = new DoricVCNavBarDelegate(this.vcState_)
  private statusBarDelegate_: DoricVCStatusBarDelegate = new DoricVCStatusBarDelegate(this.vcState_)

  @BuilderParam loadingBuilder?: () => void
  @BuilderParam errorBuilder?: () => void

  private loadJSBundle_(): void {
    this.state_ = DoricVCState.LOADING
    hilog.info(DOMAIN, TAG, 'Loading JS bundle: %{public}s', this.source)

    DoricJSLoaderManager.getInstance().request(this.source).then((script: string) => {
      this.configPanel_(script)
      this.state_ = DoricVCState.SUCCESS
    }).catch((e: Error) => {
      hilog.error(DOMAIN, TAG, 'Failed to load JS bundle: %{public}s, error: %{public}s',
        this.source, e.message)
      this.state_ = DoricVCState.ERROR
    })
  }

  private configPanel_(script: string): void {
    if (this.doricContext_) {
      this.doricContext_!.teardown()
    }

    this.doricContext_ = new DoricContext(script, this.alias, this.extra)
    this.doricContext_!.navigator = this.navigatorDelegate_
    this.doricContext_!.navBar = this.navBarDelegate_
    this.doricContext_!.statusBar = this.statusBarDelegate_

    this.doricContext_!.onRenderCallback = () => {
      this.rootNodeModel_ = this.doricContext_!.getRootNodeModel()
      this.renderVersion_++
      this.syncStateFromDelegates_()
      hilog.debug(DOMAIN, TAG, 'Render callback: rootNodeModel updated, version=%{public}d',
        this.renderVersion_)
    }

    this.rootNodeModel_ = this.doricContext_!.getRootNodeModel()
    this.contextReady_ = true

    hilog.info(DOMAIN, TAG, 'DoricContext created, id: %{public}s, alias: %{public}s',
      this.doricContext_!.contextId, this.alias)
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

  private syncStateFromDelegates_(): void {
    if (this.navBarHidden_ !== this.vcState_.navBarHidden) {
      this.navBarHidden_ = this.vcState_.navBarHidden
    }
    if (this.navBarTitle_ !== this.vcState_.navBarTitle) {
      this.navBarTitle_ = this.vcState_.navBarTitle
    }
    if (this.navBarBgColor_ !== this.vcState_.navBarBgColor) {
      this.navBarBgColor_ = this.vcState_.navBarBgColor
    }
    if (this.statusBarHidden_ !== this.vcState_.statusBarHidden) {
      this.statusBarHidden_ = this.vcState_.statusBarHidden
    }
    if (this.statusBarMode_ !== this.vcState_.statusBarMode) {
      this.statusBarMode_ = this.vcState_.statusBarMode
    }
  }

  aboutToAppear(): void {
    hilog.info(DOMAIN, TAG, 'aboutToAppear, source: %{public}s', this.source)
    this.loadJSBundle_()
  }

  aboutToDisappear(): void {
    hilog.info(DOMAIN, TAG, 'aboutToDisappear, alias: %{public}s', this.alias)
    if (this.isShow_ && this.doricContext_) {
      this.isShow_ = false
      this.doricContext_!.onHidden()
    }
    if (this.doricContext_) {
      this.doricContext_!.onRenderCallback = undefined
      this.doricContext_!.teardown()
      this.doricContext_ = undefined
      this.contextReady_ = false
    }
  }

  onPageShow(): void {
    this.syncStateFromDelegates_()
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

  @Builder
  defaultLoadingBuilder() {
    Column() {
      LoadingProgress()
        .width(48)
        .height(48)
      Text('Loading...')
        .fontSize(14)
        .fontColor('#999999')
        .margin({ top: 8 })
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
    .alignItems(HorizontalAlign.Center)
    .backgroundColor('#FFFFFF')
  }

  @Builder
  defaultErrorBuilder() {
    Column() {
      Text('Load Failed')
        .fontSize(16)
        .fontColor('#FF4444')
        .margin({ top: 8 })
      Text('Tap to retry')
        .fontSize(14)
        .fontColor('#999999')
        .margin({ top: 4 })
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
    .alignItems(HorizontalAlign.Center)
    .backgroundColor('#FFFFFF')
    .onClick(() => {
      this.loadJSBundle_()
    })
  }

  build() {
    Column() {
      if (!this.navBarHidden_) {
        Row() {
          Image($r('sys.media.ohos_ic_public_arrow_left'))
            .width(24)
            .height(24)
            .margin({ left: 16 })
            .onClick(() => {
              import('@ohos.router').then((routerModule) => {
                routerModule.default.back()
              })
            })

          Text(this.navBarTitle_)
            .fontSize(18)
            .fontWeight(FontWeight.Medium)
            .layoutWeight(1)
            .textAlign(TextAlign.Center)

          Row()
            .width(24)
            .height(24)
            .margin({ right: 16 })
        }
        .width('100%')
        .height(56)
        .backgroundColor(this.navBarBgColor_)
        .alignItems(VerticalAlign.Center)
      }

      Stack() {
        if (this.contextReady_ && this.renderVersion_ >= 0 && this.rootNodeModel_.type.length > 0) {
          DoricNodeRenderer({
            model: this.rootNodeModel_,
            onNodeClick: (viewId: string, callbackId: string) => {
              this.handleNodeClick_(viewId, callbackId)
            }
          })
        }

        if (this.state_ === DoricVCState.LOADING) {
          if (this.loadingBuilder) {
            this.loadingBuilder()
          } else {
            this.defaultLoadingBuilder()
          }
        } else if (this.state_ === DoricVCState.ERROR) {
          if (this.errorBuilder) {
            this.errorBuilder()
          } else {
            this.defaultErrorBuilder()
          }
        }
      }
      .width('100%')
      .layoutWeight(1)
      .onAreaChange((_oldValue: Area, newValue: Area) => {
        const newWidth = newValue.width as number
        const newHeight = newValue.height as number
        if (this.doricContext_ &&
          (this.renderedWidth_ !== newWidth || this.renderedHeight_ !== newHeight)) {
          this.renderedWidth_ = newWidth
          this.renderedHeight_ = newHeight
          this.doricContext_!.build(newWidth, newHeight)
          if (!this.isShow_) {
            this.isShow_ = true
            this.doricContext_!.onShow()
          }
        }
      })
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#FFFFFF')
  }
}

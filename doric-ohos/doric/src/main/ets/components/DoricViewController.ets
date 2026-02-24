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
import { DoricJSLoaderManager } from './DoricJSLoaderManager'
import { DoricNavigatorDelegate, DoricNavBarDelegate, DoricStatusBarDelegate } from './DoricDelegates'
import { window } from '@kit.ArkUI'
import { hilog } from '@kit.PerformanceAnalysisKit'

const TAG = 'DoricVC'
const DOMAIN = 0x8000

/**
 * Loading state enum for the ViewController.
 */
enum DoricVCState {
  LOADING,
  SUCCESS,
  ERROR
}

/**
 * Navigator delegate implementation class.
 * Aligned with iOS DoricViewController's DoricNavigatorDelegate implementation.
 */
class DoricVCNavigatorDelegate implements DoricNavigatorDelegate {
  doric_navigator_push(source: string, alias: string, _animated: boolean, extra: string): void {
    hilog.info(DOMAIN, TAG, 'navigator_push: %{public}s', source)
    // Use dynamic import to push page. In HarmonyOS, navigation between pages
    // can be done via Navigation component or router. Here we store params
    // for the next page to pick up.
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

/**
 * Params class for DoricPage navigation.
 */
class DoricPageParams {
  source: string = ''
  alias: string = ''
  extra: string = ''
}

/**
 * NavBar delegate implementation class.
 * Aligned with iOS DoricViewController's DoricNavBarDelegate implementation.
 */
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
    // TODO: Render custom left view from JS config
  }

  doric_navBar_setRight(_view: string): void {
    hilog.info(DOMAIN, TAG, 'navBar_setRight (view config received)')
    // TODO: Render custom right view from JS config
  }

  doric_navBar_setCenter(_view: string): void {
    hilog.info(DOMAIN, TAG, 'navBar_setCenter (view config received)')
    // TODO: Render custom center view from JS config
  }
}

/**
 * StatusBar delegate implementation class.
 * Aligned with iOS DoricViewController's DoricStatusBarDelegate implementation.
 */
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

/**
 * Shared mutable state for the DoricViewController and its delegates.
 * This allows delegate classes to modify the component's @State variables.
 */
class DoricViewControllerState {
  navBarHidden: boolean = false
  navBarTitle: string = ''
  navBarBgColor: string = '#FFFFFF'
  statusBarHidden: boolean = false
  statusBarMode: number = 1
  windowStage: window.WindowStage | undefined = undefined
}

/**
 * DoricViewController
 *
 * Aligned with iOS DoricViewController which implements:
 *   - DoricNavigatorDelegate (push/pop/popSelf/popToRoot)
 *   - DoricNavBarDelegate (title/backgroundColor/hidden/left/right/center)
 *   - DoricStatusBarDelegate (hidden/mode)
 *
 * This is a full-page component that:
 *   1. Loads a JS bundle via DoricJSLoaderManager
 *   2. Shows loading / error states with mask
 *   3. Creates a DoricPanel and DoricContext
 *   4. Implements navigation, navbar, and statusbar controls
 *
 * Usage as a page:
 *   In your pages/*.ets file, create a DoricViewController with source/alias/extra params.
 */
@Component
export struct DoricViewController {
  /** JS bundle source (URL, rawfile path, or _internal_:// scheme) */
  @Prop source: string = ''
  /** Alias name for the context */
  @Prop alias: string = ''
  /** Extra initialization data (JSON string) */
  @Prop extra: string = ''

  /** Internal state */
  @State private state_: DoricVCState = DoricVCState.LOADING
  @State private navBarHidden_: boolean = false
  @State private navBarTitle_: string = ''
  @State private navBarBgColor_: ResourceColor = '#FFFFFF'
  @State private statusBarHidden_: boolean = false
  @State private statusBarMode_: number = 1
  @State private contextReady_: boolean = false

  /** The DoricContext */
  private doricContext_: DoricContext | undefined = undefined
  /** Tracked rendered size */
  private renderedWidth_: number = 0
  private renderedHeight_: number = 0
  private isShow_: boolean = false

  /** Shared state object for delegate classes */
  private vcState_: DoricViewControllerState = new DoricViewControllerState()

  /** Delegate instances */
  private navigatorDelegate_: DoricVCNavigatorDelegate = new DoricVCNavigatorDelegate()
  private navBarDelegate_: DoricVCNavBarDelegate = new DoricVCNavBarDelegate(this.vcState_)
  private statusBarDelegate_: DoricVCStatusBarDelegate = new DoricVCStatusBarDelegate(this.vcState_)

  /** Custom loading/error builder slots */
  @BuilderParam loadingBuilder?: () => void
  @BuilderParam errorBuilder?: () => void

  // ======================================================================
  // JS Bundle loading - aligned with iOS loadJSBundle
  // ======================================================================

  /**
   * Load the JS bundle via DoricJSLoaderManager.
   * Aligned with iOS: - (void)loadJSBundle;
   */
  private loadJSBundle_(): void {
    this.state_ = DoricVCState.LOADING
    hilog.info(DOMAIN, TAG, 'Loading JS bundle: %{public}s', this.source)

    DoricJSLoaderManager.getInstance().request(this.source).then((script: string) => {
      // Success - create context
      this.configPanel_(script)
      this.state_ = DoricVCState.SUCCESS
    }).catch((e: Error) => {
      hilog.error(DOMAIN, TAG, 'Failed to load JS bundle: %{public}s, error: %{public}s',
        this.source, e.message)
      this.state_ = DoricVCState.ERROR
    })
  }

  /**
   * Configure the DoricContext after successful loading.
   * Aligned with iOS DoricViewController.loadJSBundle success path.
   */
  private configPanel_(script: string): void {
    // Teardown previous context
    if (this.doricContext_) {
      this.doricContext_!.teardown()
    }

    this.doricContext_ = new DoricContext(script, this.alias, this.extra)
    // Bind delegates (aligned with iOS: self.doricPanel.doricContext.navigator = self)
    this.doricContext_!.navigator = this.navigatorDelegate_
    this.doricContext_!.navBar = this.navBarDelegate_
    this.doricContext_!.statusBar = this.statusBarDelegate_
    this.contextReady_ = true

    hilog.info(DOMAIN, TAG, 'DoricContext created, id: %{public}s, alias: %{public}s',
      this.doricContext_!.contextId, this.alias)
  }

  /**
   * Sync shared state back to @State properties for UI update.
   */
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

  // ======================================================================
  // Lifecycle
  // ======================================================================

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

  // ======================================================================
  // UI Build
  // ======================================================================

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
      // NavBar - aligned with iOS navigationBar
      if (!this.navBarHidden_) {
        Row() {
          // Back button
          Image($r('sys.media.ohos_ic_public_arrow_left'))
            .width(24)
            .height(24)
            .margin({ left: 16 })
            .onClick(() => {
              import('@ohos.router').then((routerModule) => {
                routerModule.default.back()
              })
            })

          // Title
          Text(this.navBarTitle_)
            .fontSize(18)
            .fontWeight(FontWeight.Medium)
            .layoutWeight(1)
            .textAlign(TextAlign.Center)

          // Placeholder for right side (symmetry)
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

      // Content area
      Stack() {
        // Doric content area
        if (this.contextReady_) {
          Stack()
            .width('100%')
            .height('100%')
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

        // Mask layer: loading / error states
        // Aligned with iOS maskView behavior
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
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#FFFFFF')
  }
}

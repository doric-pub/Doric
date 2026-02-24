/*
 * DoricPage - Entry page that hosts a DoricViewController.
 *
 * This page is the HarmonyOS equivalent of creating a DoricViewController
 * on iOS and pushing it onto a navigation stack.
 *
 * Route params:
 *   - source: JS bundle source path
 *   - alias: context alias
 *   - extra: optional extra JSON string
 */

import { DoricViewController } from 'doric'

class DoricPageParams {
  source: string = ''
  alias: string = ''
  extra: string = ''
}

@Entry
@Component
struct DoricPage {
  @State private source_: string = ''
  @State private alias_: string = ''
  @State private extra_: string = ''

  aboutToAppear(): void {
    import('@ohos.router').then((routerModule) => {
      const params = routerModule.default.getParams() as DoricPageParams
      if (params) {
        this.source_ = params.source || ''
        this.alias_ = params.alias || ''
        this.extra_ = params.extra || ''
      }
    })
  }

  build() {
    Column() {
      if (this.source_.length > 0) {
        DoricViewController({
          source: this.source_,
          alias: this.alias_,
          extra: this.extra_
        })
      }
    }
    .width('100%')
    .height('100%')
  }
}

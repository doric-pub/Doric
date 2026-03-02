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
  DoricNodeModel,
  DoricTextConfigModel,
  DoricImageConfigModel,
  DoricLayoutSpec,
  DoricScrollConfigModel,
  DoricPoint,
} from './DoricNodeModel'

/**
 * Callback type for handling node click events.
 */
export type DoricNodeClickHandler = (viewId: string, callbackId: string) => void

/**
 * Callback type for handling node scroll events.
 */
export type DoricNodeScrollHandler = (viewId: string, callbackId: string, offset: DoricPoint) => void

/**
 * DoricNodeRenderer - Renders a single DoricNodeModel and its children recursively.
 */
@Component
export struct DoricNodeRenderer {
  @ObjectLink model: DoricNodeModel
  onNodeClick?: DoricNodeClickHandler
  onNodeScroll?: DoricNodeScrollHandler
  
  private scroller: Scroller = new Scroller()
  @State private lastScrollAnchor: number = 0

  build() {
    if (this.model.renderVersion >= 0 && !this.model.hidden) {
      if (this.model.type === 'Root' || this.model.type === 'Stack') {
        this.buildStack()
      } else if (this.model.type === 'VLayout') {
        this.buildVLayout()
      } else if (this.model.type === 'HLayout') {
        this.buildHLayout()
      } else if (this.model.type === 'Text') {
        this.buildText()
      } else if (this.model.type === 'Image') {
        this.buildImage()
      } else if (this.model.type === 'Scroller') {
        this.buildScroller()
      } else {
        this.buildStack()
      }
    }
  }

  @Builder
  buildStack() {
    Stack() {
      ForEach(this.model.children, (child: DoricNodeModel) => {
        DoricNodeRenderer({ model: child, onNodeClick: this.onNodeClick, onNodeScroll: this.onNodeScroll })
      }, (child: DoricNodeModel) => child.viewId)
    }
    .width(this.computeWidth())
    .height(this.computeHeight())
    .backgroundColor(this.model.backgroundColor)
    .opacity(this.model.alpha)
    .border({
      width: this.model.border.width,
      color: this.model.border.color,
      radius: this.model.corners.individual
        ? {
            topLeft: this.model.corners.leftTop,
            topRight: this.model.corners.rightTop,
            bottomRight: this.model.corners.rightBottom,
            bottomLeft: this.model.corners.leftBottom
          }
        : this.model.corners.radius
    })
    .padding({
      left: this.model.padding.left,
      top: this.model.padding.top,
      right: this.model.padding.right,
      bottom: this.model.padding.bottom
    })
    .margin({
      left: this.model.layoutConfig.marginLeft,
      top: this.model.layoutConfig.marginTop,
      right: this.model.layoutConfig.marginRight,
      bottom: this.model.layoutConfig.marginBottom
    })
    .translate({ x: this.model.translationX, y: this.model.translationY })
    .scale({ x: this.model.scaleX, y: this.model.scaleY, centerX: this.model.pivotX, centerY: this.model.pivotY })
    .rotate({ angle: this.model.rotation * 180 })
    .clip(true)
    .onClick(() => {
      if (this.model.onClickId.length > 0 && this.onNodeClick) {
        this.onNodeClick(this.model.viewId, this.model.onClickId)
      }
    })
  }

  @Builder
  buildVLayout() {
    Column() {
      ForEach(this.model.children, (child: DoricNodeModel) => {
        DoricNodeRenderer({ model: child, onNodeClick: this.onNodeClick, onNodeScroll: this.onNodeScroll })
      }, (child: DoricNodeModel) => child.viewId)
    }
    .width(this.computeWidth())
    .height(this.computeHeight())
    .backgroundColor(this.model.backgroundColor)
    .opacity(this.model.alpha)
    .border({
      width: this.model.border.width,
      color: this.model.border.color,
      radius: this.model.corners.individual
        ? {
            topLeft: this.model.corners.leftTop,
            topRight: this.model.corners.rightTop,
            bottomRight: this.model.corners.rightBottom,
            bottomLeft: this.model.corners.leftBottom
          }
        : this.model.corners.radius
    })
    .padding({
      left: this.model.padding.left,
      top: this.model.padding.top,
      right: this.model.padding.right,
      bottom: this.model.padding.bottom
    })
    .margin({
      left: this.model.layoutConfig.marginLeft,
      top: this.model.layoutConfig.marginTop,
      right: this.model.layoutConfig.marginRight,
      bottom: this.model.layoutConfig.marginBottom
    })
    .translate({ x: this.model.translationX, y: this.model.translationY })
    .scale({ x: this.model.scaleX, y: this.model.scaleY, centerX: this.model.pivotX, centerY: this.model.pivotY })
    .rotate({ angle: this.model.rotation * 180 })
    .clip(true)
    .onClick(() => {
      if (this.model.onClickId.length > 0 && this.onNodeClick) {
        this.onNodeClick(this.model.viewId, this.model.onClickId)
      }
    })
  }

  @Builder
  buildHLayout() {
    Row() {
      ForEach(this.model.children, (child: DoricNodeModel) => {
        DoricNodeRenderer({ model: child, onNodeClick: this.onNodeClick, onNodeScroll: this.onNodeScroll })
      }, (child: DoricNodeModel) => child.viewId)
    }
    .width(this.computeWidth())
    .height(this.computeHeight())
    .backgroundColor(this.model.backgroundColor)
    .opacity(this.model.alpha)
    .border({
      width: this.model.border.width,
      color: this.model.border.color,
      radius: this.model.corners.individual
        ? {
            topLeft: this.model.corners.leftTop,
            topRight: this.model.corners.rightTop,
            bottomRight: this.model.corners.rightBottom,
            bottomLeft: this.model.corners.leftBottom
          }
        : this.model.corners.radius
    })
    .padding({
      left: this.model.padding.left,
      top: this.model.padding.top,
      right: this.model.padding.right,
      bottom: this.model.padding.bottom
    })
    .margin({
      left: this.model.layoutConfig.marginLeft,
      top: this.model.layoutConfig.marginTop,
      right: this.model.layoutConfig.marginRight,
      bottom: this.model.layoutConfig.marginBottom
    })
    .translate({ x: this.model.translationX, y: this.model.translationY })
    .scale({ x: this.model.scaleX, y: this.model.scaleY, centerX: this.model.pivotX, centerY: this.model.pivotY })
    .rotate({ angle: this.model.rotation * 180 })
    .clip(true)
    .onClick(() => {
      if (this.model.onClickId.length > 0 && this.onNodeClick) {
        this.onNodeClick(this.model.viewId, this.model.onClickId)
      }
    })
  }

  @Builder
  buildText() {
    Text(this.getTextConfig().text)
      .width(this.computeWidth())
      .height(this.computeHeight())
      .fontSize(this.getTextConfig().fontSize)
      .fontColor(this.getTextConfig().fontColor)
      .fontWeight(this.getTextConfig().fontStyle === 'bold' || this.getTextConfig().fontStyle === 'bold_italic'
        ? FontWeight.Bold : FontWeight.Normal)
      .fontStyle(this.getTextConfig().fontStyle === 'italic' || this.getTextConfig().fontStyle === 'bold_italic'
        ? FontStyle.Italic : FontStyle.Normal)
      .textAlign(this.computeTextAlign())
      .maxLines(this.getTextConfig().maxLines > 0 ? this.getTextConfig().maxLines : undefined)
      .textOverflow({ overflow: TextOverflow.Ellipsis })
      .decoration({
        type: this.getTextConfig().underline ? TextDecorationType.Underline
          : (this.getTextConfig().strikethrough ? TextDecorationType.LineThrough : TextDecorationType.None)
      })
      .backgroundColor(this.model.backgroundColor)
      .opacity(this.model.alpha)
      .border({
        width: this.model.border.width,
        color: this.model.border.color,
        radius: this.model.corners.individual
          ? {
              topLeft: this.model.corners.leftTop,
              topRight: this.model.corners.rightTop,
              bottomRight: this.model.corners.rightBottom,
              bottomLeft: this.model.corners.leftBottom
            }
          : this.model.corners.radius
      })
      .padding({
        left: this.model.padding.left,
        top: this.model.padding.top,
        right: this.model.padding.right,
        bottom: this.model.padding.bottom
      })
      .margin({
        left: this.model.layoutConfig.marginLeft,
        top: this.model.layoutConfig.marginTop,
        right: this.model.layoutConfig.marginRight,
        bottom: this.model.layoutConfig.marginBottom
      })
      .translate({ x: this.model.translationX, y: this.model.translationY })
      .scale({ x: this.model.scaleX, y: this.model.scaleY, centerX: this.model.pivotX, centerY: this.model.pivotY })
      .rotate({ angle: this.model.rotation * 180 })
      .onClick(() => {
        if (this.model.onClickId.length > 0 && this.onNodeClick) {
          this.onNodeClick(this.model.viewId, this.model.onClickId)
        }
      })
  }

  @Builder
  buildImage() {
    Image(this.computeImageSource())
      .width(this.computeWidth())
      .height(this.computeHeight())
      .fitOriginalSize(true)
      .objectFit(this.computeImageFit())
      .backgroundColor(this.model.backgroundColor)
      .opacity(this.model.alpha)
      .border({
        width: this.model.border.width,
        color: this.model.border.color,
        radius: this.model.corners.individual
          ? {
              topLeft: this.model.corners.leftTop,
              topRight: this.model.corners.rightTop,
              bottomRight: this.model.corners.rightBottom,
              bottomLeft: this.model.corners.leftBottom
            }
          : this.model.corners.radius
      })
      .margin({
        left: this.model.layoutConfig.marginLeft,
        top: this.model.layoutConfig.marginTop,
        right: this.model.layoutConfig.marginRight,
        bottom: this.model.layoutConfig.marginBottom
      })
      .translate({ x: this.model.translationX, y: this.model.translationY })
      .scale({ x: this.model.scaleX, y: this.model.scaleY, centerX: this.model.pivotX, centerY: this.model.pivotY })
      .rotate({ angle: this.model.rotation * 180 })
      .clip(true)
      .onClick(() => {
        if (this.model.onClickId.length > 0 && this.onNodeClick) {
          this.onNodeClick(this.model.viewId, this.model.onClickId)
        }
      })
  }

  @Builder
  buildScroller() {
    Stack() {
      Scroll(this.scroller) {
        if (this.model.children.length > 0) {
          DoricNodeRenderer({ model: this.model.children[0], onNodeClick: this.onNodeClick, onNodeScroll: this.onNodeScroll })
        }
      }
      .width(this.computeWidth())
      .height(this.computeHeight())
      .scrollable(this.getScrollConfig().scrollable ? ScrollDirection.Vertical : ScrollDirection.None)
      .scrollBar(BarState.Off)
      .edgeEffect(this.getScrollConfig().bounces ? EdgeEffect.Spring : EdgeEffect.None)
      .onScroll((_xOffset: number, _yOffset: number) => {
        const offset = this.scroller.currentOffset()
        const point = new DoricPoint()
        point.x = offset.xOffset as number
        point.y = offset.yOffset as number
        this.getScrollConfig().contentOffset = point
        const funcId = this.getScrollConfig().onScrollFuncId
        if (funcId.length > 0 && this.onNodeScroll) {
          this.onNodeScroll(this.model.viewId, funcId, point)
        }
      })
      .onScrollStop(() => {
        const offset = this.scroller.currentOffset()
        const point = new DoricPoint()
        point.x = offset.xOffset as number
        point.y = offset.yOffset as number
        this.getScrollConfig().contentOffset = point
        const funcId = this.getScrollConfig().onScrollEndFuncId
        if (funcId.length > 0 && this.onNodeScroll) {
          this.onNodeScroll(this.model.viewId, funcId, point)
        }
      })
      
      // Invisible text to trigger command execution
      if (this.getScrollConfig().scrollCommand !== undefined) {
        Text('')
          .visibility(Visibility.Hidden)
          .onAppear(() => {
            this.handleScrollCommand()
          })
          .key(`${this.getScrollConfig().scrollCommand!.anchor}`) // Key changes with anchor to re-render
      }
    }
    .width(this.computeWidth())
    .height(this.computeHeight())
    .backgroundColor(this.model.backgroundColor)
    .opacity(this.model.alpha)
    .margin({
      left: this.model.layoutConfig.marginLeft,
      top: this.model.layoutConfig.marginTop,
      right: this.model.layoutConfig.marginRight,
      bottom: this.model.layoutConfig.marginBottom
    })
    .translate({ x: this.model.translationX, y: this.model.translationY })
    .scale({ x: this.model.scaleX, y: this.model.scaleY, centerX: this.model.pivotX, centerY: this.model.pivotY })
    .rotate({ angle: this.model.rotation * 180 })
  }

  private handleScrollCommand() {
    const cmd = this.getScrollConfig().scrollCommand
    if (cmd && cmd.anchor !== this.lastScrollAnchor) {
      this.lastScrollAnchor = cmd.anchor
      this.scroller.scrollTo({
        xOffset: cmd.offsetX,
        yOffset: cmd.offsetY,
        animation: cmd.animated
      })
    }
  }

  private computeWidth(): Length | undefined {
    const spec = this.model.layoutConfig.widthSpec
    if (spec === DoricLayoutSpec.MOST) {
      return '100%'
    } else if (spec === DoricLayoutSpec.FIT) {
      return undefined
    } else {
      return this.model.width > 0 ? this.model.width : undefined
    }
  }

  private computeHeight(): Length | undefined {
    const spec = this.model.layoutConfig.heightSpec
    if (spec === DoricLayoutSpec.MOST) {
      return '100%'
    } else if (spec === DoricLayoutSpec.FIT) {
      return undefined
    } else {
      return this.model.height > 0 ? this.model.height : undefined
    }
  }

  private static readonly DEFAULT_TEXT_CONFIG: DoricTextConfigModel = new DoricTextConfigModel()
  private static readonly DEFAULT_IMAGE_CONFIG: DoricImageConfigModel = new DoricImageConfigModel()
  private static readonly DEFAULT_SCROLL_CONFIG: DoricScrollConfigModel = new DoricScrollConfigModel()

  private getTextConfig(): DoricTextConfigModel {
    return this.model.textConfig !== undefined ? this.model.textConfig : DoricNodeRenderer.DEFAULT_TEXT_CONFIG
  }

  private getImageConfig(): DoricImageConfigModel {
    return this.model.imageConfig !== undefined ? this.model.imageConfig : DoricNodeRenderer.DEFAULT_IMAGE_CONFIG
  }

  private getScrollConfig(): DoricScrollConfigModel {
    return this.model.scrollConfig !== undefined ? this.model.scrollConfig : DoricNodeRenderer.DEFAULT_SCROLL_CONFIG
  }

  private computeTextAlign(): TextAlign {
    const tc = this.getTextConfig()
    switch (tc.textAlignment) {
      case 1:
        return TextAlign.End
      case 2:
        return TextAlign.Center
      default:
        return TextAlign.Start
    }
  }

  private computeImageSource(): string | Resource {
    const ic = this.getImageConfig()
    if (ic.imageUrl.length > 0) {
      return ic.imageUrl
    }
    if (ic.imageRes.length > 0) {
      return ic.imageRes
    }
    if (ic.imageBase64.length > 0) {
      return ic.imageBase64
    }
    return ''
  }

  private computeImageFit(): ImageFit {
    const ic = this.getImageConfig()
    switch (ic.scaleType) {
      case 0:
        return ImageFit.Fill
      case 1:
        return ImageFit.Contain
      case 2:
        return ImageFit.Cover
      default:
        return ImageFit.Cover
    }
  }
}

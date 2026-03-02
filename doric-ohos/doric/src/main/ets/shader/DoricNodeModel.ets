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
 * Layout specification enum, aligned with iOS DoricLayoutSpec.
 */
export enum DoricLayoutSpec {
  JUST = 0,       // Fixed size
  FIT = 1,        // Wrap content
  MOST = 2        // Match parent
}

/**
 * Gravity constants for alignment.
 */
export class DoricGravity {
  static readonly SPECIFIED: number = 1
  static readonly START: number = 1 << 1           // 2
  static readonly END: number = 1 << 2             // 4
  static readonly SHIFT_X: number = 0
  static readonly SHIFT_Y: number = 4
  static readonly LEFT: number = (2 | 1) << 0      // 3
  static readonly RIGHT: number = (4 | 1) << 0     // 5
  static readonly TOP: number = (2 | 1) << 4        // 48
  static readonly BOTTOM: number = (4 | 1) << 4     // 80
  static readonly CENTER_X: number = 1 << 0          // 1
  static readonly CENTER_Y: number = 1 << 4          // 16
  static readonly CENTER: number = 1 | 16            // 17
}

/**
 * Layout configuration model.
 */
@Observed
export class DoricLayoutConfigModel {
  widthSpec: DoricLayoutSpec = DoricLayoutSpec.JUST
  heightSpec: DoricLayoutSpec = DoricLayoutSpec.JUST
  alignment: number = 0
  weight: number = 0
  marginLeft: number = 0
  marginTop: number = 0
  marginRight: number = 0
  marginBottom: number = 0
  maxWidth: number = -1
  maxHeight: number = -1
  minWidth: number = -1
  minHeight: number = -1
}

/**
 * Border configuration model.
 */
@Observed
export class DoricBorderModel {
  width: number = 0
  color: string = '#00000000'
}

/**
 * Shadow configuration model.
 */
@Observed
export class DoricShadowModel {
  color: string = '#00000000'
  opacity: number = 0
  radius: number = 0
  offsetX: number = 0
  offsetY: number = 0
}

/**
 * Corners configuration model.
 */
@Observed
export class DoricCornersModel {
  radius: number = 0
  leftTop: number = 0
  rightTop: number = 0
  rightBottom: number = 0
  leftBottom: number = 0
  individual: boolean = false
}

/**
 * Padding configuration model.
 */
@Observed
export class DoricPaddingModel {
  left: number = 0
  top: number = 0
  right: number = 0
  bottom: number = 0
}

/**
 * DoricTextConfigModel - Type-specific properties for Text nodes.
 */
@Observed
export class DoricTextConfigModel {
  text: string = ''
  fontSize: number = 16
  fontColor: string = '#FF000000'
  textAlignment: number = 0 // 0=left, 1=right, 2=center
  maxLines: number = 0
  fontStyle: string = 'normal' // "normal", "bold", "italic", "bold_italic"
  underline: boolean = false
  strikethrough: boolean = false
}

/**
 * DoricImageConfigModel - Type-specific properties for Image nodes.
 */
@Observed
export class DoricImageConfigModel {
  imageUrl: string = ''
  imageRes: string = ''
  imagePath: string = ''
  imageBase64: string = ''
  scaleType: number = 2 // 0=ScaleToFill, 1=ScaleAspectFit, 2=ScaleAspectFill
  isBlur: boolean = false
  placeHolderColor: string = ''
}

/**
 * DoricScrollChangeModel - Model for scroll changes.
 */
@Observed
export class DoricScrollChangeModel {
  offsetX: number = 0
  offsetY: number = 0
  animated: boolean = false
  anchor: number = 0 // Using timestamp or counter to trigger change
}

/**
/**
 * DoricPoint - Represents a point with x and y coordinates.
 */
@Observed
export class DoricPoint {
  x: number = 0
  y: number = 0
}

/**
 * DoricScrollConfigModel - Type-specific properties for Scroller nodes.
 */
@Observed
export class DoricScrollConfigModel {
  contentViewId: string = ''
  scrollable: boolean = true
  bounces: boolean = true
  scrollsToTop: boolean = true
  onScrollFuncId: string = ''
  onScrollEndFuncId: string = ''
  contentOffset: DoricPoint = new DoricPoint()
  scrollCommand: DoricScrollChangeModel | undefined = undefined
}

/**
 * DoricNodeModel - The observable model for a single Doric view node.
 */
@Observed
export class DoricNodeModel {
  viewId: string = ''
  type: string = ''

  width: number = 0
  height: number = 0
  x: number = 0
  y: number = 0

  backgroundColor: string = '#00000000'
  alpha: number = 1.0
  hidden: boolean = false

  layoutConfig: DoricLayoutConfigModel = new DoricLayoutConfigModel()

  border: DoricBorderModel = new DoricBorderModel()
  corners: DoricCornersModel = new DoricCornersModel()
  shadow: DoricShadowModel = new DoricShadowModel()
  padding: DoricPaddingModel = new DoricPaddingModel()

  translationX: number = 0
  translationY: number = 0
  scaleX: number = 1
  scaleY: number = 1
  rotation: number = 0
  pivotX: number = 0.5
  pivotY: number = 0.5

  onClickId: string = ''

  textConfig: DoricTextConfigModel | undefined = undefined
  imageConfig: DoricImageConfigModel | undefined = undefined
  scrollConfig: DoricScrollConfigModel | undefined = undefined

  children: DoricNodeModel[] = []

  renderVersion: number = 0

  invalidate(): void {
    this.renderVersion++
  }

  ensureTextConfig(): DoricTextConfigModel {
    if (this.textConfig === undefined) {
      this.textConfig = new DoricTextConfigModel()
    }
    return this.textConfig
  }

  ensureImageConfig(): DoricImageConfigModel {
    if (this.imageConfig === undefined) {
      this.imageConfig = new DoricImageConfigModel()
    }
    return this.imageConfig
  }

  ensureScrollConfig(): DoricScrollConfigModel {
    if (this.scrollConfig === undefined) {
      this.scrollConfig = new DoricScrollConfigModel()
    }
    return this.scrollConfig
  }
}

/**
 * Helper: Convert a Doric color number (ARGB int32) to ArkUI hex string (#AARRGGBB).
 */
export function doricColorToHex(color: number): string {
  const unsigned = color >>> 0
  return '#' + unsigned.toString(16).padStart(8, '0')
}

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
 * DoricNodeModel - Observable data model that bridges the Doric imperative
 * view node tree to ArkUI's declarative rendering system.
 *
 * In iOS/Android, each DoricViewNode holds a native view (UIView / android.view.View)
 * and can imperatively add/remove/update it. ArkUI is declarative, so we cannot
 * imperatively create or attach components.
 *
 * This @Observed model acts as the reactive data source: when DoricShaderPlugin.render()
 * updates model properties, ArkUI detects the changes and re-renders automatically.
 *
 * Model hierarchy mirrors the Doric view node tree:
 *   DoricNodeModel (root)
 *     ├── DoricNodeModel (child: Stack)
 *     │   ├── DoricNodeModel (child: Text)
 *     │   └── DoricNodeModel (child: Image)
 *     └── DoricNodeModel (child: VLayout)
 *         └── ...
 */

/**
 * Layout specification enum, aligned with iOS DoricLayoutSpec / doric-js LayoutSpec.
 */
export enum DoricLayoutSpec {
  JUST = 0,       // Fixed size
  FIT = 1,        // Wrap content
  MOST = 2        // Match parent
}

/**
 * Gravity constants for alignment, aligned with iOS DoricGravity / doric-js Gravity.
 * Using a namespace with constants instead of enum to support bitwise operations.
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
 * Layout configuration model, aligned with iOS DoricLayout / doric-js layoutConfig.
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
 * When all corners are equal, use `radius`. Otherwise use individual values.
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
 * Separated from DoricNodeModel to keep the base model clean.
 * Only Text nodes will have this config instantiated.
 *
 * Aligned with iOS DoricTextNode properties.
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
 * Separated from DoricNodeModel to keep the base model clean.
 * Only Image nodes will have this config instantiated.
 *
 * Aligned with iOS DoricImageNode properties.
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
 * DoricNodeModel - The observable model for a single Doric view node.
 *
 * This is decorated with @Observed so that any property change triggers
 * ArkUI re-rendering of the components that reference this model.
 *
 * Contains only common/generic properties shared by all node types.
 * Type-specific properties are stored in optional sub-models:
 *   - textConfig: DoricTextConfigModel (for Text nodes)
 *   - imageConfig: DoricImageConfigModel (for Image nodes)
 *
 * Aligned with iOS DoricViewNode properties:
 *   - width, height, x, y (position)
 *   - backgroundColor, alpha, hidden
 *   - border, corners, shadow
 *   - padding
 *   - layoutConfig
 *   - onClick callback id
 *   - transform properties (translationX/Y, scaleX/Y, rotation)
 */
@Observed
export class DoricNodeModel {
  /** Unique view ID from JS side */
  viewId: string = ''
  /** Node type: "Root", "Stack", "VLayout", "HLayout", "Text", "Image", etc. */
  type: string = ''

  // ---- Basic layout properties (aligned with iOS DoricLayout) ----
  width: number = 0
  height: number = 0
  x: number = 0
  y: number = 0

  // ---- Appearance ----
  backgroundColor: string = '#00000000'
  alpha: number = 1.0
  hidden: boolean = false

  // ---- Layout config (aligned with iOS layoutConfig / doric-js LayoutConfig) ----
  layoutConfig: DoricLayoutConfigModel = new DoricLayoutConfigModel()

  // ---- Decorations ----
  border: DoricBorderModel = new DoricBorderModel()
  corners: DoricCornersModel = new DoricCornersModel()
  shadow: DoricShadowModel = new DoricShadowModel()
  padding: DoricPaddingModel = new DoricPaddingModel()

  // ---- Transform ----
  translationX: number = 0
  translationY: number = 0
  scaleX: number = 1
  scaleY: number = 1
  rotation: number = 0
  pivotX: number = 0.5
  pivotY: number = 0.5

  // ---- Click callback ----
  onClickId: string = ''

  // ---- Type-specific config (only set for corresponding node types) ----
  /** Text node config - only instantiated for Text type nodes */
  textConfig: DoricTextConfigModel | undefined = undefined
  /** Image node config - only instantiated for Image type nodes */
  imageConfig: DoricImageConfigModel | undefined = undefined

  // ---- Container children (for Stack/VLayout/HLayout/Root) ----
  children: DoricNodeModel[] = []

  // ---- Version counter for forcing re-render ----
  renderVersion: number = 0

  /**
   * Mark that a re-render is needed.
   */
  invalidate(): void {
    this.renderVersion++
  }

  /**
   * Ensure textConfig is initialized (lazy creation for Text nodes).
   */
  ensureTextConfig(): DoricTextConfigModel {
    if (this.textConfig === undefined) {
      this.textConfig = new DoricTextConfigModel()
    }
    return this.textConfig
  }

  /**
   * Ensure imageConfig is initialized (lazy creation for Image nodes).
   */
  ensureImageConfig(): DoricImageConfigModel {
    if (this.imageConfig === undefined) {
      this.imageConfig = new DoricImageConfigModel()
    }
    return this.imageConfig
  }
}

/**
 * Helper: Convert a Doric color number (ARGB int32) to ArkUI hex string (#AARRGGBB).
 * Aligned with iOS DoricColor() macro.
 */
export function doricColorToHex(color: number): string {
  // Doric color is an ARGB 32-bit integer
  const unsigned = color >>> 0
  return '#' + unsigned.toString(16).padStart(8, '0')
}

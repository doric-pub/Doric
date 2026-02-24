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
 * DoricNavigatorDelegate
 *
 * Aligned with iOS DoricNavigatorDelegate protocol:
 *   - push: navigate to a new page
 *   - pop: go back
 *   - popSelf: remove current page from the stack
 *   - popToRoot: go back to root page
 */
export interface DoricNavigatorDelegate {
  /**
   * Push a new Doric page.
   * Aligned with iOS: - (void)doric_navigator_push:(NSString *)source alias:(NSString *)alias animated:(BOOL)animated extra:(NSString *)extra;
   */
  doric_navigator_push(source: string, alias: string, animated: boolean, extra: string): void

  /**
   * Pop the top page.
   * Aligned with iOS: - (void)doric_navigator_pop:(BOOL)animated;
   */
  doric_navigator_pop(animated: boolean): void

  /**
   * Pop the current page from the stack without affecting others.
   * Aligned with iOS: - (void)doric_navigator_popSelf:(BOOL)animated;
   */
  doric_navigator_popSelf(animated: boolean): void

  /**
   * Pop all pages to root.
   * Aligned with iOS: - (void)doric_navigator_popToRoot:(BOOL)animated;
   */
  doric_navigator_popToRoot(animated: boolean): void
}

/**
 * DoricNavBarDelegate
 *
 * Aligned with iOS DoricNavBarDelegate protocol:
 *   - isHidden / setHidden
 *   - setTitle
 *   - setBackgroundColor
 *   - setLeft / setRight / setCenter
 */
export interface DoricNavBarDelegate {
  /**
   * Aligned with iOS: - (BOOL)doric_navBar_isHidden;
   */
  doric_navBar_isHidden(): boolean

  /**
   * Aligned with iOS: - (void)doric_navBar_setHidden:(BOOL)hidden;
   */
  doric_navBar_setHidden(hidden: boolean): void

  /**
   * Aligned with iOS: - (void)doric_navBar_setTitle:(NSString *)title;
   */
  doric_navBar_setTitle(title: string): void

  /**
   * Aligned with iOS: - (void)doric_navBar_setBackgroundColor:(UIColor *)color;
   *
   * @param color - Color value as a number (ARGB format) or resource string.
   */
  doric_navBar_setBackgroundColor(color: number): void

  /**
   * Aligned with iOS: - (void)doric_navBar_setLeft:(UIView *)view;
   *
   * @param view - Serialized view config (JSON string) from JS side.
   */
  doric_navBar_setLeft(view: string): void

  /**
   * Aligned with iOS: - (void)doric_navBar_setRight:(UIView *)view;
   *
   * @param view - Serialized view config (JSON string) from JS side.
   */
  doric_navBar_setRight(view: string): void

  /**
   * Aligned with iOS: - (void)doric_navBar_setCenter:(UIView *)view;
   *
   * @param view - Serialized view config (JSON string) from JS side.
   */
  doric_navBar_setCenter(view: string): void
}

/**
 * DoricStatusBarDelegate
 *
 * Aligned with iOS DoricStatusBarDelegate protocol:
 *   - setHidden
 *   - setMode (0=light, 1=dark)
 */
export interface DoricStatusBarDelegate {
  /**
   * Aligned with iOS: - (void)doric_statusBar_setHidden:(BOOL)hidden;
   */
  doric_statusBar_setHidden(hidden: boolean): void

  /**
   * Aligned with iOS: - (void)doric_statusBar_setMode:(int)mode;
   *
   * @param mode - 0 = light content, 1 = dark content (default)
   */
  doric_statusBar_setMode(mode: number): void
}

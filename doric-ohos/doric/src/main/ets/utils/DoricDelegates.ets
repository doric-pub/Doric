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
 * Aligned with iOS DoricNavigatorDelegate protocol.
 */
export interface DoricNavigatorDelegate {
  doric_navigator_push(source: string, alias: string, animated: boolean, extra: string): void

  doric_navigator_pop(animated: boolean): void

  doric_navigator_popSelf(animated: boolean): void

  doric_navigator_popToRoot(animated: boolean): void
}

/**
 * DoricNavBarDelegate
 *
 * Aligned with iOS DoricNavBarDelegate protocol.
 */
export interface DoricNavBarDelegate {
  doric_navBar_isHidden(): boolean

  doric_navBar_setHidden(hidden: boolean): void

  doric_navBar_setTitle(title: string): void

  doric_navBar_setBackgroundColor(color: number): void

  doric_navBar_setLeft(view: string): void

  doric_navBar_setRight(view: string): void

  doric_navBar_setCenter(view: string): void
}

/**
 * DoricStatusBarDelegate
 *
 * Aligned with iOS DoricStatusBarDelegate protocol.
 */
export interface DoricStatusBarDelegate {
  doric_statusBar_setHidden(hidden: boolean): void

  doric_statusBar_setMode(mode: number): void
}

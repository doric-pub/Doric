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
import { Panel } from '../panel/panel'
import { View } from '../widget/view'

export interface Driver {
    /**
     * Create and destory page
     */
    createPage(): Panel
    destoryPage(): Panel

    /**
     * Page lifecycle
     */
    dispatchOnCreate(): void
    dispatchOnDestory(): void
    dispatchOnShow(): void
    dispatchOnHidden(): void

    /**
     * Page render
     */
    dispatchBuild(): View
}

export interface Responser {
    constructor(): void
    respond(action: string, extra: any): void
}
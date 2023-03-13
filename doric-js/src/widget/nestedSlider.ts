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
import { Group, View, Property } from '../ui/view'
import { BridgeContext } from '../runtime/global'


export class NestedSlider extends Group {
    @Property
    onPageSlided?: (index: number) => void

    @Property
    scrollable?: boolean
    /**
     * Take effect only on iOS
     */
    @Property
    bounces?: boolean

    /**
    * Take effect only on iOS
    */
    @Property
    scrollsToTop?: boolean

    addSlideItem(view: View) {
        this.addChild(view)
    }

    slidePage(context: BridgeContext, page: number, smooth = false) {
        return this.nativeChannel(context, "slidePage")({ page, smooth })
    }

    getSlidedPage(context: BridgeContext) {
        return this.nativeChannel(context, "getSlidedPage")() as Promise<number>
    }
}
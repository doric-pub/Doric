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
import { LayoutConfig, Group, Property, IView } from "./view";
import { Gravity } from "../util/gravity";

export interface IStack extends IView {
}

export class Stack extends Group implements IStack {
}



export class Root extends Stack {

}
class LinearLayout extends Group {
    @Property
    space?: number

    @Property
    gravity?: Gravity
}

export interface IVLayout extends IView {
    space?: number
    gravity?: Gravity
}

export class VLayout extends LinearLayout implements VLayout {
}


export interface IHLayout extends IView {
    space?: number
    gravity?: Gravity
}

export class HLayout extends LinearLayout implements IHLayout {
}

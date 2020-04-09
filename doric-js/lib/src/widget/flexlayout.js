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
import { Group } from "../ui/view";
var ValueType;
(function (ValueType) {
    ValueType[ValueType["Point"] = 0] = "Point";
    ValueType[ValueType["Percent"] = 1] = "Percent";
    ValueType[ValueType["Auto"] = 2] = "Auto";
})(ValueType || (ValueType = {}));
export class FlexValue {
    constructor() {
        this.type = ValueType.Auto;
        this.value = 0;
    }
    static percent(v) {
        const ret = new FlexValue;
        ret.type = ValueType.Percent;
        ret.value = v;
        return ret;
    }
    static point(v) {
        const ret = new FlexValue;
        ret.type = ValueType.Point;
        ret.value = v;
        return ret;
    }
    toModel() {
        return {
            type: this.type,
            value: this.value,
        };
    }
}
FlexValue.Auto = new FlexValue;
export class FlexLayout extends Group {
}

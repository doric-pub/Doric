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
function from(obj: Object) {
    return new Proxy(obj, {
        set: (target, prop, value, receiver) => {
            return Reflect.set(target, prop, value, receiver)
        }
    })
}


class Wrapper {
    val: any
    constructor(val: any) {
        this.val = val
    }
    toVal(): any {
        return this.val
    }
}
export class State {
    static of<T extends Object>(obj: T): T {
        return new Proxy(obj, {
            get: (target, prop) => {
                const ret = Reflect.get(target, prop)
                if (ret instanceof Object) {
                    return State.of(ret)
                } else {
                    return new Wrapper(ret)
                }
            }
        })
    }
}
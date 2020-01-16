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
class ProxyPolyfill {
    constructor(target, handler) {
        this.__target__ = target;
        this.__handler__ = handler;
        this.defineProps();
        return target;
    }
    defineProps() {
        const keys = Object.keys(this.__target__);
        keys.forEach(property => {
            if (Object.getOwnPropertyDescriptor(this.__target__, property) !== undefined) {
                return;
            }
            Object.defineProperty(this, property, {
                get: () => {
                    this.defineProps();
                    if (this.__handler__.get) {
                        return this.__handler__.get(this.__target__, property, this);
                    }
                    else {
                        return this.__target__[property];
                    }
                },
                set: (value) => {
                    this.defineProps();
                    if (this.__handler__.set) {
                        this.__handler__.set(this.__target__, property, value, property);
                    }
                    else {
                        this.__target__[property] = value;
                    }
                },
                enumerable: true,
                configurable: true,
            });
        });
    }
}
const global = Function('return this')();
global.Proxy = ProxyPolyfill;
export * from './src/runtime/sandbox';
export * from 'core-js';

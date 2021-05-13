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
import { View, Group } from "./view"
import { loge } from '../util/log'
import { Model } from '../util/types'
import { Root } from '../widget/layouts'
import { BridgeContext } from '../runtime/global'

export function NativeCall(target: Panel, propertyKey: string, descriptor: PropertyDescriptor) {
    const originVal = descriptor.value
    descriptor.value = function () {
        const ret = Reflect.apply(originVal, this, arguments)
        return ret
    }
    return descriptor
}

type Frame = { width: number, height: number }

declare function nativeEmpty(): void

export abstract class Panel {
    private destroyed = false
    context!: BridgeContext
    onCreate() { }
    onDestroy() { }
    onShow() { }
    onHidden() { }

    abstract build(rootView: Group): void

    private __data__?: object
    private __root__ = new Root
    private headviews: Map<string, Map<string, View>> = new Map

    private onRenderFinishedCallback: Array<() => void> = []

    private __rendering__ = false

    addHeadView(type: string, v: View) {
        let map = this.headviews.get(type)
        if (map) {
            map.set(v.viewId, v)
        } else {
            map = new Map
            map.set(v.viewId, v)
            this.headviews.set(type, map)
        }
    }
    allHeadViews() {
        return this.headviews.values()
    }
    removeHeadView(type: string, v: View | string) {
        if (this.headviews.has(type)) {
            let map = this.headviews.get(type)
            if (map) {
                if (v instanceof View) {
                    map.delete(v.viewId)
                } else {
                    map.delete(v)
                }
            }
        }
    }

    clearHeadViews(type: string) {
        if (this.headviews.has(type)) {
            this.headviews.delete(type)
        }
    }

    getRootView() {
        return this.__root__
    }

    getInitData() {
        return this.__data__
    }

    @NativeCall
    private __init__(data?: string) {
        if (data) {
            this.__data__ = JSON.parse(data)
        }
    }

    @NativeCall
    private __onCreate__() {
        this.onCreate()
    }

    @NativeCall
    private __onDestroy__() {
        this.destroyed = true
        this.onDestroy()
    }

    @NativeCall
    private __onShow__() {
        this.onShow()
    }

    @NativeCall
    private __onHidden__(): void {
        this.onHidden()
    }

    @NativeCall
    private __build__(frame: Frame) {
        this.__root__.width = frame.width
        this.__root__.height = frame.height
        this.__root__.children.length = 0
        this.build(this.__root__)
    }

    @NativeCall
    private __response__(viewIds: string[], callbackId: string) {
        const v = this.retrospectView(viewIds)
        if (v === undefined) {
            loge(`Cannot find view for ${viewIds}`)
        } else {
            const argumentsList: any = [callbackId]
            for (let i = 2; i < arguments.length; i++) {
                argumentsList.push(arguments[i])
            }
            return Reflect.apply(v.responseCallback, v, argumentsList)
        }
    }

    private retrospectView(ids: string[]): View | undefined {
        return ids.reduce((acc: View | undefined, cur) => {
            if (acc === undefined) {
                if (cur === this.__root__.viewId) {
                    return this.__root__
                }
                for (let map of this.headviews.values()) {
                    if (map.has(cur)) {
                        return map.get(cur)
                    }
                }
                return undefined
            } else {
                if (Reflect.has(acc, "subviewById")) {
                    return Reflect.apply(Reflect.get(acc, "subviewById"), acc, [cur])
                }
                return acc
            }
        }, undefined)
    }

    private nativeRender(model: Model) {
        return this.context.callNative("shader", "render", model)
    }

    private hookBeforeNativeCall() {
        if (Environment.platform !== 'web') {
            this.__root__.clean()
            for (let map of this.headviews.values()) {
                for (let v of map.values()) {
                    v.clean()
                }
            }
        }
    }

    private hookAfterNativeCall() {
        if (this.destroyed) {
            return
        }
        const promises: Promise<any>[] = []
        if (Environment.platform !== 'web') {
            //Here insert a native call to ensure the promise is resolved done.
            nativeEmpty()
            if (this.__root__.isDirty()) {
                const model = this.__root__.toModel()
                promises.push(this.nativeRender(model))
            }
            for (let map of this.headviews.values()) {
                for (let v of map.values()) {
                    if (v.isDirty()) {
                        const model = v.toModel()
                        promises.push(this.nativeRender(model))
                    }
                }
            }
            if (this.__rendering__) {
                //skip
                Promise.all(promises).then(_ => {
                })
            } else {
                this.__rendering__ = true
                Promise.all(promises).then(_ => {
                    this.__rendering__ = false
                    this.onRenderFinished()
                })
            }
        } else {
            if (this.__rendering__) {
                //skip
                return;
            }
            this.__rendering__ = true
            Function("return this")().setTimeout(() => {
                if (this.__root__.isDirty()) {
                    const model = this.__root__.toModel()
                    promises.push(this.nativeRender(model))
                    this.__root__.clean()
                }
                for (let map of this.headviews.values()) {
                    for (let v of map.values()) {
                        if (v.isDirty()) {
                            const model = v.toModel()
                            promises.push(this.nativeRender(model))
                            v.clean()
                        }
                    }
                }
                this.__rendering__ = false
                Promise.all(promises).then(_ => {
                    this.onRenderFinished()
                })
            }, 0)
        }
    }

    onRenderFinished() {
        this.onRenderFinishedCallback.forEach(e => {
            e()
        })
        this.onRenderFinishedCallback.length = 0
    }

    addOnRenderFinishedCallback(cb: () => void) {
        this.onRenderFinishedCallback.push(cb)
    }
}
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
import '../runtime/global'
import { View, Group } from "./view"
import { loge } from '../util/log'
import { Model } from '../util/types'
import { Root } from '../widget/layouts'


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
    context?: any
    onCreate() { }
    onDestroy() { }
    onShow() { }
    onHidden() { }

    abstract build(rootView: Group): void

    private __data__: any
    private __root__ = new Root
    private headviews: Map<string, View> = new Map

    addHeadView(v: View) {
        this.headviews.set(v.viewId, v)
    }

    removeHeadView(v: View | string) {
        if (v instanceof View) {
            this.headviews.delete(v.viewId)
        } else {
            this.headviews.delete(v)
        }
    }

    getRootView() {
        return this.__root__
    }

    getInitData() {
        return this.__data__
    }
    constructor() {
        this.addHeadView(this.__root__)
    }

    @NativeCall
    private __init__(frame: Frame, data: any) {
        this.__data__ = data
        this.__root__.width = frame.width
        this.__root__.height = frame.height
        this.__root__.children.length = 0
        this.build(this.__root__)
    }

    @NativeCall
    private __onCreate__() {
        this.onCreate()
    }

    @NativeCall
    private __onDestroy__() {
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
    private __build__() {
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
                return this.headviews.get(cur)
            } else {
                if (Reflect.has(acc, "subviewById")) {
                    return Reflect.apply(Reflect.get(acc, "subviewById"), acc, [cur])
                }
                return acc
            }
        }, undefined)
    }

    private nativeRender(model: Model) {
        if (this.context) {
            this.context.shader.render(model)
        }
    }

    private hookBeforeNativeCall() {
        for (let v of this.headviews.values()) {
            v.clean()
        }
    }

    private hookAfterNativeCall() {
        //Here insert a native call to ensure the promise is resolved done.
        nativeEmpty()
        for (let v of this.headviews.values()) {
            if (v.isDirty()) {
                const model = v.toModel()
                this.nativeRender(model)
            }
        }
    }

}
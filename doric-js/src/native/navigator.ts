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
import { BridgeContext } from "../runtime/global"
import { ClassType } from "../pattern/mvvm"
import { Panel } from "../ui/panel"

export function internalScheme(context: BridgeContext, panelClass: ClassType<Panel>) {
    return `_internal_://export?class=${encodeURIComponent(panelClass.name)}&context=${context.id}`
}

export function navigator(context: BridgeContext) {
    const moduleName = "navigator"
    return {
        push: (source: string | ClassType<Panel>, config?: {
            alias?: string,
            animated?: boolean,
            extra?: object,
            singlePage?: boolean,
        }) => {
            if (typeof source === 'function') {
                source = internalScheme(context, source)
            }
            if (config && config.extra) {
                (config as any).extra = JSON.stringify(config.extra)
            }
            return context.callNative(moduleName, 'push', {
                source, config
            })
        },
        pop: (animated = true) => {
            return context.callNative(moduleName, 'pop', { animated })
        },
        openUrl: (url: string) => {
            return context.callNative(moduleName, "openUrl", url)
        },
    }
}
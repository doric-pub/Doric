import { Panel } from "../ui/panel"
import { ClassType } from "../pattern/mvvm"

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
export type BridgeContext = {
    /**
     * The identify of current context
     */
    id: string
    /**
     * In this case,It's current panel
     */
    entity: any
    /**
     * call native plugin
     * @param namespace 
     * @param method 
     * @param args 
     */
    callNative(namespace: string, method: string, args?: any): Promise<any>
    /**
     * Transform function to functionId as string
     * @param func 
     */
    function2Id(func: Function): string
    /**
     * Remove transformed functions
     * @param funcId 
     */
    removeFuncById(funcId: string): void
}

declare global {
    const context: BridgeContext
    const Environment: {
        platform: "Android" | "iOS" | "Qt" | "web",

        platformVersion: string,

        appName: string,

        appVersion: string,

        libVersion: string,

        screenWidth: number,

        screenHeight: number,

        screenScale: number,

        statusBarHeight: number,

        hasNotch: boolean,

        /**
         * ex:Apple or Google 
         */
        deviceBrand: string,
        /**
         * ex: iPhone12,5 or pixel 3
         */
        deviceModel: string,
        [index: string]: number | string | boolean | object | undefined
    }

    function Entry(constructor: ClassType<Panel>): void

    function Entry(exports: ClassType<Panel>[]): (constructor: ClassType<Panel>) => void;
}
export { }
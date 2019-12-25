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
export * from 'reflect-metadata'

export type BridgeContext = { [index: string]: { [index: string]: (args?: any) => Promise<any> } }

declare global {
    const context: BridgeContext
    const Environment: {
        platform: "Android" | "iOS" | "Qt" | "h5",

        platformVersion: string,

        appName: string,

        appVersion: string,

        libVersion: string,

        screenWidth: number,

        screenHeight: number,

    }
    function Entry(constructor: { new(...args: any[]): {} }): any
}
export { }
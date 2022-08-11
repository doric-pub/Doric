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

declare global {
    namespace Reflect {
        function decorate(decorators: ClassDecorator[], target: Function): Function;
        function decorate(decorators: (PropertyDecorator | MethodDecorator)[], target: Object, propertyKey: string | symbol, attributes?: PropertyDescriptor): PropertyDescriptor;
        function metadata(metadataKey: any, metadataValue: any): {
            (target: Function): void;
            (target: Object, propertyKey: string | symbol): void;
        };
        function defineMetadata(metadataKey: any, metadataValue: any, target: Object): void;
        function defineMetadata(metadataKey: any, metadataValue: any, target: Object, propertyKey: string | symbol): void;
        function hasMetadata(metadataKey: any, target: Object): boolean;
        function hasMetadata(metadataKey: any, target: Object, propertyKey: string | symbol): boolean;
        function hasOwnMetadata(metadataKey: any, target: Object): boolean;
        function hasOwnMetadata(metadataKey: any, target: Object, propertyKey: string | symbol): boolean;
        function getMetadata(metadataKey: any, target: Object): any;
        function getMetadata(metadataKey: any, target: Object, propertyKey: string | symbol): any;
        function getOwnMetadata(metadataKey: any, target: Object): any;
        function getOwnMetadata(metadataKey: any, target: Object, propertyKey: string | symbol): any;
        function getMetadataKeys(target: Object): any[];
        function getMetadataKeys(target: Object, propertyKey: string | symbol): any[];
        function getOwnMetadataKeys(target: Object): any[];
        function getOwnMetadataKeys(target: Object, propertyKey: string | symbol): any[];
        function deleteMetadata(metadataKey: any, target: Object): boolean;
        function deleteMetadata(metadataKey: any, target: Object, propertyKey: string | symbol): boolean;
    }
}

export * from './src/runtime/global'
export * from './src/ui/index.ui'
export * from "./src/widget/index.widget"
export * from './src/native/index.native'
export * from "./src/util/index.util"
export * from "./src/pattern/index.pattern"
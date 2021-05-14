'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var WebSocket = require('ws');
var path = require('path');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var WebSocket__default = /*#__PURE__*/_interopDefaultLegacy(WebSocket);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);

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
let __uniqueId__ = 0;
function uniqueId(prefix) {
    return `__${prefix}_${__uniqueId__++}__`;
}

function toString(message) {
    if (message instanceof Function) {
        return message.toString();
    }
    else if (message instanceof Object) {
        try {
            return JSON.stringify(message);
        }
        catch (e) {
            return message.toString();
        }
    }
    else if (message === undefined) {
        return "undefined";
    }
    else {
        return message.toString();
    }
}
function log(...args) {
    let out = "";
    for (let i = 0; i < arguments.length; i++) {
        if (i > 0) {
            out += ',';
        }
        out += toString(arguments[i]);
    }
    nativeLog('d', out);
}
function loge(...message) {
    let out = "";
    for (let i = 0; i < arguments.length; i++) {
        if (i > 0) {
            out += ',';
        }
        out += toString(arguments[i]);
    }
    nativeLog('e', out);
}
function logw(...message) {
    let out = "";
    for (let i = 0; i < arguments.length; i++) {
        if (i > 0) {
            out += ',';
        }
        out += toString(arguments[i]);
    }
    nativeLog('w', out);
}

/*! *****************************************************************************
Copyright (C) Microsoft. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
var Reflect$1;
(function (Reflect) {
    // Metadata Proposal
    // https://rbuckton.github.io/reflect-metadata/
    (function (factory) {
        var root = typeof global === "object" ? global :
            typeof self === "object" ? self :
                typeof this === "object" ? this :
                    Function("return this;")();
        var exporter = makeExporter(Reflect);
        if (typeof root.Reflect === "undefined") {
            root.Reflect = Reflect;
        }
        else {
            exporter = makeExporter(root.Reflect, exporter);
        }
        factory(exporter);
        function makeExporter(target, previous) {
            return function (key, value) {
                if (typeof target[key] !== "function") {
                    Object.defineProperty(target, key, { configurable: true, writable: true, value: value });
                }
                if (previous)
                    previous(key, value);
            };
        }
    })(function (exporter) {
        var hasOwn = Object.prototype.hasOwnProperty;
        // feature test for Symbol support
        var supportsSymbol = typeof Symbol === "function";
        var toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
        var iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== "undefined" ? Symbol.iterator : "@@iterator";
        var supportsCreate = typeof Object.create === "function"; // feature test for Object.create support
        var supportsProto = { __proto__: [] } instanceof Array; // feature test for __proto__ support
        var downLevel = !supportsCreate && !supportsProto;
        var HashMap = {
            // create an object in dictionary mode (a.k.a. "slow" mode in v8)
            create: supportsCreate
                ? function () { return MakeDictionary(Object.create(null)); }
                : supportsProto
                    ? function () { return MakeDictionary({ __proto__: null }); }
                    : function () { return MakeDictionary({}); },
            has: downLevel
                ? function (map, key) { return hasOwn.call(map, key); }
                : function (map, key) { return key in map; },
            get: downLevel
                ? function (map, key) { return hasOwn.call(map, key) ? map[key] : undefined; }
                : function (map, key) { return map[key]; },
        };
        // Load global or shim versions of Map, Set, and WeakMap
        var functionPrototype = Object.getPrototypeOf(Function);
        var usePolyfill = typeof process === "object" && process.env && process.env["REFLECT_METADATA_USE_MAP_POLYFILL"] === "true";
        var _Map = !usePolyfill && typeof Map === "function" && typeof Map.prototype.entries === "function" ? Map : CreateMapPolyfill();
        var _Set = !usePolyfill && typeof Set === "function" && typeof Set.prototype.entries === "function" ? Set : CreateSetPolyfill();
        var _WeakMap = !usePolyfill && typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
        // [[Metadata]] internal slot
        // https://rbuckton.github.io/reflect-metadata/#ordinary-object-internal-methods-and-internal-slots
        var Metadata = new _WeakMap();
        /**
         * Applies a set of decorators to a property of a target object.
         * @param decorators An array of decorators.
         * @param target The target object.
         * @param propertyKey (Optional) The property key to decorate.
         * @param attributes (Optional) The property descriptor for the target key.
         * @remarks Decorators are applied in reverse order.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     Example = Reflect.decorate(decoratorsArray, Example);
         *
         *     // property (on constructor)
         *     Reflect.decorate(decoratorsArray, Example, "staticProperty");
         *
         *     // property (on prototype)
         *     Reflect.decorate(decoratorsArray, Example.prototype, "property");
         *
         *     // method (on constructor)
         *     Object.defineProperty(Example, "staticMethod",
         *         Reflect.decorate(decoratorsArray, Example, "staticMethod",
         *             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
         *
         *     // method (on prototype)
         *     Object.defineProperty(Example.prototype, "method",
         *         Reflect.decorate(decoratorsArray, Example.prototype, "method",
         *             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
         *
         */
        function decorate(decorators, target, propertyKey, attributes) {
            if (!IsUndefined(propertyKey)) {
                if (!IsArray(decorators))
                    throw new TypeError();
                if (!IsObject(target))
                    throw new TypeError();
                if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes))
                    throw new TypeError();
                if (IsNull(attributes))
                    attributes = undefined;
                propertyKey = ToPropertyKey(propertyKey);
                return DecorateProperty(decorators, target, propertyKey, attributes);
            }
            else {
                if (!IsArray(decorators))
                    throw new TypeError();
                if (!IsConstructor(target))
                    throw new TypeError();
                return DecorateConstructor(decorators, target);
            }
        }
        exporter("decorate", decorate);
        // 4.1.2 Reflect.metadata(metadataKey, metadataValue)
        // https://rbuckton.github.io/reflect-metadata/#reflect.metadata
        /**
         * A default metadata decorator factory that can be used on a class, class member, or parameter.
         * @param metadataKey The key for the metadata entry.
         * @param metadataValue The value for the metadata entry.
         * @returns A decorator function.
         * @remarks
         * If `metadataKey` is already defined for the target and target key, the
         * metadataValue for that key will be overwritten.
         * @example
         *
         *     // constructor
         *     @Reflect.metadata(key, value)
         *     class Example {
         *     }
         *
         *     // property (on constructor, TypeScript only)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         static staticProperty;
         *     }
         *
         *     // property (on prototype, TypeScript only)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         property;
         *     }
         *
         *     // method (on constructor)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         static staticMethod() { }
         *     }
         *
         *     // method (on prototype)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         method() { }
         *     }
         *
         */
        function metadata(metadataKey, metadataValue) {
            function decorator(target, propertyKey) {
                if (!IsObject(target))
                    throw new TypeError();
                if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey))
                    throw new TypeError();
                OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
            }
            return decorator;
        }
        exporter("metadata", metadata);
        /**
         * Define a unique metadata entry on the target.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param metadataValue A value that contains attached metadata.
         * @param target The target object on which to define metadata.
         * @param propertyKey (Optional) The property key for the target.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     Reflect.defineMetadata("custom:annotation", options, Example);
         *
         *     // property (on constructor)
         *     Reflect.defineMetadata("custom:annotation", options, Example, "staticProperty");
         *
         *     // property (on prototype)
         *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "property");
         *
         *     // method (on constructor)
         *     Reflect.defineMetadata("custom:annotation", options, Example, "staticMethod");
         *
         *     // method (on prototype)
         *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "method");
         *
         *     // decorator factory as metadata-producing annotation.
         *     function MyAnnotation(options): Decorator {
         *         return (target, key?) => Reflect.defineMetadata("custom:annotation", options, target, key);
         *     }
         *
         */
        function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
        }
        exporter("defineMetadata", defineMetadata);
        /**
         * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.hasMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.hasMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.hasMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function hasMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryHasMetadata(metadataKey, target, propertyKey);
        }
        exporter("hasMetadata", hasMetadata);
        /**
         * Gets a value indicating whether the target object has the provided metadata key defined.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function hasOwnMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
        }
        exporter("hasOwnMetadata", hasOwnMetadata);
        /**
         * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function getMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryGetMetadata(metadataKey, target, propertyKey);
        }
        exporter("getMetadata", getMetadata);
        /**
         * Gets the metadata value for the provided metadata key on the target object.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getOwnMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function getOwnMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
        }
        exporter("getOwnMetadata", getOwnMetadata);
        /**
         * Gets the metadata keys defined on the target object or its prototype chain.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns An array of unique metadata keys.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getMetadataKeys(Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getMetadataKeys(Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getMetadataKeys(Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getMetadataKeys(Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getMetadataKeys(Example.prototype, "method");
         *
         */
        function getMetadataKeys(target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryMetadataKeys(target, propertyKey);
        }
        exporter("getMetadataKeys", getMetadataKeys);
        /**
         * Gets the unique metadata keys defined on the target object.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns An array of unique metadata keys.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getOwnMetadataKeys(Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getOwnMetadataKeys(Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getOwnMetadataKeys(Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getOwnMetadataKeys(Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getOwnMetadataKeys(Example.prototype, "method");
         *
         */
        function getOwnMetadataKeys(target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryOwnMetadataKeys(target, propertyKey);
        }
        exporter("getOwnMetadataKeys", getOwnMetadataKeys);
        /**
         * Deletes the metadata entry from the target object with the provided key.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns `true` if the metadata entry was found and deleted; otherwise, false.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.deleteMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function deleteMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            var metadataMap = GetOrCreateMetadataMap(target, propertyKey, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return false;
            if (!metadataMap.delete(metadataKey))
                return false;
            if (metadataMap.size > 0)
                return true;
            var targetMetadata = Metadata.get(target);
            targetMetadata.delete(propertyKey);
            if (targetMetadata.size > 0)
                return true;
            Metadata.delete(target);
            return true;
        }
        exporter("deleteMetadata", deleteMetadata);
        function DecorateConstructor(decorators, target) {
            for (var i = decorators.length - 1; i >= 0; --i) {
                var decorator = decorators[i];
                var decorated = decorator(target);
                if (!IsUndefined(decorated) && !IsNull(decorated)) {
                    if (!IsConstructor(decorated))
                        throw new TypeError();
                    target = decorated;
                }
            }
            return target;
        }
        function DecorateProperty(decorators, target, propertyKey, descriptor) {
            for (var i = decorators.length - 1; i >= 0; --i) {
                var decorator = decorators[i];
                var decorated = decorator(target, propertyKey, descriptor);
                if (!IsUndefined(decorated) && !IsNull(decorated)) {
                    if (!IsObject(decorated))
                        throw new TypeError();
                    descriptor = decorated;
                }
            }
            return descriptor;
        }
        function GetOrCreateMetadataMap(O, P, Create) {
            var targetMetadata = Metadata.get(O);
            if (IsUndefined(targetMetadata)) {
                if (!Create)
                    return undefined;
                targetMetadata = new _Map();
                Metadata.set(O, targetMetadata);
            }
            var metadataMap = targetMetadata.get(P);
            if (IsUndefined(metadataMap)) {
                if (!Create)
                    return undefined;
                metadataMap = new _Map();
                targetMetadata.set(P, metadataMap);
            }
            return metadataMap;
        }
        // 3.1.1.1 OrdinaryHasMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinaryhasmetadata
        function OrdinaryHasMetadata(MetadataKey, O, P) {
            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
            if (hasOwn)
                return true;
            var parent = OrdinaryGetPrototypeOf(O);
            if (!IsNull(parent))
                return OrdinaryHasMetadata(MetadataKey, parent, P);
            return false;
        }
        // 3.1.2.1 OrdinaryHasOwnMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinaryhasownmetadata
        function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return false;
            return ToBoolean(metadataMap.has(MetadataKey));
        }
        // 3.1.3.1 OrdinaryGetMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarygetmetadata
        function OrdinaryGetMetadata(MetadataKey, O, P) {
            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
            if (hasOwn)
                return OrdinaryGetOwnMetadata(MetadataKey, O, P);
            var parent = OrdinaryGetPrototypeOf(O);
            if (!IsNull(parent))
                return OrdinaryGetMetadata(MetadataKey, parent, P);
            return undefined;
        }
        // 3.1.4.1 OrdinaryGetOwnMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarygetownmetadata
        function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return undefined;
            return metadataMap.get(MetadataKey);
        }
        // 3.1.5.1 OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarydefineownmetadata
        function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ true);
            metadataMap.set(MetadataKey, MetadataValue);
        }
        // 3.1.6.1 OrdinaryMetadataKeys(O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarymetadatakeys
        function OrdinaryMetadataKeys(O, P) {
            var ownKeys = OrdinaryOwnMetadataKeys(O, P);
            var parent = OrdinaryGetPrototypeOf(O);
            if (parent === null)
                return ownKeys;
            var parentKeys = OrdinaryMetadataKeys(parent, P);
            if (parentKeys.length <= 0)
                return ownKeys;
            if (ownKeys.length <= 0)
                return parentKeys;
            var set = new _Set();
            var keys = [];
            for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
                var key = ownKeys_1[_i];
                var hasKey = set.has(key);
                if (!hasKey) {
                    set.add(key);
                    keys.push(key);
                }
            }
            for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
                var key = parentKeys_1[_a];
                var hasKey = set.has(key);
                if (!hasKey) {
                    set.add(key);
                    keys.push(key);
                }
            }
            return keys;
        }
        // 3.1.7.1 OrdinaryOwnMetadataKeys(O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinaryownmetadatakeys
        function OrdinaryOwnMetadataKeys(O, P) {
            var keys = [];
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return keys;
            var keysObj = metadataMap.keys();
            var iterator = GetIterator(keysObj);
            var k = 0;
            while (true) {
                var next = IteratorStep(iterator);
                if (!next) {
                    keys.length = k;
                    return keys;
                }
                var nextValue = IteratorValue(next);
                try {
                    keys[k] = nextValue;
                }
                catch (e) {
                    try {
                        IteratorClose(iterator);
                    }
                    finally {
                        throw e;
                    }
                }
                k++;
            }
        }
        // 6 ECMAScript Data Typ0es and Values
        // https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values
        function Type(x) {
            if (x === null)
                return 1 /* Null */;
            switch (typeof x) {
                case "undefined": return 0 /* Undefined */;
                case "boolean": return 2 /* Boolean */;
                case "string": return 3 /* String */;
                case "symbol": return 4 /* Symbol */;
                case "number": return 5 /* Number */;
                case "object": return x === null ? 1 /* Null */ : 6 /* Object */;
                default: return 6 /* Object */;
            }
        }
        // 6.1.1 The Undefined Type
        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-undefined-type
        function IsUndefined(x) {
            return x === undefined;
        }
        // 6.1.2 The Null Type
        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-null-type
        function IsNull(x) {
            return x === null;
        }
        // 6.1.5 The Symbol Type
        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-symbol-type
        function IsSymbol(x) {
            return typeof x === "symbol";
        }
        // 6.1.7 The Object Type
        // https://tc39.github.io/ecma262/#sec-object-type
        function IsObject(x) {
            return typeof x === "object" ? x !== null : typeof x === "function";
        }
        // 7.1 Type Conversion
        // https://tc39.github.io/ecma262/#sec-type-conversion
        // 7.1.1 ToPrimitive(input [, PreferredType])
        // https://tc39.github.io/ecma262/#sec-toprimitive
        function ToPrimitive(input, PreferredType) {
            switch (Type(input)) {
                case 0 /* Undefined */: return input;
                case 1 /* Null */: return input;
                case 2 /* Boolean */: return input;
                case 3 /* String */: return input;
                case 4 /* Symbol */: return input;
                case 5 /* Number */: return input;
            }
            var hint = PreferredType === 3 /* String */ ? "string" : PreferredType === 5 /* Number */ ? "number" : "default";
            var exoticToPrim = GetMethod(input, toPrimitiveSymbol);
            if (exoticToPrim !== undefined) {
                var result = exoticToPrim.call(input, hint);
                if (IsObject(result))
                    throw new TypeError();
                return result;
            }
            return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
        }
        // 7.1.1.1 OrdinaryToPrimitive(O, hint)
        // https://tc39.github.io/ecma262/#sec-ordinarytoprimitive
        function OrdinaryToPrimitive(O, hint) {
            if (hint === "string") {
                var toString_1 = O.toString;
                if (IsCallable(toString_1)) {
                    var result = toString_1.call(O);
                    if (!IsObject(result))
                        return result;
                }
                var valueOf = O.valueOf;
                if (IsCallable(valueOf)) {
                    var result = valueOf.call(O);
                    if (!IsObject(result))
                        return result;
                }
            }
            else {
                var valueOf = O.valueOf;
                if (IsCallable(valueOf)) {
                    var result = valueOf.call(O);
                    if (!IsObject(result))
                        return result;
                }
                var toString_2 = O.toString;
                if (IsCallable(toString_2)) {
                    var result = toString_2.call(O);
                    if (!IsObject(result))
                        return result;
                }
            }
            throw new TypeError();
        }
        // 7.1.2 ToBoolean(argument)
        // https://tc39.github.io/ecma262/2016/#sec-toboolean
        function ToBoolean(argument) {
            return !!argument;
        }
        // 7.1.12 ToString(argument)
        // https://tc39.github.io/ecma262/#sec-tostring
        function ToString(argument) {
            return "" + argument;
        }
        // 7.1.14 ToPropertyKey(argument)
        // https://tc39.github.io/ecma262/#sec-topropertykey
        function ToPropertyKey(argument) {
            var key = ToPrimitive(argument, 3 /* String */);
            if (IsSymbol(key))
                return key;
            return ToString(key);
        }
        // 7.2 Testing and Comparison Operations
        // https://tc39.github.io/ecma262/#sec-testing-and-comparison-operations
        // 7.2.2 IsArray(argument)
        // https://tc39.github.io/ecma262/#sec-isarray
        function IsArray(argument) {
            return Array.isArray
                ? Array.isArray(argument)
                : argument instanceof Object
                    ? argument instanceof Array
                    : Object.prototype.toString.call(argument) === "[object Array]";
        }
        // 7.2.3 IsCallable(argument)
        // https://tc39.github.io/ecma262/#sec-iscallable
        function IsCallable(argument) {
            // NOTE: This is an approximation as we cannot check for [[Call]] internal method.
            return typeof argument === "function";
        }
        // 7.2.4 IsConstructor(argument)
        // https://tc39.github.io/ecma262/#sec-isconstructor
        function IsConstructor(argument) {
            // NOTE: This is an approximation as we cannot check for [[Construct]] internal method.
            return typeof argument === "function";
        }
        // 7.2.7 IsPropertyKey(argument)
        // https://tc39.github.io/ecma262/#sec-ispropertykey
        function IsPropertyKey(argument) {
            switch (Type(argument)) {
                case 3 /* String */: return true;
                case 4 /* Symbol */: return true;
                default: return false;
            }
        }
        // 7.3 Operations on Objects
        // https://tc39.github.io/ecma262/#sec-operations-on-objects
        // 7.3.9 GetMethod(V, P)
        // https://tc39.github.io/ecma262/#sec-getmethod
        function GetMethod(V, P) {
            var func = V[P];
            if (func === undefined || func === null)
                return undefined;
            if (!IsCallable(func))
                throw new TypeError();
            return func;
        }
        // 7.4 Operations on Iterator Objects
        // https://tc39.github.io/ecma262/#sec-operations-on-iterator-objects
        function GetIterator(obj) {
            var method = GetMethod(obj, iteratorSymbol);
            if (!IsCallable(method))
                throw new TypeError(); // from Call
            var iterator = method.call(obj);
            if (!IsObject(iterator))
                throw new TypeError();
            return iterator;
        }
        // 7.4.4 IteratorValue(iterResult)
        // https://tc39.github.io/ecma262/2016/#sec-iteratorvalue
        function IteratorValue(iterResult) {
            return iterResult.value;
        }
        // 7.4.5 IteratorStep(iterator)
        // https://tc39.github.io/ecma262/#sec-iteratorstep
        function IteratorStep(iterator) {
            var result = iterator.next();
            return result.done ? false : result;
        }
        // 7.4.6 IteratorClose(iterator, completion)
        // https://tc39.github.io/ecma262/#sec-iteratorclose
        function IteratorClose(iterator) {
            var f = iterator["return"];
            if (f)
                f.call(iterator);
        }
        // 9.1 Ordinary Object Internal Methods and Internal Slots
        // https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots
        // 9.1.1.1 OrdinaryGetPrototypeOf(O)
        // https://tc39.github.io/ecma262/#sec-ordinarygetprototypeof
        function OrdinaryGetPrototypeOf(O) {
            var proto = Object.getPrototypeOf(O);
            if (typeof O !== "function" || O === functionPrototype)
                return proto;
            // TypeScript doesn't set __proto__ in ES5, as it's non-standard.
            // Try to determine the superclass constructor. Compatible implementations
            // must either set __proto__ on a subclass constructor to the superclass constructor,
            // or ensure each class has a valid `constructor` property on its prototype that
            // points back to the constructor.
            // If this is not the same as Function.[[Prototype]], then this is definately inherited.
            // This is the case when in ES6 or when using __proto__ in a compatible browser.
            if (proto !== functionPrototype)
                return proto;
            // If the super prototype is Object.prototype, null, or undefined, then we cannot determine the heritage.
            var prototype = O.prototype;
            var prototypeProto = prototype && Object.getPrototypeOf(prototype);
            if (prototypeProto == null || prototypeProto === Object.prototype)
                return proto;
            // If the constructor was not a function, then we cannot determine the heritage.
            var constructor = prototypeProto.constructor;
            if (typeof constructor !== "function")
                return proto;
            // If we have some kind of self-reference, then we cannot determine the heritage.
            if (constructor === O)
                return proto;
            // we have a pretty good guess at the heritage.
            return constructor;
        }
        // naive Map shim
        function CreateMapPolyfill() {
            var cacheSentinel = {};
            var arraySentinel = [];
            var MapIterator = /** @class */ (function () {
                function MapIterator(keys, values, selector) {
                    this._index = 0;
                    this._keys = keys;
                    this._values = values;
                    this._selector = selector;
                }
                MapIterator.prototype["@@iterator"] = function () { return this; };
                MapIterator.prototype[iteratorSymbol] = function () { return this; };
                MapIterator.prototype.next = function () {
                    var index = this._index;
                    if (index >= 0 && index < this._keys.length) {
                        var result = this._selector(this._keys[index], this._values[index]);
                        if (index + 1 >= this._keys.length) {
                            this._index = -1;
                            this._keys = arraySentinel;
                            this._values = arraySentinel;
                        }
                        else {
                            this._index++;
                        }
                        return { value: result, done: false };
                    }
                    return { value: undefined, done: true };
                };
                MapIterator.prototype.throw = function (error) {
                    if (this._index >= 0) {
                        this._index = -1;
                        this._keys = arraySentinel;
                        this._values = arraySentinel;
                    }
                    throw error;
                };
                MapIterator.prototype.return = function (value) {
                    if (this._index >= 0) {
                        this._index = -1;
                        this._keys = arraySentinel;
                        this._values = arraySentinel;
                    }
                    return { value: value, done: true };
                };
                return MapIterator;
            }());
            return /** @class */ (function () {
                function Map() {
                    this._keys = [];
                    this._values = [];
                    this._cacheKey = cacheSentinel;
                    this._cacheIndex = -2;
                }
                Object.defineProperty(Map.prototype, "size", {
                    get: function () { return this._keys.length; },
                    enumerable: true,
                    configurable: true
                });
                Map.prototype.has = function (key) { return this._find(key, /*insert*/ false) >= 0; };
                Map.prototype.get = function (key) {
                    var index = this._find(key, /*insert*/ false);
                    return index >= 0 ? this._values[index] : undefined;
                };
                Map.prototype.set = function (key, value) {
                    var index = this._find(key, /*insert*/ true);
                    this._values[index] = value;
                    return this;
                };
                Map.prototype.delete = function (key) {
                    var index = this._find(key, /*insert*/ false);
                    if (index >= 0) {
                        var size = this._keys.length;
                        for (var i = index + 1; i < size; i++) {
                            this._keys[i - 1] = this._keys[i];
                            this._values[i - 1] = this._values[i];
                        }
                        this._keys.length--;
                        this._values.length--;
                        if (key === this._cacheKey) {
                            this._cacheKey = cacheSentinel;
                            this._cacheIndex = -2;
                        }
                        return true;
                    }
                    return false;
                };
                Map.prototype.clear = function () {
                    this._keys.length = 0;
                    this._values.length = 0;
                    this._cacheKey = cacheSentinel;
                    this._cacheIndex = -2;
                };
                Map.prototype.keys = function () { return new MapIterator(this._keys, this._values, getKey); };
                Map.prototype.values = function () { return new MapIterator(this._keys, this._values, getValue); };
                Map.prototype.entries = function () { return new MapIterator(this._keys, this._values, getEntry); };
                Map.prototype["@@iterator"] = function () { return this.entries(); };
                Map.prototype[iteratorSymbol] = function () { return this.entries(); };
                Map.prototype._find = function (key, insert) {
                    if (this._cacheKey !== key) {
                        this._cacheIndex = this._keys.indexOf(this._cacheKey = key);
                    }
                    if (this._cacheIndex < 0 && insert) {
                        this._cacheIndex = this._keys.length;
                        this._keys.push(key);
                        this._values.push(undefined);
                    }
                    return this._cacheIndex;
                };
                return Map;
            }());
            function getKey(key, _) {
                return key;
            }
            function getValue(_, value) {
                return value;
            }
            function getEntry(key, value) {
                return [key, value];
            }
        }
        // naive Set shim
        function CreateSetPolyfill() {
            return /** @class */ (function () {
                function Set() {
                    this._map = new _Map();
                }
                Object.defineProperty(Set.prototype, "size", {
                    get: function () { return this._map.size; },
                    enumerable: true,
                    configurable: true
                });
                Set.prototype.has = function (value) { return this._map.has(value); };
                Set.prototype.add = function (value) { return this._map.set(value, value), this; };
                Set.prototype.delete = function (value) { return this._map.delete(value); };
                Set.prototype.clear = function () { this._map.clear(); };
                Set.prototype.keys = function () { return this._map.keys(); };
                Set.prototype.values = function () { return this._map.values(); };
                Set.prototype.entries = function () { return this._map.entries(); };
                Set.prototype["@@iterator"] = function () { return this.keys(); };
                Set.prototype[iteratorSymbol] = function () { return this.keys(); };
                return Set;
            }());
        }
        // naive WeakMap shim
        function CreateWeakMapPolyfill() {
            var UUID_SIZE = 16;
            var keys = HashMap.create();
            var rootKey = CreateUniqueKey();
            return /** @class */ (function () {
                function WeakMap() {
                    this._key = CreateUniqueKey();
                }
                WeakMap.prototype.has = function (target) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                    return table !== undefined ? HashMap.has(table, this._key) : false;
                };
                WeakMap.prototype.get = function (target) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                    return table !== undefined ? HashMap.get(table, this._key) : undefined;
                };
                WeakMap.prototype.set = function (target, value) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ true);
                    table[this._key] = value;
                    return this;
                };
                WeakMap.prototype.delete = function (target) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                    return table !== undefined ? delete table[this._key] : false;
                };
                WeakMap.prototype.clear = function () {
                    // NOTE: not a real clear, just makes the previous data unreachable
                    this._key = CreateUniqueKey();
                };
                return WeakMap;
            }());
            function CreateUniqueKey() {
                var key;
                do
                    key = "@@WeakMap@@" + CreateUUID();
                while (HashMap.has(keys, key));
                keys[key] = true;
                return key;
            }
            function GetOrCreateWeakMapTable(target, create) {
                if (!hasOwn.call(target, rootKey)) {
                    if (!create)
                        return undefined;
                    Object.defineProperty(target, rootKey, { value: HashMap.create() });
                }
                return target[rootKey];
            }
            function FillRandomBytes(buffer, size) {
                for (var i = 0; i < size; ++i)
                    buffer[i] = Math.random() * 0xff | 0;
                return buffer;
            }
            function GenRandomBytes(size) {
                if (typeof Uint8Array === "function") {
                    if (typeof crypto !== "undefined")
                        return crypto.getRandomValues(new Uint8Array(size));
                    if (typeof msCrypto !== "undefined")
                        return msCrypto.getRandomValues(new Uint8Array(size));
                    return FillRandomBytes(new Uint8Array(size), size);
                }
                return FillRandomBytes(new Array(size), size);
            }
            function CreateUUID() {
                var data = GenRandomBytes(UUID_SIZE);
                // mark as random - RFC 4122 § 4.4
                data[6] = data[6] & 0x4f | 0x40;
                data[8] = data[8] & 0xbf | 0x80;
                var result = "";
                for (var offset = 0; offset < UUID_SIZE; ++offset) {
                    var byte = data[offset];
                    if (offset === 4 || offset === 6 || offset === 8)
                        result += "-";
                    if (byte < 16)
                        result += "0";
                    result += byte.toString(16).toLowerCase();
                }
                return result;
            }
        }
        // uses a heuristic used by v8 and chakra to force an object into dictionary mode.
        function MakeDictionary(obj) {
            obj.__ = undefined;
            delete obj.__;
            return obj;
        }
    });
})(Reflect$1 || (Reflect$1 = {}));

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
function hookBeforeNativeCall(context) {
    if (context) {
        Reflect.defineMetadata('__doric_context__', context, global$2);
        context.hookBeforeNativeCall();
    }
}
function hookAfterNativeCall(context) {
    if (context) {
        context.hookAfterNativeCall();
    }
}
function getContext() {
    return Reflect.getMetadata('__doric_context__', global$2);
}
function setContext(context) {
    Reflect.defineMetadata('__doric_context__', context, global$2);
}
function jsCallResolve(contextId, callbackId, args) {
    const context = gContexts.get(contextId);
    if (context === undefined) {
        loge(`Cannot find context for context id:${contextId}`);
        return;
    }
    const callback = context.callbacks.get(callbackId);
    if (callback === undefined) {
        loge(`Cannot find call for context id:${contextId},callback id:${callbackId}`);
        return;
    }
    const argumentsList = [];
    for (let i = 2; i < arguments.length; i++) {
        argumentsList.push(arguments[i]);
    }
    hookBeforeNativeCall(context);
    Reflect.apply(callback.resolve, context, argumentsList);
    hookAfterNativeCall(context);
}
function jsCallReject(contextId, callbackId, args) {
    const context = gContexts.get(contextId);
    if (context === undefined) {
        loge(`Cannot find context for context id:${contextId}`);
        return;
    }
    const callback = context.callbacks.get(callbackId);
    if (callback === undefined) {
        loge(`Cannot find call for context id:${contextId},callback id:${callbackId}`);
        return;
    }
    const argumentsList = [];
    for (let i = 2; i < arguments.length; i++) {
        argumentsList.push(arguments[i]);
    }
    hookBeforeNativeCall(context);
    Reflect.apply(callback.reject, context.entity, argumentsList);
    hookAfterNativeCall(context);
}
class Context {
    constructor(id) {
        this.callbacks = new Map;
        this.classes = new Map;
        this.id = id;
        return new Proxy(this, {
            get: (target, p) => {
                if (Reflect.has(target, p)) {
                    return Reflect.get(target, p);
                }
                else {
                    const namespace = p;
                    return new Proxy({}, {
                        get: (target, p) => {
                            if (Reflect.has(target, p)) {
                                return Reflect.get(target, p);
                            }
                            else {
                                const context = this;
                                return function () {
                                    const args = [];
                                    args.push(namespace);
                                    args.push(p);
                                    for (let arg of arguments) {
                                        args.push(arg);
                                    }
                                    return Reflect.apply(context.callNative, context, args);
                                };
                            }
                        }
                    });
                }
            }
        });
    }
    hookBeforeNativeCall() {
        if (this.entity && Reflect.has(this.entity, 'hookBeforeNativeCall')) {
            Reflect.apply(Reflect.get(this.entity, 'hookBeforeNativeCall'), this.entity, []);
        }
    }
    hookAfterNativeCall() {
        if (this.entity && Reflect.has(this.entity, 'hookAfterNativeCall')) {
            Reflect.apply(Reflect.get(this.entity, 'hookAfterNativeCall'), this.entity, []);
        }
    }
    callNative(namespace, method, args) {
        const callbackId = uniqueId('callback');
        nativeBridge(this.id, namespace, method, callbackId, args);
        return new Promise((resolve, reject) => {
            this.callbacks.set(callbackId, {
                resolve,
                reject,
            });
        });
    }
    register(instance) {
        this.entity = instance;
    }
    function2Id(func) {
        const functionId = uniqueId('function');
        this.callbacks.set(functionId, {
            resolve: func,
            reject: () => { loge("This should not be called"); }
        });
        return functionId;
    }
    removeFuncById(funcId) {
        this.callbacks.delete(funcId);
    }
}
const gContexts = new Map;
const gModules = new Map;
function allContexts() {
    return gContexts.values();
}
function jsObtainContext(id) {
    if (gContexts.has(id)) {
        const context = gContexts.get(id);
        setContext(context);
        return context;
    }
    else {
        const context = new Context(id);
        gContexts.set(id, context);
        setContext(context);
        return context;
    }
}
function jsReleaseContext(id) {
    const context = gContexts.get(id);
    const args = arguments;
    if (context) {
        timerInfos.forEach((v, k) => {
            if (v.context === context) {
                if (global$2.nativeClearTimer === undefined) {
                    return Reflect.apply(_clearTimeout, undefined, args);
                }
                timerInfos.delete(k);
                nativeClearTimer(k);
            }
        });
    }
    gContexts.delete(id);
}
function __require__(name) {
    if (gModules.has(name)) {
        return gModules.get(name);
    }
    else {
        if (nativeRequire(name)) {
            return gModules.get(name);
        }
        else {
            return undefined;
        }
    }
}
function jsRegisterModule(name, moduleObject) {
    gModules.set(name, moduleObject);
}
function jsCallEntityMethod(contextId, methodName, args) {
    const context = gContexts.get(contextId);
    if (context === undefined) {
        loge(`Cannot find context for context id:${contextId}`);
        return;
    }
    if (context.entity === undefined) {
        loge(`Cannot find holder for context id:${contextId}`);
        return;
    }
    if (Reflect.has(context.entity, methodName)) {
        const argumentsList = [];
        for (let i = 2; i < arguments.length; i++) {
            argumentsList.push(arguments[i]);
        }
        hookBeforeNativeCall(context);
        const ret = Reflect.apply(Reflect.get(context.entity, methodName), context.entity, argumentsList);
        hookAfterNativeCall(context);
        return ret;
    }
    else {
        loge(`Cannot find method for context id:${contextId},method name is:${methodName}`);
    }
}
function pureCallEntityMethod(contextId, methodName, args) {
    const context = gContexts.get(contextId);
    if (context === undefined) {
        loge(`Cannot find context for context id:${contextId}`);
        return;
    }
    if (context.entity === undefined) {
        loge(`Cannot find holder for context id:${contextId}`);
        return;
    }
    if (Reflect.has(context.entity, methodName)) {
        const argumentsList = [];
        for (let i = 2; i < arguments.length; i++) {
            argumentsList.push(arguments[i]);
        }
        return Reflect.apply(Reflect.get(context.entity, methodName), context.entity, argumentsList);
    }
    else {
        loge(`Cannot find method for context id:${contextId},method name is:${methodName}`);
    }
}
function jsObtainEntry(contextId) {
    const context = jsObtainContext(contextId);
    const exportFunc = (constructor) => {
        context === null || context === void 0 ? void 0 : context.classes.set(constructor.name, constructor);
        const ret = new constructor;
        Reflect.set(ret, 'context', context);
        context === null || context === void 0 ? void 0 : context.register(ret);
        return constructor;
    };
    return function () {
        if (arguments.length === 1) {
            const args = arguments[0];
            if (args instanceof Array) {
                args.forEach(clz => {
                    context === null || context === void 0 ? void 0 : context.classes.set(clz.name, clz);
                });
                return exportFunc;
            }
            else {
                return exportFunc(args);
            }
        }
        else if (arguments.length === 2) {
            const srcContextId = arguments[0];
            const className = arguments[1];
            const srcContext = gContexts.get(srcContextId);
            if (srcContext) {
                const clz = srcContext.classes.get(className);
                if (clz) {
                    return exportFunc(clz);
                }
                else {
                    throw new Error(`Cannot find class:${className} in context:${srcContextId}`);
                }
            }
            else {
                throw new Error(`Cannot find context for ${srcContextId}`);
            }
        }
        else {
            throw new Error(`Entry arguments error:${arguments}`);
        }
    };
}
const global$2 = Function('return this')();
let __timerId__ = 1;
const timerInfos = new Map;
const _setTimeout = global$2.setTimeout;
const _setInterval = global$2.setInterval;
const _clearTimeout = global$2.clearTimeout;
const _clearInterval = global$2.clearInterval;
const doricSetTimeout = function (handler, timeout, ...args) {
    if (global$2.nativeSetTimer === undefined) {
        return Reflect.apply(_setTimeout, undefined, arguments);
    }
    const id = __timerId__++;
    timerInfos.set(id, {
        callback: () => {
            Reflect.apply(handler, undefined, args);
            timerInfos.delete(id);
        },
        context: getContext(),
    });
    nativeSetTimer(id, timeout || 0, false);
    return id;
};
const doricSetInterval = function (handler, timeout, ...args) {
    if (global$2.nativeSetTimer === undefined) {
        return Reflect.apply(_setInterval, undefined, arguments);
    }
    const id = __timerId__++;
    timerInfos.set(id, {
        callback: () => {
            Reflect.apply(handler, undefined, args);
        },
        context: getContext(),
    });
    nativeSetTimer(id, timeout || 0, true);
    return id;
};
const doricClearTimeout = function (timerId) {
    if (global$2.nativeClearTimer === undefined) {
        return Reflect.apply(_clearTimeout, undefined, arguments);
    }
    timerInfos.delete(timerId);
    nativeClearTimer(timerId);
};
const doricClearInterval = function (timerId) {
    if (global$2.nativeClearTimer === undefined) {
        return Reflect.apply(_clearInterval, undefined, arguments);
    }
    timerInfos.delete(timerId);
    nativeClearTimer(timerId);
};
if (!global$2.setTimeout) {
    global$2.setTimeout = doricSetTimeout;
}
else {
    global$2.doricSetTimeout = doricSetTimeout;
}
if (!global$2.setInterval) {
    global$2.setInterval = doricSetInterval;
}
else {
    global$2.doricSetInterval = doricSetInterval;
}
if (!global$2.clearTimeout) {
    global$2.clearTimeout = doricClearTimeout;
}
else {
    global$2.doricClearTimeout = doricClearTimeout;
}
if (!global$2.clearInterval) {
    global$2.clearInterval = doricClearInterval;
}
else {
    global$2.doricClearInterval = doricClearInterval;
}
function jsCallbackTimer(timerId) {
    const timerInfo = timerInfos.get(timerId);
    if (timerInfo === undefined) {
        return;
    }
    if (timerInfo.callback instanceof Function) {
        hookBeforeNativeCall(timerInfo.context);
        Reflect.apply(timerInfo.callback, timerInfo.context, []);
        hookAfterNativeCall(timerInfo.context);
    }
}

var doric = /*#__PURE__*/Object.freeze({
    __proto__: null,
    jsCallResolve: jsCallResolve,
    jsCallReject: jsCallReject,
    Context: Context,
    allContexts: allContexts,
    jsObtainContext: jsObtainContext,
    jsReleaseContext: jsReleaseContext,
    __require__: __require__,
    jsRegisterModule: jsRegisterModule,
    jsCallEntityMethod: jsCallEntityMethod,
    pureCallEntityMethod: pureCallEntityMethod,
    jsObtainEntry: jsObtainEntry,
    jsCallbackTimer: jsCallbackTimer
});

function obj2Model(obj, convertor) {
    if (obj instanceof Function) {
        return convertor(obj);
    }
    else if (obj instanceof Array) {
        return obj.map(e => obj2Model(e, convertor));
    }
    else if (obj instanceof Object) {
        if (Reflect.has(obj, 'toModel') && Reflect.get(obj, 'toModel') instanceof Function) {
            obj = Reflect.apply(Reflect.get(obj, 'toModel'), obj, []);
            return obj;
        }
        else {
            for (let key in obj) {
                const val = Reflect.get(obj, key);
                Reflect.set(obj, key, obj2Model(val, convertor));
            }
            return obj;
        }
    }
    else {
        return obj;
    }
}
class Mutable {
    constructor(v) {
        this.binders = new Set;
        this.get = () => {
            return this.val;
        };
        this.set = (v) => {
            this.val = v;
            this.binders.forEach(e => {
                Reflect.apply(e, undefined, [this.val]);
            });
        };
        this.val = v;
    }
    bind(binder) {
        this.binders.add(binder);
        Reflect.apply(binder, undefined, [this.val]);
    }
    static of(v) {
        return new Mutable(v);
    }
}

var __decorate$d = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$d = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const PROP_CONSIST = 1;
const PROP_INCONSIST = 2;
const PROP_KEY_VIEW_TYPE = "ViewType";
function Property(target, propKey) {
    Reflect.defineMetadata(propKey, PROP_CONSIST, target);
}
function InconsistProperty(target, propKey) {
    Reflect.defineMetadata(propKey, PROP_INCONSIST, target);
}
function ViewComponent(constructor) {
    const name = Reflect.getMetadata(PROP_KEY_VIEW_TYPE, constructor) || Object.getPrototypeOf(constructor).name;
    Reflect.defineMetadata(PROP_KEY_VIEW_TYPE, name, constructor);
}
class View {
    constructor() {
        this.width = 0;
        this.height = 0;
        this.x = 0;
        this.y = 0;
        this.viewId = uniqueId('ViewId');
        this.callbacks = new Map;
        /** Anchor end*/
        this.__dirty_props__ = {};
        this.nativeViewModel = {
            id: this.viewId,
            type: this.viewType(),
            props: this.__dirty_props__,
        };
        return new Proxy(this, {
            get: (target, p, receiver) => {
                return Reflect.get(target, p, receiver);
            },
            set: (target, p, v, receiver) => {
                const oldV = Reflect.get(target, p, receiver);
                const ret = Reflect.set(target, p, v, receiver);
                if (Reflect.getMetadata(p, target) === PROP_CONSIST && oldV !== v) {
                    receiver.onPropertyChanged(p.toString(), oldV, v);
                }
                else if (Reflect.getMetadata(p, target) === PROP_INCONSIST) {
                    receiver.onPropertyChanged(p.toString(), oldV, v);
                }
                return ret;
            }
        });
    }
    callback2Id(f) {
        const id = uniqueId('Function');
        this.callbacks.set(id, f);
        return id;
    }
    id2Callback(id) {
        let f = this.callbacks.get(id);
        if (f === undefined) {
            f = Reflect.get(this, id);
        }
        return f;
    }
    findViewByTag(tag) {
        if (tag === this.tag) {
            return this;
        }
        return undefined;
    }
    /** Anchor start*/
    get left() {
        return this.x;
    }
    set left(v) {
        this.x = v;
    }
    get right() {
        return this.x + this.width;
    }
    set right(v) {
        this.x = v - this.width;
    }
    get top() {
        return this.y;
    }
    set top(v) {
        this.y = v;
    }
    get bottom() {
        return this.y + this.height;
    }
    set bottom(v) {
        this.y = v - this.height;
    }
    get centerX() {
        return this.x + this.width / 2;
    }
    get centerY() {
        return this.y + this.height / 2;
    }
    set centerX(v) {
        this.x = v - this.width / 2;
    }
    set centerY(v) {
        this.y = v - this.height / 2;
    }
    get dirtyProps() {
        return this.__dirty_props__;
    }
    viewType() {
        const viewType = Reflect.getMetadata(PROP_KEY_VIEW_TYPE, this.constructor);
        return viewType || this.constructor.name;
    }
    onPropertyChanged(propKey, oldV, newV) {
        if (newV instanceof Function) {
            newV = this.callback2Id(newV);
        }
        else {
            newV = obj2Model(newV, (v) => this.callback2Id(v));
        }
        this.__dirty_props__[propKey] = newV;
    }
    clean() {
        for (const key in this.__dirty_props__) {
            if (Reflect.has(this.__dirty_props__, key)) {
                Reflect.deleteProperty(this.__dirty_props__, key);
            }
        }
    }
    isDirty() {
        return Reflect.ownKeys(this.__dirty_props__).length !== 0;
    }
    responseCallback(id, ...args) {
        const f = this.id2Callback(id);
        if (f instanceof Function) {
            const argumentsList = [];
            for (let i = 1; i < arguments.length; i++) {
                argumentsList.push(arguments[i]);
            }
            return Reflect.apply(f, this, argumentsList);
        }
        else {
            loge(`Cannot find callback:${id} for ${JSON.stringify(this.toModel())}`);
        }
    }
    toModel() {
        return this.nativeViewModel;
    }
    let(block) {
        block(this);
    }
    also(block) {
        block(this);
        return this;
    }
    apply(config) {
        for (let key in config) {
            Reflect.set(this, key, Reflect.get(config, key, config), this);
        }
        return this;
    }
    in(group) {
        group.addChild(this);
        return this;
    }
    nativeChannel(context, name) {
        let thisView = this;
        return function (args = undefined) {
            const viewIds = [];
            while (thisView != undefined) {
                viewIds.push(thisView.viewId);
                thisView = thisView.superview;
            }
            const params = {
                viewIds: viewIds.reverse(),
                name,
                args,
            };
            return context.callNative('shader', 'command', params);
        };
    }
    getWidth(context) {
        return this.nativeChannel(context, 'getWidth')();
    }
    getHeight(context) {
        return this.nativeChannel(context, 'getHeight')();
    }
    getX(context) {
        return this.nativeChannel(context, 'getX')();
    }
    getY(context) {
        return this.nativeChannel(context, 'getY')();
    }
    getLocationOnScreen(context) {
        return this.nativeChannel(context, "getLocationOnScreen")();
    }
    doAnimation(context, animation) {
        return this.nativeChannel(context, "doAnimation")(animation.toModel()).then((args) => {
            for (let key in args) {
                Reflect.set(this, key, Reflect.get(args, key, args), this);
                Reflect.deleteProperty(this.__dirty_props__, key);
            }
        });
    }
    clearAnimation(context, animation) {
        return this.nativeChannel(context, "clearAnimation")(animation.id).then(() => {
            this.__dirty_props__.translationX = this.translationX || 0;
            this.__dirty_props__.translationY = this.translationY || 0;
            this.__dirty_props__.scaleX = this.scaleX || 1;
            this.__dirty_props__.scaleY = this.scaleY || 1;
            this.__dirty_props__.rotation = this.rotation || 0;
        });
    }
    cancelAnimation(context, animation) {
        return this.nativeChannel(context, "cancelAnimation")(animation.id).then((args) => {
            for (let key in args) {
                Reflect.set(this, key, Reflect.get(args, key, args), this);
                Reflect.deleteProperty(this.__dirty_props__, key);
            }
        });
    }
}
__decorate$d([
    Property,
    __metadata$d("design:type", Number)
], View.prototype, "width", void 0);
__decorate$d([
    Property,
    __metadata$d("design:type", Number)
], View.prototype, "height", void 0);
__decorate$d([
    Property,
    __metadata$d("design:type", Number)
], View.prototype, "x", void 0);
__decorate$d([
    Property,
    __metadata$d("design:type", Number)
], View.prototype, "y", void 0);
__decorate$d([
    Property,
    __metadata$d("design:type", Object)
], View.prototype, "backgroundColor", void 0);
__decorate$d([
    Property,
    __metadata$d("design:type", Object)
], View.prototype, "corners", void 0);
__decorate$d([
    Property,
    __metadata$d("design:type", Object)
], View.prototype, "border", void 0);
__decorate$d([
    Property,
    __metadata$d("design:type", Object)
], View.prototype, "shadow", void 0);
__decorate$d([
    Property,
    __metadata$d("design:type", Number)
], View.prototype, "alpha", void 0);
__decorate$d([
    Property,
    __metadata$d("design:type", Boolean)
], View.prototype, "hidden", void 0);
__decorate$d([
    Property,
    __metadata$d("design:type", Object)
], View.prototype, "padding", void 0);
__decorate$d([
    Property,
    __metadata$d("design:type", Object)
], View.prototype, "layoutConfig", void 0);
__decorate$d([
    Property,
    __metadata$d("design:type", Function)
], View.prototype, "onClick", void 0);
__decorate$d([
    Property,
    __metadata$d("design:type", Number)
], View.prototype, "translationX", void 0);
__decorate$d([
    Property,
    __metadata$d("design:type", Number)
], View.prototype, "translationY", void 0);
__decorate$d([
    Property,
    __metadata$d("design:type", Number)
], View.prototype, "scaleX", void 0);
__decorate$d([
    Property,
    __metadata$d("design:type", Number)
], View.prototype, "scaleY", void 0);
__decorate$d([
    Property,
    __metadata$d("design:type", Number)
], View.prototype, "pivotX", void 0);
__decorate$d([
    Property,
    __metadata$d("design:type", Number)
], View.prototype, "pivotY", void 0);
__decorate$d([
    Property,
    __metadata$d("design:type", Number)
], View.prototype, "rotation", void 0);
__decorate$d([
    Property,
    __metadata$d("design:type", Number)
], View.prototype, "rotationX", void 0);
__decorate$d([
    Property,
    __metadata$d("design:type", Number)
], View.prototype, "rotationY", void 0);
__decorate$d([
    Property,
    __metadata$d("design:type", Number)
], View.prototype, "perspective", void 0);
__decorate$d([
    Property,
    __metadata$d("design:type", Object)
], View.prototype, "flexConfig", void 0);
class Superview extends View {
    subviewById(id) {
        for (let v of this.allSubviews()) {
            if (v.viewId === id) {
                return v;
            }
        }
    }
    findViewByTag(tag) {
        if (tag === this.tag) {
            return this;
        }
        return this.findViewTraversal(this, tag);
    }
    findViewTraversal(view, tag) {
        for (let v of view.allSubviews()) {
            let find = v.findViewByTag(tag);
            if (find) {
                return find;
            }
        }
        return undefined;
    }
    isDirty() {
        if (super.isDirty()) {
            return true;
        }
        else {
            for (const v of this.allSubviews()) {
                if (v.isDirty()) {
                    return true;
                }
            }
        }
        return false;
    }
    clean() {
        for (let v of this.allSubviews()) {
            v.clean();
        }
        super.clean();
    }
    toModel() {
        const subviews = [];
        for (let v of this.allSubviews()) {
            if (v != undefined) {
                v.superview = this;
                if (v.isDirty()) {
                    subviews.push(v.toModel());
                }
            }
        }
        this.dirtyProps.subviews = subviews;
        return super.toModel();
    }
}
class Group extends Superview {
    constructor() {
        super(...arguments);
        this.children = new Proxy([], {
            set: (target, index, value) => {
                const ret = Reflect.set(target, index, value);
                // Let getDirty return true
                this.dirtyProps.children = this.children.map(e => e.viewId);
                return ret;
            }
        });
    }
    allSubviews() {
        return this.children;
    }
    addChild(view) {
        this.children.push(view);
    }
    removeChild(view) {
        const ret = this.children.filter(e => e !== view);
        this.children.length = 0;
        ret.forEach(e => this.addChild(e));
    }
    removeAllChildren() {
        this.children.length = 0;
    }
}

const SPECIFIED = 1;
const START = 1 << 1;
const END = 1 << 2;
const SHIFT_X = 0;
const SHIFT_Y = 4;
const LEFT = (START | SPECIFIED) << SHIFT_X;
const RIGHT = (END | SPECIFIED) << SHIFT_X;
const TOP = (START | SPECIFIED) << SHIFT_Y;
const BOTTOM = (END | SPECIFIED) << SHIFT_Y;
const CENTER_X = SPECIFIED << SHIFT_X;
const CENTER_Y = SPECIFIED << SHIFT_Y;
const CENTER = CENTER_X | CENTER_Y;
class Gravity {
    constructor() {
        this.val = 0;
    }
    left() {
        const val = this.val | LEFT;
        const ret = new Gravity;
        ret.val = val;
        return ret;
    }
    right() {
        const val = this.val | RIGHT;
        const ret = new Gravity;
        ret.val = val;
        return ret;
    }
    top() {
        const val = this.val | TOP;
        const ret = new Gravity;
        ret.val = val;
        return ret;
    }
    bottom() {
        const val = this.val | BOTTOM;
        const ret = new Gravity;
        ret.val = val;
        return ret;
    }
    center() {
        const val = this.val | CENTER;
        const ret = new Gravity;
        ret.val = val;
        return ret;
    }
    centerX() {
        const val = this.val | CENTER_X;
        const ret = new Gravity;
        ret.val = val;
        return ret;
    }
    centerY() {
        const val = this.val | CENTER_Y;
        const ret = new Gravity;
        ret.val = val;
        return ret;
    }
    toModel() {
        return this.val;
    }
}
Gravity.origin = new Gravity;
Gravity.Center = Gravity.origin.center();
Gravity.CenterX = Gravity.origin.centerX();
Gravity.CenterY = Gravity.origin.centerY();
Gravity.Left = Gravity.origin.left();
Gravity.Right = Gravity.origin.right();
Gravity.Top = Gravity.origin.top();
Gravity.Bottom = Gravity.origin.bottom();
function gravity() {
    return new Gravity;
}

exports.LayoutSpec = void 0;
(function (LayoutSpec) {
    /**
     * Depends on what's been set on width or height.
    */
    LayoutSpec[LayoutSpec["JUST"] = 0] = "JUST";
    /**
     * Depends on it's content.
     */
    LayoutSpec[LayoutSpec["FIT"] = 1] = "FIT";
    /**
     * Extend as much as parent let it take.
     */
    LayoutSpec[LayoutSpec["MOST"] = 2] = "MOST";
})(exports.LayoutSpec || (exports.LayoutSpec = {}));
class LayoutConfigImpl {
    fit() {
        this.widthSpec = exports.LayoutSpec.FIT;
        this.heightSpec = exports.LayoutSpec.FIT;
        return this;
    }
    fitWidth() {
        this.widthSpec = exports.LayoutSpec.FIT;
        return this;
    }
    fitHeight() {
        this.heightSpec = exports.LayoutSpec.FIT;
        return this;
    }
    most() {
        this.widthSpec = exports.LayoutSpec.MOST;
        this.heightSpec = exports.LayoutSpec.MOST;
        return this;
    }
    mostWidth() {
        this.widthSpec = exports.LayoutSpec.MOST;
        return this;
    }
    mostHeight() {
        this.widthSpec = exports.LayoutSpec.MOST;
        return this;
    }
    just() {
        this.widthSpec = exports.LayoutSpec.JUST;
        this.heightSpec = exports.LayoutSpec.JUST;
        return this;
    }
    justWidth() {
        this.widthSpec = exports.LayoutSpec.JUST;
        return this;
    }
    justHeight() {
        this.heightSpec = exports.LayoutSpec.JUST;
        return this;
    }
    configWidth(w) {
        this.widthSpec = w;
        return this;
    }
    configHeight(h) {
        this.heightSpec = h;
        return this;
    }
    configMargin(m) {
        this.margin = m;
        return this;
    }
    configAlignment(a) {
        this.alignment = a;
        return this;
    }
    configWeight(w) {
        this.weight = w;
        return this;
    }
    configMaxWidth(v) {
        this.maxWidth = v;
        return this;
    }
    configMaxHeight(v) {
        this.maxHeight = v;
        return this;
    }
    configMinWidth(v) {
        this.minWidth = v;
        return this;
    }
    configMinHeight(v) {
        this.minHeight = v;
        return this;
    }
    toModel() {
        return {
            widthSpec: this.widthSpec,
            heightSpec: this.heightSpec,
            margin: this.margin,
            alignment: this.alignment ? this.alignment.toModel() : undefined,
            weight: this.weight,
        };
    }
}
function layoutConfig() {
    return new LayoutConfigImpl;
}

var __decorate$c = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$c = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
class Stack extends Group {
}
class Root extends Stack {
}
class LinearLayout extends Group {
}
__decorate$c([
    Property,
    __metadata$c("design:type", Number)
], LinearLayout.prototype, "space", void 0);
__decorate$c([
    Property,
    __metadata$c("design:type", Gravity)
], LinearLayout.prototype, "gravity", void 0);
class VLayout extends LinearLayout {
}
class HLayout extends LinearLayout {
}
function stack(views, config) {
    const ret = new Stack;
    ret.layoutConfig = layoutConfig().fit();
    for (let v of views) {
        ret.addChild(v);
    }
    if (config) {
        for (let key in config) {
            Reflect.set(ret, key, Reflect.get(config, key, config), ret);
        }
    }
    return ret;
}
function hlayout(views, config) {
    const ret = new HLayout;
    ret.layoutConfig = layoutConfig().fit();
    for (let v of views) {
        ret.addChild(v);
    }
    if (config) {
        for (let key in config) {
            Reflect.set(ret, key, Reflect.get(config, key, config), ret);
        }
    }
    return ret;
}
function vlayout(views, config) {
    const ret = new VLayout;
    ret.layoutConfig = layoutConfig().fit();
    for (let v of views) {
        ret.addChild(v);
    }
    if (config) {
        for (let key in config) {
            Reflect.set(ret, key, Reflect.get(config, key, config), ret);
        }
    }
    return ret;
}
class FlexLayout extends Group {
}
function flexlayout(views, config) {
    const ret = new FlexLayout;
    ret.layoutConfig = layoutConfig().fit();
    for (let v of views) {
        ret.addChild(v);
    }
    if (config) {
        for (let key in config) {
            Reflect.set(ret, key, Reflect.get(config, key, config), ret);
        }
    }
    return ret;
}

var __decorate$b = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$b = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
function NativeCall(target, propertyKey, descriptor) {
    const originVal = descriptor.value;
    descriptor.value = function () {
        const ret = Reflect.apply(originVal, this, arguments);
        return ret;
    };
    return descriptor;
}
class Panel {
    constructor() {
        this.destroyed = false;
        this.__root__ = new Root;
        this.headviews = new Map;
        this.onRenderFinishedCallback = [];
        this.__rendering__ = false;
    }
    onCreate() { }
    onDestroy() { }
    onShow() { }
    onHidden() { }
    addHeadView(type, v) {
        let map = this.headviews.get(type);
        if (map) {
            map.set(v.viewId, v);
        }
        else {
            map = new Map;
            map.set(v.viewId, v);
            this.headviews.set(type, map);
        }
    }
    allHeadViews() {
        return this.headviews.values();
    }
    removeHeadView(type, v) {
        if (this.headviews.has(type)) {
            let map = this.headviews.get(type);
            if (map) {
                if (v instanceof View) {
                    map.delete(v.viewId);
                }
                else {
                    map.delete(v);
                }
            }
        }
    }
    clearHeadViews(type) {
        if (this.headviews.has(type)) {
            this.headviews.delete(type);
        }
    }
    getRootView() {
        return this.__root__;
    }
    getInitData() {
        return this.__data__;
    }
    __init__(data) {
        if (data) {
            this.__data__ = JSON.parse(data);
        }
    }
    __onCreate__() {
        this.onCreate();
    }
    __onDestroy__() {
        this.destroyed = true;
        this.onDestroy();
    }
    __onShow__() {
        this.onShow();
    }
    __onHidden__() {
        this.onHidden();
    }
    __build__(frame) {
        this.__root__.width = frame.width;
        this.__root__.height = frame.height;
        this.__root__.children.length = 0;
        this.build(this.__root__);
    }
    __response__(viewIds, callbackId) {
        const v = this.retrospectView(viewIds);
        if (v === undefined) {
            loge(`Cannot find view for ${viewIds}`);
        }
        else {
            const argumentsList = [callbackId];
            for (let i = 2; i < arguments.length; i++) {
                argumentsList.push(arguments[i]);
            }
            return Reflect.apply(v.responseCallback, v, argumentsList);
        }
    }
    retrospectView(ids) {
        return ids.reduce((acc, cur) => {
            if (acc === undefined) {
                if (cur === this.__root__.viewId) {
                    return this.__root__;
                }
                for (let map of this.headviews.values()) {
                    if (map.has(cur)) {
                        return map.get(cur);
                    }
                }
                return undefined;
            }
            else {
                if (Reflect.has(acc, "subviewById")) {
                    return Reflect.apply(Reflect.get(acc, "subviewById"), acc, [cur]);
                }
                return acc;
            }
        }, undefined);
    }
    nativeRender(model) {
        return this.context.callNative("shader", "render", model);
    }
    hookBeforeNativeCall() {
        if (Environment.platform !== 'web') {
            this.__root__.clean();
            for (let map of this.headviews.values()) {
                for (let v of map.values()) {
                    v.clean();
                }
            }
        }
    }
    hookAfterNativeCall() {
        if (this.destroyed) {
            return;
        }
        const promises = [];
        if (Environment.platform !== 'web') {
            //Here insert a native call to ensure the promise is resolved done.
            nativeEmpty();
            if (this.__root__.isDirty()) {
                const model = this.__root__.toModel();
                promises.push(this.nativeRender(model));
            }
            for (let map of this.headviews.values()) {
                for (let v of map.values()) {
                    if (v.isDirty()) {
                        const model = v.toModel();
                        promises.push(this.nativeRender(model));
                    }
                }
            }
            if (this.__rendering__) {
                //skip
                Promise.all(promises).then(_ => {
                });
            }
            else {
                this.__rendering__ = true;
                Promise.all(promises).then(_ => {
                    this.__rendering__ = false;
                    this.onRenderFinished();
                });
            }
        }
        else {
            if (this.__rendering__) {
                //skip
                return;
            }
            this.__rendering__ = true;
            Function("return this")().setTimeout(() => {
                if (this.__root__.isDirty()) {
                    const model = this.__root__.toModel();
                    promises.push(this.nativeRender(model));
                    this.__root__.clean();
                }
                for (let map of this.headviews.values()) {
                    for (let v of map.values()) {
                        if (v.isDirty()) {
                            const model = v.toModel();
                            promises.push(this.nativeRender(model));
                            v.clean();
                        }
                    }
                }
                this.__rendering__ = false;
                Promise.all(promises).then(_ => {
                    this.onRenderFinished();
                });
            }, 0);
        }
    }
    onRenderFinished() {
        this.onRenderFinishedCallback.forEach(e => {
            e();
        });
        this.onRenderFinishedCallback.length = 0;
    }
    addOnRenderFinishedCallback(cb) {
        this.onRenderFinishedCallback.push(cb);
    }
}
__decorate$b([
    NativeCall,
    __metadata$b("design:type", Function),
    __metadata$b("design:paramtypes", [String]),
    __metadata$b("design:returntype", void 0)
], Panel.prototype, "__init__", null);
__decorate$b([
    NativeCall,
    __metadata$b("design:type", Function),
    __metadata$b("design:paramtypes", []),
    __metadata$b("design:returntype", void 0)
], Panel.prototype, "__onCreate__", null);
__decorate$b([
    NativeCall,
    __metadata$b("design:type", Function),
    __metadata$b("design:paramtypes", []),
    __metadata$b("design:returntype", void 0)
], Panel.prototype, "__onDestroy__", null);
__decorate$b([
    NativeCall,
    __metadata$b("design:type", Function),
    __metadata$b("design:paramtypes", []),
    __metadata$b("design:returntype", void 0)
], Panel.prototype, "__onShow__", null);
__decorate$b([
    NativeCall,
    __metadata$b("design:type", Function),
    __metadata$b("design:paramtypes", []),
    __metadata$b("design:returntype", void 0)
], Panel.prototype, "__onHidden__", null);
__decorate$b([
    NativeCall,
    __metadata$b("design:type", Function),
    __metadata$b("design:paramtypes", [Object]),
    __metadata$b("design:returntype", void 0)
], Panel.prototype, "__build__", null);
__decorate$b([
    NativeCall,
    __metadata$b("design:type", Function),
    __metadata$b("design:paramtypes", [Array, String]),
    __metadata$b("design:returntype", void 0)
], Panel.prototype, "__response__", null);

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
exports.RepeatMode = void 0;
(function (RepeatMode) {
    RepeatMode[RepeatMode["RESTART"] = 1] = "RESTART";
    RepeatMode[RepeatMode["REVERSE"] = 2] = "REVERSE";
})(exports.RepeatMode || (exports.RepeatMode = {}));
exports.FillMode = void 0;
(function (FillMode) {
    /**
     * The receiver is removed from the presentation when the animation is completed.
     */
    FillMode[FillMode["Removed"] = 0] = "Removed";
    /**
     * The receiver remains visible in its final state when the animation is completed.
     */
    FillMode[FillMode["Forward"] = 1] = "Forward";
    /**
     * The receiver clamps values before zero to zero when the animation is completed.
     */
    FillMode[FillMode["Backward"] = 2] = "Backward";
    /**
     * The receiver clamps values at both ends of the object’s time space
     */
    FillMode[FillMode["Both"] = 3] = "Both";
})(exports.FillMode || (exports.FillMode = {}));
exports.TimingFunction = void 0;
(function (TimingFunction) {
    /**
     * The system default timing function. Use this function to ensure that the timing of your animations matches that of most system animations.
     */
    TimingFunction[TimingFunction["Default"] = 0] = "Default";
    /**
     * Linear pacing, which causes an animation to occur evenly over its duration.
     */
    TimingFunction[TimingFunction["Linear"] = 1] = "Linear";
    /**
     * Ease-in pacing, which causes an animation to begin slowly and then speed up as it progresses.
     */
    TimingFunction[TimingFunction["EaseIn"] = 2] = "EaseIn";
    /**
     * Ease-out pacing, which causes an animation to begin quickly and then slow as it progresses.
     */
    TimingFunction[TimingFunction["EaseOut"] = 3] = "EaseOut";
    /**
     * Ease-in-ease-out pacing, which causes an animation to begin slowly, accelerate through the middle of its duration, and then slow again before completing.
     */
    TimingFunction[TimingFunction["EaseInEaseOut"] = 4] = "EaseInEaseOut";
})(exports.TimingFunction || (exports.TimingFunction = {}));
class Animation {
    constructor() {
        this.changeables = new Map;
        this.duration = 0;
        this.fillMode = exports.FillMode.Forward;
        this.id = uniqueId("Animation");
    }
    toModel() {
        const changeables = [];
        for (let e of this.changeables.values()) {
            changeables.push({
                key: e.key,
                fromValue: e.fromValue,
                toValue: e.toValue,
            });
        }
        return {
            type: this.constructor.name,
            delay: this.delay,
            duration: this.duration,
            changeables,
            repeatCount: this.repeatCount,
            repeatMode: this.repeatMode,
            fillMode: this.fillMode,
            timingFunction: this.timingFunction,
            id: this.id,
        };
    }
}
class ScaleAnimation extends Animation {
    constructor() {
        super();
        this.scaleXChangeable = {
            key: "scaleX",
            fromValue: 1,
            toValue: 1,
        };
        this.scaleYChangeable = {
            key: "scaleY",
            fromValue: 1,
            toValue: 1,
        };
        this.changeables.set("scaleX", this.scaleXChangeable);
        this.changeables.set("scaleY", this.scaleYChangeable);
    }
    set fromScaleX(v) {
        this.scaleXChangeable.fromValue = v;
    }
    get fromScaleX() {
        return this.scaleXChangeable.fromValue;
    }
    set toScaleX(v) {
        this.scaleXChangeable.toValue = v;
    }
    get toScaleX() {
        return this.scaleXChangeable.toValue;
    }
    set fromScaleY(v) {
        this.scaleYChangeable.fromValue = v;
    }
    get fromScaleY() {
        return this.scaleYChangeable.fromValue;
    }
    set toScaleY(v) {
        this.scaleYChangeable.toValue = v;
    }
    get toScaleY() {
        return this.scaleYChangeable.toValue;
    }
}
class TranslationAnimation extends Animation {
    constructor() {
        super();
        this.translationXChangeable = {
            key: "translationX",
            fromValue: 0,
            toValue: 0,
        };
        this.translationYChangeable = {
            key: "translationY",
            fromValue: 0,
            toValue: 0,
        };
        this.changeables.set("translationX", this.translationXChangeable);
        this.changeables.set("translationY", this.translationYChangeable);
    }
    set fromTranslationX(v) {
        this.translationXChangeable.fromValue = v;
    }
    get fromTranslationX() {
        return this.translationXChangeable.fromValue;
    }
    set toTranslationX(v) {
        this.translationXChangeable.toValue = v;
    }
    get toTranslationX() {
        return this.translationXChangeable.toValue;
    }
    set fromTranslationY(v) {
        this.translationYChangeable.fromValue = v;
    }
    get fromTranslationY() {
        return this.translationYChangeable.fromValue;
    }
    set toTranslationY(v) {
        this.translationYChangeable.toValue = v;
    }
    get toTranslationY() {
        return this.translationYChangeable.toValue;
    }
}
class RotationAnimation extends Animation {
    constructor() {
        super();
        this.rotationChaneable = {
            key: "rotation",
            fromValue: 1,
            toValue: 1,
        };
        this.changeables.set("rotation", this.rotationChaneable);
    }
    set fromRotation(v) {
        this.rotationChaneable.fromValue = v;
    }
    get fromRotation() {
        return this.rotationChaneable.fromValue;
    }
    set toRotation(v) {
        this.rotationChaneable.toValue = v;
    }
    get toRotation() {
        return this.rotationChaneable.toValue;
    }
}
class RotationXAnimation extends Animation {
    constructor() {
        super();
        this.rotationChaneable = {
            key: "rotationX",
            fromValue: 1,
            toValue: 1,
        };
        this.changeables.set("rotationX", this.rotationChaneable);
    }
    set fromRotation(v) {
        this.rotationChaneable.fromValue = v;
    }
    get fromRotation() {
        return this.rotationChaneable.fromValue;
    }
    set toRotation(v) {
        this.rotationChaneable.toValue = v;
    }
    get toRotation() {
        return this.rotationChaneable.toValue;
    }
}
class RotationYAnimation extends Animation {
    constructor() {
        super();
        this.rotationChaneable = {
            key: "rotationY",
            fromValue: 1,
            toValue: 1,
        };
        this.changeables.set("rotationY", this.rotationChaneable);
    }
    set fromRotation(v) {
        this.rotationChaneable.fromValue = v;
    }
    get fromRotation() {
        return this.rotationChaneable.fromValue;
    }
    set toRotation(v) {
        this.rotationChaneable.toValue = v;
    }
    get toRotation() {
        return this.rotationChaneable.toValue;
    }
}
class AnimationSet {
    constructor() {
        this.animations = [];
        this._duration = 0;
        this.id = uniqueId("AnimationSet");
    }
    addAnimation(anim) {
        this.animations.push(anim);
    }
    get duration() {
        return this._duration;
    }
    set duration(v) {
        this._duration = v;
        this.animations.forEach(e => e.duration = v);
    }
    toModel() {
        return {
            animations: this.animations.map(e => {
                return e.toModel();
            }),
            delay: this.delay,
            id: this.id,
        };
    }
}

/**
 *  Store color as format AARRGGBB or RRGGBB
 */
class Color {
    constructor(v) {
        this._value = 0;
        this._value = v | 0x0;
    }
    static parse(str) {
        if (!str.startsWith("#")) {
            throw new Error(`Parse color error with ${str}`);
        }
        const val = parseInt(str.substr(1), 16);
        if (str.length === 7) {
            return new Color(val | 0xff000000);
        }
        else if (str.length === 9) {
            return new Color(val);
        }
        else {
            throw new Error(`Parse color error with ${str}`);
        }
    }
    static safeParse(str, defVal = Color.TRANSPARENT) {
        let color = defVal;
        try {
            color = Color.parse(str);
        }
        catch (e) {
        }
        finally {
            return color;
        }
    }
    alpha(v) {
        v = v * 255;
        return new Color((this._value & 0xffffff) | ((v & 0xff) << 24));
    }
    toModel() {
        return this._value;
    }
}
Color.BLACK = new Color(0xFF000000);
Color.DKGRAY = new Color(0xFF444444);
Color.GRAY = new Color(0xFF888888);
Color.LTGRAY = new Color(0xFFCCCCCC);
Color.WHITE = new Color(0xFFFFFFFF);
Color.RED = new Color(0xFFFF0000);
Color.GREEN = new Color(0xFF00FF00);
Color.BLUE = new Color(0xFF0000FF);
Color.YELLOW = new Color(0xFFFFFF00);
Color.CYAN = new Color(0xFF00FFFF);
Color.MAGENTA = new Color(0xFFFF00FF);
Color.TRANSPARENT = new Color(0);
exports.GradientOrientation = void 0;
(function (GradientOrientation) {
    /** draw the gradient from the top to the bottom */
    GradientOrientation[GradientOrientation["TOP_BOTTOM"] = 0] = "TOP_BOTTOM";
    /** draw the gradient from the top-right to the bottom-left */
    GradientOrientation[GradientOrientation["TR_BL"] = 1] = "TR_BL";
    /** draw the gradient from the right to the left */
    GradientOrientation[GradientOrientation["RIGHT_LEFT"] = 2] = "RIGHT_LEFT";
    /** draw the gradient from the bottom-right to the top-left */
    GradientOrientation[GradientOrientation["BR_TL"] = 3] = "BR_TL";
    /** draw the gradient from the bottom to the top */
    GradientOrientation[GradientOrientation["BOTTOM_TOP"] = 4] = "BOTTOM_TOP";
    /** draw the gradient from the bottom-left to the top-right */
    GradientOrientation[GradientOrientation["BL_TR"] = 5] = "BL_TR";
    /** draw the gradient from the left to the right */
    GradientOrientation[GradientOrientation["LEFT_RIGHT"] = 6] = "LEFT_RIGHT";
    /** draw the gradient from the top-left to the bottom-right */
    GradientOrientation[GradientOrientation["TL_BR"] = 7] = "TL_BR";
})(exports.GradientOrientation || (exports.GradientOrientation = {}));

var __decorate$a = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$a = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
exports.TruncateAt = void 0;
(function (TruncateAt) {
    TruncateAt[TruncateAt["End"] = 0] = "End";
    TruncateAt[TruncateAt["Middle"] = 1] = "Middle";
    TruncateAt[TruncateAt["Start"] = 2] = "Start";
    TruncateAt[TruncateAt["Clip"] = 3] = "Clip";
})(exports.TruncateAt || (exports.TruncateAt = {}));
class Text extends View {
}
__decorate$a([
    Property,
    __metadata$a("design:type", String)
], Text.prototype, "text", void 0);
__decorate$a([
    Property,
    __metadata$a("design:type", Color)
], Text.prototype, "textColor", void 0);
__decorate$a([
    Property,
    __metadata$a("design:type", Number)
], Text.prototype, "textSize", void 0);
__decorate$a([
    Property,
    __metadata$a("design:type", Number)
], Text.prototype, "maxLines", void 0);
__decorate$a([
    Property,
    __metadata$a("design:type", Gravity)
], Text.prototype, "textAlignment", void 0);
__decorate$a([
    Property,
    __metadata$a("design:type", String)
], Text.prototype, "fontStyle", void 0);
__decorate$a([
    Property,
    __metadata$a("design:type", String)
], Text.prototype, "font", void 0);
__decorate$a([
    Property,
    __metadata$a("design:type", Number)
], Text.prototype, "maxWidth", void 0);
__decorate$a([
    Property,
    __metadata$a("design:type", Number)
], Text.prototype, "maxHeight", void 0);
__decorate$a([
    Property,
    __metadata$a("design:type", Number)
], Text.prototype, "lineSpacing", void 0);
__decorate$a([
    Property,
    __metadata$a("design:type", Boolean)
], Text.prototype, "strikethrough", void 0);
__decorate$a([
    Property,
    __metadata$a("design:type", Boolean)
], Text.prototype, "underline", void 0);
__decorate$a([
    Property,
    __metadata$a("design:type", String)
], Text.prototype, "htmlText", void 0);
__decorate$a([
    Property,
    __metadata$a("design:type", Number)
], Text.prototype, "truncateAt", void 0);
function text(config) {
    const ret = new Text;
    ret.layoutConfig = layoutConfig().fit();
    for (let key in config) {
        Reflect.set(ret, key, Reflect.get(config, key, config), ret);
    }
    return ret;
}

var __decorate$9 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$9 = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
exports.ScaleType = void 0;
(function (ScaleType) {
    ScaleType[ScaleType["ScaleToFill"] = 0] = "ScaleToFill";
    ScaleType[ScaleType["ScaleAspectFit"] = 1] = "ScaleAspectFit";
    ScaleType[ScaleType["ScaleAspectFill"] = 2] = "ScaleAspectFill";
})(exports.ScaleType || (exports.ScaleType = {}));
class Image extends View {
}
__decorate$9([
    Property,
    __metadata$9("design:type", String)
], Image.prototype, "imageUrl", void 0);
__decorate$9([
    Property,
    __metadata$9("design:type", String)
], Image.prototype, "imagePath", void 0);
__decorate$9([
    Property,
    __metadata$9("design:type", String)
], Image.prototype, "imageRes", void 0);
__decorate$9([
    Property,
    __metadata$9("design:type", String)
], Image.prototype, "imageBase64", void 0);
__decorate$9([
    Property,
    __metadata$9("design:type", Number)
], Image.prototype, "scaleType", void 0);
__decorate$9([
    Property,
    __metadata$9("design:type", Boolean)
], Image.prototype, "isBlur", void 0);
__decorate$9([
    Property,
    __metadata$9("design:type", String)
], Image.prototype, "placeHolderImage", void 0);
__decorate$9([
    Property,
    __metadata$9("design:type", String)
], Image.prototype, "placeHolderImageBase64", void 0);
__decorate$9([
    Property,
    __metadata$9("design:type", Color
    /**
     * Display while image is failed to load
     * It can be file name in local path
     */
    )
], Image.prototype, "placeHolderColor", void 0);
__decorate$9([
    Property,
    __metadata$9("design:type", String)
], Image.prototype, "errorImage", void 0);
__decorate$9([
    Property,
    __metadata$9("design:type", String)
], Image.prototype, "errorImageBase64", void 0);
__decorate$9([
    Property,
    __metadata$9("design:type", Color)
], Image.prototype, "errorColor", void 0);
__decorate$9([
    Property,
    __metadata$9("design:type", Function)
], Image.prototype, "loadCallback", void 0);
__decorate$9([
    Property,
    __metadata$9("design:type", Number)
], Image.prototype, "imageScale", void 0);
__decorate$9([
    Property,
    __metadata$9("design:type", Object)
], Image.prototype, "stretchInset", void 0);
function image(config) {
    const ret = new Image;
    ret.layoutConfig = layoutConfig().fit();
    for (let key in config) {
        Reflect.set(ret, key, Reflect.get(config, key, config), ret);
    }
    return ret;
}

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
var __decorate$8 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$8 = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
class ListItem extends Stack {
}
__decorate$8([
    Property,
    __metadata$8("design:type", String)
], ListItem.prototype, "identifier", void 0);
__decorate$8([
    Property,
    __metadata$8("design:type", Array)
], ListItem.prototype, "actions", void 0);
class List extends Superview {
    constructor() {
        super(...arguments);
        this.cachedViews = new Map;
        this.itemCount = 0;
        this.batchCount = 15;
    }
    allSubviews() {
        if (this.loadMoreView) {
            return [...this.cachedViews.values(), this.loadMoreView];
        }
        else {
            return this.cachedViews.values();
        }
    }
    scrollToItem(context, index, config) {
        const animated = config === null || config === void 0 ? void 0 : config.animated;
        return this.nativeChannel(context, 'scrollToItem')({ index, animated, });
    }
    reset() {
        this.cachedViews.clear();
        this.itemCount = 0;
    }
    getItem(itemIdx) {
        let view = this.renderItem(itemIdx);
        view.superview = this;
        this.cachedViews.set(`${itemIdx}`, view);
        return view;
    }
    renderBunchedItems(start, length) {
        return new Array(Math.max(0, Math.min(length, this.itemCount - start))).fill(0).map((_, idx) => {
            const listItem = this.getItem(start + idx);
            return listItem.toModel();
        });
    }
    toModel() {
        if (this.loadMoreView) {
            this.dirtyProps['loadMoreView'] = this.loadMoreView.viewId;
        }
        return super.toModel();
    }
}
__decorate$8([
    Property,
    __metadata$8("design:type", Object)
], List.prototype, "itemCount", void 0);
__decorate$8([
    Property,
    __metadata$8("design:type", Function)
], List.prototype, "renderItem", void 0);
__decorate$8([
    Property,
    __metadata$8("design:type", Object)
], List.prototype, "batchCount", void 0);
__decorate$8([
    Property,
    __metadata$8("design:type", Function)
], List.prototype, "onLoadMore", void 0);
__decorate$8([
    Property,
    __metadata$8("design:type", Boolean)
], List.prototype, "loadMore", void 0);
__decorate$8([
    Property,
    __metadata$8("design:type", ListItem)
], List.prototype, "loadMoreView", void 0);
__decorate$8([
    Property,
    __metadata$8("design:type", Function)
], List.prototype, "onScroll", void 0);
__decorate$8([
    Property,
    __metadata$8("design:type", Function)
], List.prototype, "onScrollEnd", void 0);
__decorate$8([
    Property,
    __metadata$8("design:type", Number)
], List.prototype, "scrolledPosition", void 0);
__decorate$8([
    Property,
    __metadata$8("design:type", Boolean)
], List.prototype, "scrollable", void 0);
__decorate$8([
    Property,
    __metadata$8("design:type", Boolean)
], List.prototype, "bounces", void 0);
function list(config) {
    const ret = new List;
    for (let key in config) {
        Reflect.set(ret, key, Reflect.get(config, key, config), ret);
    }
    return ret;
}
function listItem(item, config) {
    return (new ListItem).also((it) => {
        it.layoutConfig = layoutConfig().fit();
        if (item instanceof View) {
            it.addChild(item);
        }
        else {
            item.forEach(e => {
                it.addChild(e);
            });
        }
        if (config) {
            for (let key in config) {
                Reflect.set(it, key, Reflect.get(config, key, config), it);
            }
        }
    });
}

var __decorate$7 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$7 = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
class SlideItem extends Stack {
}
__decorate$7([
    Property,
    __metadata$7("design:type", String)
], SlideItem.prototype, "identifier", void 0);
class Slider extends Superview {
    constructor() {
        super(...arguments);
        this.cachedViews = new Map;
        this.itemCount = 0;
        this.batchCount = 3;
    }
    allSubviews() {
        return this.cachedViews.values();
    }
    getItem(itemIdx) {
        let view = this.renderPage(itemIdx);
        view.superview = this;
        this.cachedViews.set(`${itemIdx}`, view);
        return view;
    }
    renderBunchedItems(start, length) {
        return new Array(Math.min(length, this.itemCount - start)).fill(0).map((_, idx) => {
            const slideItem = this.getItem(start + idx);
            return slideItem.toModel();
        });
    }
    slidePage(context, page, smooth = false) {
        return this.nativeChannel(context, "slidePage")({ page, smooth });
    }
    getSlidedPage(context) {
        return this.nativeChannel(context, "getSlidedPage")();
    }
}
__decorate$7([
    Property,
    __metadata$7("design:type", Object)
], Slider.prototype, "itemCount", void 0);
__decorate$7([
    Property,
    __metadata$7("design:type", Function)
], Slider.prototype, "renderPage", void 0);
__decorate$7([
    Property,
    __metadata$7("design:type", Object)
], Slider.prototype, "batchCount", void 0);
__decorate$7([
    Property,
    __metadata$7("design:type", Function)
], Slider.prototype, "onPageSlided", void 0);
__decorate$7([
    Property,
    __metadata$7("design:type", Boolean)
], Slider.prototype, "loop", void 0);
__decorate$7([
    Property,
    __metadata$7("design:type", Boolean)
], Slider.prototype, "scrollable", void 0);
__decorate$7([
    Property,
    __metadata$7("design:type", Boolean)
], Slider.prototype, "bounces", void 0);
function slider(config) {
    const ret = new Slider;
    for (let key in config) {
        Reflect.set(ret, key, Reflect.get(config, key, config), ret);
    }
    return ret;
}
function slideItem(item, config) {
    return (new SlideItem).also((it) => {
        it.layoutConfig = layoutConfig().most();
        if (item instanceof View) {
            it.addChild(item);
        }
        else {
            item.forEach(e => {
                it.addChild(e);
            });
        }
        if (config) {
            for (let key in config) {
                Reflect.set(it, key, Reflect.get(config, key, config), it);
            }
        }
    });
}

var __decorate$6 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$6 = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
function scroller(content, config) {
    return (new Scroller).also(v => {
        v.layoutConfig = layoutConfig().fit();
        if (config) {
            for (let key in config) {
                Reflect.set(v, key, Reflect.get(config, key, config), v);
            }
        }
        v.content = content;
    });
}
class Scroller extends Superview {
    allSubviews() {
        return [this.content];
    }
    toModel() {
        this.dirtyProps.content = this.content.viewId;
        return super.toModel();
    }
    scrollTo(context, offset, animated) {
        return this.nativeChannel(context, "scrollTo")({ offset, animated });
    }
    scrollBy(context, offset, animated) {
        return this.nativeChannel(context, "scrollBy")({ offset, animated });
    }
}
__decorate$6([
    Property,
    __metadata$6("design:type", Object)
], Scroller.prototype, "contentOffset", void 0);
__decorate$6([
    Property,
    __metadata$6("design:type", Function)
], Scroller.prototype, "onScroll", void 0);
__decorate$6([
    Property,
    __metadata$6("design:type", Function)
], Scroller.prototype, "onScrollEnd", void 0);
__decorate$6([
    Property,
    __metadata$6("design:type", Boolean)
], Scroller.prototype, "scrollable", void 0);
__decorate$6([
    Property,
    __metadata$6("design:type", Boolean)
], Scroller.prototype, "bounces", void 0);

var __decorate$5 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$5 = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
class Refreshable extends Superview {
    allSubviews() {
        const ret = [this.content];
        if (this.header) {
            ret.push(this.header);
        }
        return ret;
    }
    setRefreshable(context, refreshable) {
        return this.nativeChannel(context, 'setRefreshable')(refreshable);
    }
    setRefreshing(context, refreshing) {
        return this.nativeChannel(context, 'setRefreshing')(refreshing);
    }
    isRefreshable(context) {
        return this.nativeChannel(context, 'isRefreshable')();
    }
    isRefreshing(context) {
        return this.nativeChannel(context, 'isRefreshing')();
    }
    toModel() {
        this.dirtyProps.content = this.content.viewId;
        this.dirtyProps.header = (this.header || {}).viewId;
        return super.toModel();
    }
}
__decorate$5([
    Property,
    __metadata$5("design:type", Function)
], Refreshable.prototype, "onRefresh", void 0);
function refreshable(config) {
    const ret = new Refreshable;
    ret.layoutConfig = layoutConfig().fit();
    for (let key in config) {
        Reflect.set(ret, key, Reflect.get(config, key, config), ret);
    }
    return ret;
}
function pullable(v, config) {
    Reflect.set(v, 'startAnimation', config.startAnimation);
    Reflect.set(v, 'stopAnimation', config.stopAnimation);
    Reflect.set(v, 'setPullingDistance', config.setPullingDistance);
    return v;
}

var ValueType;
(function (ValueType) {
    ValueType[ValueType["Undefined"] = 0] = "Undefined";
    ValueType[ValueType["Point"] = 1] = "Point";
    ValueType[ValueType["Percent"] = 2] = "Percent";
    ValueType[ValueType["Auto"] = 3] = "Auto";
})(ValueType || (ValueType = {}));
class FlexTypedValue {
    constructor(type) {
        this.value = 0;
        this.type = type;
    }
    static percent(v) {
        const ret = new FlexTypedValue(ValueType.Percent);
        ret.value = v;
        return ret;
    }
    static point(v) {
        const ret = new FlexTypedValue(ValueType.Point);
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
FlexTypedValue.Auto = new FlexTypedValue(ValueType.Auto);
exports.FlexDirection = void 0;
(function (FlexDirection) {
    FlexDirection[FlexDirection["COLUMN"] = 0] = "COLUMN";
    FlexDirection[FlexDirection["COLUMN_REVERSE"] = 1] = "COLUMN_REVERSE";
    FlexDirection[FlexDirection["ROW"] = 2] = "ROW";
    FlexDirection[FlexDirection["ROW_REVERSE"] = 3] = "ROW_REVERSE";
})(exports.FlexDirection || (exports.FlexDirection = {}));
exports.Align = void 0;
(function (Align) {
    Align[Align["AUTO"] = 0] = "AUTO";
    Align[Align["FLEX_START"] = 1] = "FLEX_START";
    Align[Align["CENTER"] = 2] = "CENTER";
    Align[Align["FLEX_END"] = 3] = "FLEX_END";
    Align[Align["STRETCH"] = 4] = "STRETCH";
    Align[Align["BASELINE"] = 5] = "BASELINE";
    Align[Align["SPACE_BETWEEN"] = 6] = "SPACE_BETWEEN";
    Align[Align["SPACE_AROUND"] = 7] = "SPACE_AROUND";
})(exports.Align || (exports.Align = {}));
exports.Justify = void 0;
(function (Justify) {
    Justify[Justify["FLEX_START"] = 0] = "FLEX_START";
    Justify[Justify["CENTER"] = 1] = "CENTER";
    Justify[Justify["FLEX_END"] = 2] = "FLEX_END";
    Justify[Justify["SPACE_BETWEEN"] = 3] = "SPACE_BETWEEN";
    Justify[Justify["SPACE_AROUND"] = 4] = "SPACE_AROUND";
    Justify[Justify["SPACE_EVENLY"] = 5] = "SPACE_EVENLY";
})(exports.Justify || (exports.Justify = {}));
exports.Direction = void 0;
(function (Direction) {
    Direction[Direction["INHERIT"] = 0] = "INHERIT";
    Direction[Direction["LTR"] = 1] = "LTR";
    Direction[Direction["RTL"] = 2] = "RTL";
})(exports.Direction || (exports.Direction = {}));
exports.PositionType = void 0;
(function (PositionType) {
    PositionType[PositionType["RELATIVE"] = 0] = "RELATIVE";
    PositionType[PositionType["ABSOLUTE"] = 1] = "ABSOLUTE";
})(exports.PositionType || (exports.PositionType = {}));
exports.Wrap = void 0;
(function (Wrap) {
    Wrap[Wrap["NO_WRAP"] = 0] = "NO_WRAP";
    Wrap[Wrap["WRAP"] = 1] = "WRAP";
    Wrap[Wrap["WRAP_REVERSE"] = 2] = "WRAP_REVERSE";
})(exports.Wrap || (exports.Wrap = {}));
exports.OverFlow = void 0;
(function (OverFlow) {
    OverFlow[OverFlow["VISIBLE"] = 0] = "VISIBLE";
    OverFlow[OverFlow["HIDDEN"] = 1] = "HIDDEN";
    OverFlow[OverFlow["SCROLL"] = 2] = "SCROLL";
})(exports.OverFlow || (exports.OverFlow = {}));
exports.Display = void 0;
(function (Display) {
    Display[Display["FLEX"] = 0] = "FLEX";
    Display[Display["NONE"] = 1] = "NONE";
})(exports.Display || (exports.Display = {}));

var __decorate$4 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$4 = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
class FlowLayoutItem extends Stack {
}
__decorate$4([
    Property,
    __metadata$4("design:type", String)
], FlowLayoutItem.prototype, "identifier", void 0);
class FlowLayout extends Superview {
    constructor() {
        super(...arguments);
        this.cachedViews = new Map;
        this.columnCount = 2;
        this.itemCount = 0;
        this.batchCount = 15;
    }
    allSubviews() {
        if (this.loadMoreView) {
            return [...this.cachedViews.values(), this.loadMoreView];
        }
        else {
            return this.cachedViews.values();
        }
    }
    reset() {
        this.cachedViews.clear();
        this.itemCount = 0;
    }
    getItem(itemIdx) {
        let view = this.renderItem(itemIdx);
        view.superview = this;
        this.cachedViews.set(`${itemIdx}`, view);
        return view;
    }
    renderBunchedItems(start, length) {
        return new Array(Math.min(length, this.itemCount - start)).fill(0).map((_, idx) => {
            const listItem = this.getItem(start + idx);
            return listItem.toModel();
        });
    }
    toModel() {
        if (this.loadMoreView) {
            this.dirtyProps['loadMoreView'] = this.loadMoreView.viewId;
        }
        return super.toModel();
    }
}
__decorate$4([
    Property,
    __metadata$4("design:type", Object)
], FlowLayout.prototype, "columnCount", void 0);
__decorate$4([
    Property,
    __metadata$4("design:type", Number)
], FlowLayout.prototype, "columnSpace", void 0);
__decorate$4([
    Property,
    __metadata$4("design:type", Number)
], FlowLayout.prototype, "rowSpace", void 0);
__decorate$4([
    Property,
    __metadata$4("design:type", Object)
], FlowLayout.prototype, "itemCount", void 0);
__decorate$4([
    Property,
    __metadata$4("design:type", Function)
], FlowLayout.prototype, "renderItem", void 0);
__decorate$4([
    Property,
    __metadata$4("design:type", Object)
], FlowLayout.prototype, "batchCount", void 0);
__decorate$4([
    Property,
    __metadata$4("design:type", Function)
], FlowLayout.prototype, "onLoadMore", void 0);
__decorate$4([
    Property,
    __metadata$4("design:type", Boolean)
], FlowLayout.prototype, "loadMore", void 0);
__decorate$4([
    Property,
    __metadata$4("design:type", FlowLayoutItem)
], FlowLayout.prototype, "loadMoreView", void 0);
__decorate$4([
    Property,
    __metadata$4("design:type", Function)
], FlowLayout.prototype, "onScroll", void 0);
__decorate$4([
    Property,
    __metadata$4("design:type", Function)
], FlowLayout.prototype, "onScrollEnd", void 0);
__decorate$4([
    Property,
    __metadata$4("design:type", Boolean)
], FlowLayout.prototype, "scrollable", void 0);
__decorate$4([
    Property,
    __metadata$4("design:type", Boolean)
], FlowLayout.prototype, "bounces", void 0);
function flowlayout(config) {
    const ret = new FlowLayout;
    for (let key in config) {
        Reflect.set(ret, key, Reflect.get(config, key, config), ret);
    }
    return ret;
}
function flowItem(item, config) {
    return (new FlowLayoutItem).also((it) => {
        it.layoutConfig = layoutConfig().fit();
        if (item instanceof View) {
            it.addChild(item);
        }
        else {
            item.forEach(e => {
                it.addChild(e);
            });
        }
        if (config) {
            for (let key in config) {
                Reflect.set(it, key, Reflect.get(config, key, config), it);
            }
        }
    });
}

var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$3 = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
class Input extends View {
    getText(context) {
        return this.nativeChannel(context, 'getText')();
    }
    setSelection(context, start, end = start) {
        return this.nativeChannel(context, 'setSelection')({
            start,
            end,
        });
    }
    requestFocus(context) {
        return this.nativeChannel(context, 'requestFocus')();
    }
    releaseFocus(context) {
        return this.nativeChannel(context, 'releaseFocus')();
    }
}
__decorate$3([
    InconsistProperty,
    __metadata$3("design:type", String)
], Input.prototype, "text", void 0);
__decorate$3([
    Property,
    __metadata$3("design:type", Color)
], Input.prototype, "textColor", void 0);
__decorate$3([
    Property,
    __metadata$3("design:type", Number)
], Input.prototype, "textSize", void 0);
__decorate$3([
    Property,
    __metadata$3("design:type", String)
], Input.prototype, "hintText", void 0);
__decorate$3([
    Property,
    __metadata$3("design:type", Number)
], Input.prototype, "inputType", void 0);
__decorate$3([
    Property,
    __metadata$3("design:type", Color)
], Input.prototype, "hintTextColor", void 0);
__decorate$3([
    Property,
    __metadata$3("design:type", Boolean)
], Input.prototype, "multiline", void 0);
__decorate$3([
    Property,
    __metadata$3("design:type", Gravity)
], Input.prototype, "textAlignment", void 0);
__decorate$3([
    Property,
    __metadata$3("design:type", Function)
], Input.prototype, "onTextChange", void 0);
__decorate$3([
    Property,
    __metadata$3("design:type", Function)
], Input.prototype, "onFocusChange", void 0);
__decorate$3([
    Property,
    __metadata$3("design:type", Number)
], Input.prototype, "maxLength", void 0);
__decorate$3([
    Property,
    __metadata$3("design:type", Boolean)
], Input.prototype, "password", void 0);
exports.InputType = void 0;
(function (InputType) {
    InputType[InputType["Default"] = 0] = "Default";
    InputType[InputType["Number"] = 1] = "Number";
    InputType[InputType["Decimal"] = 2] = "Decimal";
    InputType[InputType["Alphabet"] = 3] = "Alphabet";
    InputType[InputType["Phone"] = 4] = "Phone";
})(exports.InputType || (exports.InputType = {}));
function input(config) {
    const ret = new Input;
    ret.layoutConfig = layoutConfig().just();
    for (let key in config) {
        Reflect.set(ret, key, Reflect.get(config, key, config), ret);
    }
    return ret;
}

var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$2 = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
class NestedSlider extends Group {
    addSlideItem(view) {
        this.addChild(view);
    }
    slidePage(context, page, smooth = false) {
        return this.nativeChannel(context, "slidePage")({ page, smooth });
    }
    getSlidedPage(context) {
        return this.nativeChannel(context, "getSlidedPage")();
    }
}
__decorate$2([
    Property,
    __metadata$2("design:type", Function)
], NestedSlider.prototype, "onPageSlided", void 0);
__decorate$2([
    Property,
    __metadata$2("design:type", Boolean)
], NestedSlider.prototype, "scrollable", void 0);
__decorate$2([
    Property,
    __metadata$2("design:type", Boolean)
], NestedSlider.prototype, "bounces", void 0);

var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$1 = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
class Draggable extends Stack {
}
__decorate$1([
    Property,
    __metadata$1("design:type", Function)
], Draggable.prototype, "onDrag", void 0);
function draggable(views, config) {
    const ret = new Draggable;
    ret.layoutConfig = layoutConfig().fit();
    if (views instanceof View) {
        ret.addChild(views);
    }
    else {
        views.forEach(e => {
            ret.addChild(e);
        });
    }
    if (config) {
        for (let key in config) {
            Reflect.set(ret, key, Reflect.get(config, key, config), ret);
        }
    }
    return ret;
}

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
class Switch extends View {
}
__decorate([
    InconsistProperty,
    __metadata("design:type", Boolean)
], Switch.prototype, "state", void 0);
__decorate([
    Property,
    __metadata("design:type", Function)
], Switch.prototype, "onSwitch", void 0);
__decorate([
    Property,
    __metadata("design:type", Color)
], Switch.prototype, "offTintColor", void 0);
__decorate([
    Property,
    __metadata("design:type", Color)
], Switch.prototype, "onTintColor", void 0);
__decorate([
    Property,
    __metadata("design:type", Color)
], Switch.prototype, "thumbTintColor", void 0);
function switchView(config) {
    const ret = new Switch;
    ret.layoutConfig = layoutConfig().just();
    ret.width = 50;
    ret.height = 30;
    for (let key in config) {
        Reflect.set(ret, key, Reflect.get(config, key, config), ret);
    }
    return ret;
}

function modal(context) {
    return {
        toast: (msg, gravity = Gravity.Bottom) => {
            context.callNative('modal', 'toast', {
                msg,
                gravity: gravity.toModel(),
            });
        },
        alert: (arg) => {
            if (typeof arg === 'string') {
                return context.callNative('modal', 'alert', { msg: arg });
            }
            else {
                return context.callNative('modal', 'alert', arg);
            }
        },
        confirm: (arg) => {
            if (typeof arg === 'string') {
                return context.callNative('modal', 'confirm', { msg: arg });
            }
            else {
                return context.callNative('modal', 'confirm', arg);
            }
        },
        prompt: (arg) => {
            return context.callNative('modal', 'prompt', arg);
        },
    };
}

function navbar(context) {
    const entity = context.entity;
    let panel = undefined;
    if (entity instanceof Panel) {
        panel = entity;
    }
    return {
        isHidden: () => {
            return context.callNative('navbar', 'isHidden');
        },
        setHidden: (hidden) => {
            return context.callNative('navbar', 'setHidden', { hidden, });
        },
        setTitle: (title) => {
            return context.callNative('navbar', 'setTitle', { title, });
        },
        setBgColor: (color) => {
            return context.callNative('navbar', 'setBgColor', { color: color.toModel(), });
        },
        setLeft: (view) => {
            if (panel) {
                panel.clearHeadViews("navbar_left");
                panel.addHeadView("navbar_left", view);
            }
            return context.callNative('navbar', 'setLeft', view.toModel());
        },
        setRight: (view) => {
            if (panel) {
                panel.clearHeadViews("navbar_right");
                panel.addHeadView("navbar_right", view);
            }
            return context.callNative('navbar', 'setRight', view.toModel());
        },
        setCenter: (view) => {
            if (panel) {
                panel.clearHeadViews("navbar_center");
                panel.addHeadView("navbar_center", view);
            }
            return context.callNative('navbar', 'setCenter', view.toModel());
        },
    };
}

function internalScheme(context, panelClass) {
    return `_internal_://export?class=${encodeURIComponent(panelClass.name)}&context=${context.id}`;
}
function navigator(context) {
    const moduleName = "navigator";
    return {
        push: (source, config) => {
            if (typeof source === 'function') {
                source = internalScheme(context, source);
            }
            if (config && config.extra) {
                config.extra = JSON.stringify(config.extra);
            }
            return context.callNative(moduleName, 'push', {
                source, config
            });
        },
        pop: (animated = true) => {
            return context.callNative(moduleName, 'pop', { animated });
        },
        openUrl: (url) => {
            return context.callNative(moduleName, "openUrl", url);
        },
    };
}

function transformRequest(request) {
    let url = request.url || "";
    if (request.params !== undefined) {
        const queryStrings = [];
        for (let key in request.params) {
            queryStrings.push(`${key}=${encodeURIComponent(request.params[key])}`);
        }
        request.url = `${request.url}${url.indexOf('?') >= 0 ? '&' : '?'}${queryStrings.join('&')}`;
    }
    if (typeof request.data === 'object') {
        request.data = JSON.stringify(request.data);
    }
    return request;
}
function network(context) {
    return {
        request: (config) => {
            return context.callNative('network', 'request', transformRequest(config));
        },
        get: (url, config) => {
            let finalConfig = config;
            if (finalConfig === undefined) {
                finalConfig = {};
            }
            finalConfig.url = url;
            finalConfig.method = "get";
            return context.callNative('network', 'request', transformRequest(finalConfig));
        },
        post: (url, data, config) => {
            let finalConfig = config;
            if (finalConfig === undefined) {
                finalConfig = {};
            }
            finalConfig.url = url;
            finalConfig.method = "post";
            if (data !== undefined) {
                finalConfig.data = data;
            }
            return context.callNative('network', 'request', transformRequest(finalConfig));
        },
        put: (url, data, config) => {
            let finalConfig = config;
            if (finalConfig === undefined) {
                finalConfig = {};
            }
            finalConfig.url = url;
            finalConfig.method = "put";
            if (data !== undefined) {
                finalConfig.data = data;
            }
            return context.callNative('network', 'request', transformRequest(finalConfig));
        },
        delete: (url, data, config) => {
            let finalConfig = config;
            if (finalConfig === undefined) {
                finalConfig = {};
            }
            finalConfig.url = url;
            finalConfig.method = "delete";
            return context.callNative('network', 'request', transformRequest(finalConfig));
        },
    };
}

function storage(context) {
    return {
        setItem: (key, value, zone) => {
            return context.callNative('storage', 'setItem', { key, value, zone });
        },
        getItem: (key, zone) => {
            return context.callNative('storage', 'getItem', { key, zone });
        },
        remove: (key, zone) => {
            return context.callNative('storage', 'remove', { key, zone });
        },
        clear: (zone) => {
            return context.callNative('storage', 'clear', { zone });
        },
    };
}

function popover(context) {
    const entity = context.entity;
    let panel = undefined;
    if (entity instanceof Panel) {
        panel = entity;
    }
    return {
        show: (view) => {
            if (panel) {
                panel.addHeadView("popover", view);
            }
            return context.callNative('popover', 'show', view.toModel());
        },
        dismiss: (view = undefined) => {
            if (panel) {
                if (view) {
                    panel.removeHeadView("popover", view);
                }
                else {
                    panel.clearHeadViews("popover");
                }
            }
            return context.callNative('popover', 'dismiss', view ? { id: view.viewId } : undefined);
        },
    };
}

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
function take(target) {
    return (block) => {
        block(target);
    };
}
function takeNonNull(target) {
    return (block) => {
        if (target !== undefined) {
            return block(target);
        }
    };
}
function takeNull(target) {
    return (block) => {
        if (target === undefined) {
            return block();
        }
    };
}
function takeLet(target) {
    return (block) => {
        return block(target);
    };
}
function takeAlso(target) {
    return (block) => {
        block(target);
        return target;
    };
}
function takeIf(target) {
    return (predicate) => {
        return predicate(target) ? target : undefined;
    };
}
function takeUnless(target) {
    return (predicate) => {
        return predicate(target) ? undefined : target;
    };
}
function repeat(action) {
    return (times) => {
        for (let i = 0; i < times; i++) {
            action(i);
        }
    };
}

var __awaiter$1 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Only supports x,y,width,height,corner(just for four corners),rotation,bgColor,
 * @param panel @see Panel
 */
function animate(context) {
    const entity = context.entity;
    if (entity instanceof Panel) {
        let panel = entity;
        return (args) => __awaiter$1(this, void 0, void 0, function* () {
            yield context.callNative('animate', 'submit');
            args.animations();
            return takeLet(panel.getRootView())(root => {
                if (root.isDirty()) {
                    const model = root.toModel();
                    model.duration = args.duration;
                    const ret = context.callNative('animate', 'animateRender', model);
                    root.clean();
                    return ret;
                }
                for (let map of panel.allHeadViews()) {
                    for (let v of map.values()) {
                        if (v.isDirty()) {
                            const model_1 = v.toModel();
                            const ret_1 = context.callNative('animate', 'animateRender', model_1);
                            v.clean();
                            return ret_1;
                        }
                    }
                }
                throw new Error('Cannot find any animated elements');
            });
        });
    }
    else {
        return (args) => {
            return Promise.reject(`Cannot find panel in Context:${context.id}`);
        };
    }
}

function notification(context) {
    return {
        publish: (args) => {
            if (args.data !== undefined) {
                args.data = JSON.stringify(args.data);
            }
            return context.callNative('notification', 'publish', args);
        },
        subscribe: (args) => {
            args.callback = context.function2Id(args.callback);
            return context.callNative('notification', 'subscribe', args);
        },
        unsubscribe: (subscribeId) => {
            context.removeFuncById(subscribeId);
            return context.callNative('notification', 'unsubscribe', subscribeId);
        }
    };
}

exports.StatusBarMode = void 0;
(function (StatusBarMode) {
    StatusBarMode[StatusBarMode["LIGHT"] = 0] = "LIGHT";
    StatusBarMode[StatusBarMode["DARK"] = 1] = "DARK";
})(exports.StatusBarMode || (exports.StatusBarMode = {}));
function statusbar(context) {
    return {
        setHidden: (hidden) => {
            return context.callNative('statusbar', 'setHidden', { hidden });
        },
        setMode: (mode) => {
            return context.callNative('statusbar', 'setMode', { mode });
        },
        setColor: (color) => {
            return context.callNative('statusbar', 'setColor', { color: color.toModel() });
        },
    };
}

function viewIdChains(view) {
    const viewIds = [];
    let thisView = view;
    while (thisView != undefined) {
        viewIds.push(thisView.viewId);
        thisView = thisView.superview;
    }
    return viewIds.reverse();
}
function coordinator(context) {
    return {
        verticalScrolling: (argument) => {
            if (context.entity instanceof Panel) {
                const panel = context.entity;
                panel.addOnRenderFinishedCallback(() => {
                    argument.scrollable = viewIdChains(argument.scrollable);
                    if (argument.target instanceof View) {
                        argument.target = viewIdChains(argument.target);
                    }
                    if (argument.changing.start instanceof Color) {
                        argument.changing.start = argument.changing.start.toModel();
                    }
                    if (argument.changing.end instanceof Color) {
                        argument.changing.end = argument.changing.end.toModel();
                    }
                    context.callNative("coordinator", "verticalScrolling", argument);
                });
            }
        }
    };
}

function notch(context) {
    return {
        inset: () => {
            return context.callNative('notch', 'inset', {});
        }
    };
}

function keyboard(context) {
    return {
        subscribe: (callback) => {
            return context.callNative('keyboard', 'subscribe', context.function2Id(callback));
        },
        unsubscribe: (subscribeId) => {
            context.removeFuncById(subscribeId);
            return context.callNative('keyboard', 'unsubscribe', subscribeId);
        }
    };
}

class Observable {
    constructor(provider, clz) {
        this.observers = new Set;
        this.provider = provider;
        this.clz = clz;
    }
    addObserver(observer) {
        this.observers.add(observer);
    }
    removeObserver(observer) {
        this.observers.delete(observer);
    }
    update(updater) {
        const oldV = this.provider.acquire(this.clz);
        const newV = updater(oldV);
        if (newV !== undefined) {
            this.provider.provide(newV);
        }
        for (let observer of this.observers) {
            observer(newV);
        }
    }
}
class Provider {
    constructor() {
        this.provision = new Map;
        this.observableMap = new Map;
    }
    provide(obj) {
        this.provision.set(obj.constructor, obj);
    }
    acquire(clz) {
        const ret = this.provision.get(clz);
        return ret;
    }
    remove(clz) {
        this.provision.delete(clz);
    }
    clear() {
        this.provision.clear();
    }
    observe(clz) {
        let observable = this.observableMap.get(clz);
        if (observable === undefined) {
            observable = new Observable(this, clz);
            this.observableMap.set(clz, observable);
        }
        return observable;
    }
}

class ViewHolder {
}
class ViewModel {
    constructor(obj, v) {
        this.state = obj;
        this.viewHolder = v;
    }
    getState() {
        return this.state;
    }
    getViewHolder() {
        return this.viewHolder;
    }
    updateState(setter) {
        setter(this.state);
        this.onBind(this.state, this.viewHolder);
    }
    attach(view) {
        this.viewHolder.build(view);
        this.onAttached(this.state, this.viewHolder);
        this.onBind(this.state, this.viewHolder);
    }
}
class VMPanel extends Panel {
    getViewModel() {
        return this.vm;
    }
    build(root) {
        this.vh = new (this.getViewHolderClass());
        this.vm = new (this.getViewModelClass())(this.getState(), this.vh);
        this.vm.context = this.context;
        this.vm.attach(root);
    }
}

class Module extends Panel {
    get provider() {
        var _a;
        return this.__provider || ((_a = this.superPanel) === null || _a === void 0 ? void 0 : _a.provider);
    }
    set provider(provider) {
        this.__provider = provider;
    }
    dispatchMessage(message) {
        var _a;
        (_a = this.superPanel) === null || _a === void 0 ? void 0 : _a.dispatchMessage(message);
    }
    onMessage(message) { }
}
class ModularPanel extends Module {
    constructor() {
        super();
        this.modules = this.setupModules().map(e => {
            const instance = new e;
            if (instance instanceof Module) {
                instance.superPanel = this;
            }
            return instance;
        });
    }
    dispatchMessage(message) {
        if (this.superPanel) {
            this.superPanel.dispatchMessage(message);
        }
        else {
            this.onMessage(message);
        }
    }
    onMessage(message) {
        this.modules.forEach(e => {
            if (e instanceof Module) {
                e.onMessage(message);
            }
        });
    }
    build(root) {
        const groupView = this.setupShelf(root);
        this.modules.forEach(e => {
            Reflect.set(e, "__root__", groupView);
            e.build(groupView);
        });
    }
    onCreate() {
        super.onCreate();
        this.modules.forEach(e => {
            e.context = this.context;
            e.onCreate();
        });
    }
    onDestroy() {
        super.onDestroy();
        this.modules.forEach(e => {
            e.onDestroy();
        });
    }
    onShow() {
        super.onShow();
        this.modules.forEach(e => {
            e.onShow();
        });
    }
    onHidden() {
        super.onHidden();
        this.modules.forEach(e => {
            e.onHidden();
        });
    }
    onRenderFinished() {
        super.onRenderFinished();
        this.modules.forEach(e => {
            e.onRenderFinished();
        });
    }
}

var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let contextId = undefined;
let global$1 = new Function('return this')();
const originSetTimeout = global$1.setTimeout;
global$1.setTimeout = global$1.doricSetTimeout;
global$1.setInterval = global$1.doricSetInterval;
global$1.clearTimeout = global$1.doricClearTimeout;
global$1.clearInterval = global$1.doricClearInterval;
global$1.doric = doric;
function initNativeEnvironment(source) {
    return __awaiter(this, void 0, void 0, function* () {
        // dev kit client
        return new Promise((resolve, reject) => {
            const ws = new WebSocket__default['default']('ws://localhost:7777')
                .on('open', () => {
                console.log('Connectted Devkit on port', '7777');
                ws.send(JSON.stringify({
                    type: "D2C",
                    cmd: "DEBUG_REQ",
                    payload: {
                        source,
                    },
                }));
            })
                .on('message', (data) => {
                var _a;
                const msg = JSON.parse(data);
                const payload = msg.payload;
                switch (msg.cmd) {
                    case "DEBUG_RES":
                        const contextId = msg.payload.contextId;
                        resolve(contextId);
                        break;
                    case "injectGlobalJSObject":
                        console.log("injectGlobalJSObject", payload);
                        const type = payload.type;
                        const value = payload.value;
                        let arg;
                        if (type === 0) {
                            arg = null;
                        }
                        else if (type === 1) {
                            arg = parseFloat(value);
                        }
                        else if (type === 2) {
                            arg = (value == 'true');
                        }
                        else if (type === 3) {
                            arg = value.toString();
                        }
                        else if (type === 4) {
                            arg = JSON.parse(value);
                        }
                        else if (type === 5) {
                            arg = JSON.parse(value);
                        }
                        if (payload.name === "Environment") {
                            arg.debugging = true;
                        }
                        Reflect.set(global$1, payload.name, arg);
                        break;
                    case "injectGlobalJSFunction":
                        console.log("injectGlobalJSFunction", payload);
                        if (payload.name === "nativeEmpty") {
                            break;
                        }
                        Reflect.set(global$1, payload.name, function () {
                            let args = [].slice.call(arguments);
                            console.log(args);
                            console.log("injected", payload.name, args);
                            ws.send(JSON.stringify({
                                type: "D2C",
                                cmd: 'injectGlobalJSFunction',
                                payload: {
                                    name: payload.name,
                                    arguments: args
                                }
                            }));
                        });
                        break;
                    case "invokeMethod":
                        const callId = payload.callId;
                        console.log("invokeMethod", callId, payload);
                        const values = payload.values;
                        let args = [];
                        for (let i = 0; i < values.length; i++) {
                            let value = values[i];
                            if (value.type === 0) {
                                args.push(null);
                            }
                            else if (value.type === 1) {
                                args.push(parseFloat(value.value));
                            }
                            else if (value.type === 2) {
                                args.push((value.value == 'true'));
                            }
                            else if (value.type === 3) {
                                args.push(value.value.toString());
                            }
                            else if (value.type === 4) {
                                args.push(JSON.parse(value.value));
                            }
                            else if (value.type === 5) {
                                args.push(JSON.parse(value.value));
                            }
                        }
                        const object = Reflect.get(global$1, payload.objectName);
                        const method = Reflect.get(object, payload.functionName);
                        const result = Reflect.apply(method, undefined, args);
                        console.log("Result", callId, result);
                        ws.send(JSON.stringify({
                            type: "D2C",
                            cmd: 'invokeMethod',
                            payload: {
                                result,
                                callId,
                            }
                        }));
                        break;
                    case "DEBUG_STOP":
                        console.log(((_a = msg.payload) === null || _a === void 0 ? void 0 : _a.msg) || "Stop debugging");
                        process.exit(0);
                        break;
                }
            })
                .on('error', (error) => {
                console.log(error);
                reject(error);
            });
        });
    });
}
global$1.context = jsObtainContext("FakeContext");
const entryHooks = [];
global$1.Entry = function () {
    var _a, _b, _c;
    if (!!contextId) {
        return Reflect.apply(jsObtainEntry(contextId), doric, arguments);
    }
    else {
        const jsFile = (_c = (_b = (_a = new Error().stack) === null || _a === void 0 ? void 0 : _a.split("\n").map(e => e.match(/at\s__decorate.*?\s\((.*?)\)/)).find(e => !!e)) === null || _b === void 0 ? void 0 : _b[1].match(/(.*?\.js)/)) === null || _c === void 0 ? void 0 : _c[1];
        if (!jsFile) {
            throw new Error("Cannot find debugging file");
        }
        const args = arguments;
        entryHooks.push((contextId) => {
            Reflect.apply(jsObtainEntry(contextId), doric, args);
        });
        if (entryHooks.length <= 1) {
            const source = path__default['default'].basename(jsFile);
            console.log(`Debugging ${source}`);
            initNativeEnvironment(source).then(ret => {
                contextId = ret;
                console.log("debugging context id: " + contextId);
                const realContext = jsObtainContext(contextId);
                global$1.context.id = contextId;
                global$1.context = realContext;
                entryHooks.forEach(e => e(contextId));
            });
            return arguments[0];
        }
    }
};
global$1.injectGlobal = (objName, obj) => {
    Reflect.set(global$1, objName, JSON.parse(obj));
};
global$1.sendToNative = () => {
};
global$1.receiveFromNative = () => {
};
global$1.nativeLog = (type, msg) => {
    switch (type) {
        case "w": {
            console.warn(msg);
            break;
        }
        case "e": {
            console.error(msg);
            break;
        }
        default: {
            console.log(msg);
            break;
        }
    }
};
global$1.nativeRequire = () => {
    console.error("nativeRequire", new Error().stack);
    console.error("Do not call here in debugging");
    return false;
};
global$1.nativeBridge = () => {
    console.error("nativeBridge", new Error().stack);
    console.error("Do not call here in debugging");
    return false;
};
global$1.Envrionment = new Proxy({}, {
    get: (target, p, receiver) => {
        console.error("Environment Getter", new Error().stack);
        console.error("Do not call here in debugging");
        return undefined;
    },
    set: (target, p, v, receiver) => {
        console.error("Environment Setter", new Error().stack);
        console.error("Do not call here in debugging");
        return Reflect.set(target, p, v, receiver);
    }
});
global$1.nativeEmpty = () => {
    originSetTimeout(() => {
        for (let context of allContexts()) {
            const entity = context.entity;
            if (entity instanceof Panel) {
                const panel = entity;
                if (panel.getRootView().isDirty()) {
                    const model = panel.getRootView().toModel();
                    context.callNative("shader", "render", model);
                    panel.getRootView().clean();
                }
                for (let map of panel.allHeadViews()) {
                    for (let v of map.values()) {
                        if (v.isDirty()) {
                            const model = v.toModel();
                            context.callNative("shader", "render", model);
                            v.clean();
                        }
                    }
                }
            }
        }
    }, 0);
};

exports.AnimationSet = AnimationSet;
exports.BOTTOM = BOTTOM;
exports.CENTER = CENTER;
exports.CENTER_X = CENTER_X;
exports.CENTER_Y = CENTER_Y;
exports.Color = Color;
exports.Draggable = Draggable;
exports.FlexLayout = FlexLayout;
exports.FlexTypedValue = FlexTypedValue;
exports.FlowLayout = FlowLayout;
exports.FlowLayoutItem = FlowLayoutItem;
exports.Gravity = Gravity;
exports.Group = Group;
exports.HLayout = HLayout;
exports.Image = Image;
exports.InconsistProperty = InconsistProperty;
exports.Input = Input;
exports.LEFT = LEFT;
exports.LayoutConfigImpl = LayoutConfigImpl;
exports.List = List;
exports.ListItem = ListItem;
exports.ModularPanel = ModularPanel;
exports.Module = Module;
exports.Mutable = Mutable;
exports.NativeCall = NativeCall;
exports.NestedSlider = NestedSlider;
exports.Observable = Observable;
exports.Panel = Panel;
exports.Property = Property;
exports.Provider = Provider;
exports.RIGHT = RIGHT;
exports.Refreshable = Refreshable;
exports.Root = Root;
exports.RotationAnimation = RotationAnimation;
exports.RotationXAnimation = RotationXAnimation;
exports.RotationYAnimation = RotationYAnimation;
exports.ScaleAnimation = ScaleAnimation;
exports.Scroller = Scroller;
exports.SlideItem = SlideItem;
exports.Slider = Slider;
exports.Stack = Stack;
exports.Superview = Superview;
exports.Switch = Switch;
exports.TOP = TOP;
exports.Text = Text;
exports.TranslationAnimation = TranslationAnimation;
exports.VLayout = VLayout;
exports.VMPanel = VMPanel;
exports.View = View;
exports.ViewComponent = ViewComponent;
exports.ViewHolder = ViewHolder;
exports.ViewModel = ViewModel;
exports.animate = animate;
exports.coordinator = coordinator;
exports.draggable = draggable;
exports.flexlayout = flexlayout;
exports.flowItem = flowItem;
exports.flowlayout = flowlayout;
exports.gravity = gravity;
exports.hlayout = hlayout;
exports.image = image;
exports.input = input;
exports.internalScheme = internalScheme;
exports.keyboard = keyboard;
exports.layoutConfig = layoutConfig;
exports.list = list;
exports.listItem = listItem;
exports.log = log;
exports.loge = loge;
exports.logw = logw;
exports.modal = modal;
exports.navbar = navbar;
exports.navigator = navigator;
exports.network = network;
exports.notch = notch;
exports.notification = notification;
exports.obj2Model = obj2Model;
exports.popover = popover;
exports.pullable = pullable;
exports.refreshable = refreshable;
exports.repeat = repeat;
exports.scroller = scroller;
exports.slideItem = slideItem;
exports.slider = slider;
exports.stack = stack;
exports.statusbar = statusbar;
exports.storage = storage;
exports.switchView = switchView;
exports.take = take;
exports.takeAlso = takeAlso;
exports.takeIf = takeIf;
exports.takeLet = takeLet;
exports.takeNonNull = takeNonNull;
exports.takeNull = takeNull;
exports.takeUnless = takeUnless;
exports.text = text;
exports.uniqueId = uniqueId;
exports.vlayout = vlayout;

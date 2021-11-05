'use strict';

"use strict";
function _binaryValue(v) {
    switch (typeof v) {
        case "number":
            return {
                type: "number",
                value: v
            };
        case "string":
            return {
                type: "string",
                value: v
            };
        case "boolean":
            return {
                type: "boolean",
                value: v
            };
        case "object":
            if (v instanceof Array) {
                return {
                    type: "array",
                    value: JSON.stringify(v)
                };
            }
            else {
                return {
                    type: "object",
                    value: JSON.stringify(v)
                };
            }
        default:
            return {
                type: "null",
                value: undefined
            };
    }
}
function _wrappedValue(v) {
    switch (typeof v) {
        case "number":
            return {
                type: "number",
                value: v
            };
        case "string":
            return {
                type: "string",
                value: v
            };
        case "boolean":
            return {
                type: "boolean",
                value: v
            };
        case "object":
            if (v instanceof Array) {
                return {
                    type: "array",
                    value: JSON.stringify(v)
                };
            }
            else {
                return {
                    type: "object",
                    value: JSON.stringify(v)
                };
            }
        default:
            return {
                type: "null",
                value: undefined
            };
    }
}
function _rawValue(v) {
    switch (v.type) {
        case "number":
            return v.value;
        case "string":
            return v.value;
        case "boolean":
            return v.value;
        case "object":
        case "array":
            if (typeof v.value === 'string') {
                return JSON.parse(v.value);
            }
            return v.value;
        default:
            return undefined;
    }
}
function __injectGlobalObject(name, args) {
    Reflect.set(window, name, JSON.parse(args));
}
function __injectGlobalFunction(name) {
    Reflect.set(window, name, function () {
        const args = [];
        for (let i = 0; i < arguments.length; i++) {
            args.push(_wrappedValue(arguments[i]));
        }
        const ret = NativeClient.callNative(name, JSON.stringify(args));
        return _rawValue(JSON.parse(ret));
    });
}
function __invokeMethod(objectName, functionName, stringifiedArgs) {
    NativeClient.log(`invoke:${objectName}.${functionName}(${stringifiedArgs})`);
    try {
        const thisObject = Reflect.get(window, objectName);
        const thisFunction = Reflect.get(thisObject, functionName);
        const args = JSON.parse(stringifiedArgs);
        const rawArgs = args.map(e => _rawValue(e));
        const ret = Reflect.apply(thisFunction, thisObject, rawArgs);
        const returnVal = ret ? JSON.stringify(_wrappedValue(ret)) : "";
        NativeClient.log(`return:${returnVal}`);
        NativeClient.returnNative(returnVal);
    }
    catch (e) {
        NativeClient.log(`error:${e},${e.stack}`);
        NativeClient.returnNative("");
    }
}
function _prepared() {
    window.setTimeout = Reflect.get(window, "doricSetTimeout");
    window.setInterval = Reflect.get(window, "doricSetInterval");
    window.clearTimeout = Reflect.get(window, "doricClearTimeout");
    window.clearInterval = Reflect.get(window, "doricClearInterval");
}

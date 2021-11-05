declare module NativeClient {
    function log(message: string): void
    function returnNative(ret: string): void
    function callNative(name: string, args: string): string
}

type RawValue = number | string | boolean | object | undefined

type WrappedValue = {
    type: "number" | "string" | "boolean" | "object" | "array" | "null",
    value: RawValue,
}
function _binaryValue(v: RawValue) {
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
            } else {
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
function _wrappedValue(v: RawValue): WrappedValue {
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
            } else {
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

function _rawValue(v: WrappedValue): RawValue {
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
                return JSON.parse(v.value)
            }
            return v.value;
        default:
            return undefined;
    }
}

function _injectGlobalObject(name: string, args: string) {
    Reflect.set(window, name, JSON.parse(args));
}

function __injectGlobalFunction(name: string) {
    Reflect.set(window, name, function () {
        const args: any[] = [];
        for (let i = 0; i < arguments.length; i++) {
            args.push(_wrappedValue(arguments[i]));
        }
        const ret = NativeClient.callNative(name, JSON.stringify(args));
        return _rawValue(JSON.parse(ret));
    });
}

function __invokeMethod(objectName: string, functionName: string, stringifiedArgs: string) {
    NativeClient.log(`invoke:${objectName}.${functionName}(${stringifiedArgs})`)
    try {
        const thisObject = Reflect.get(window, objectName);
        const thisFunction = Reflect.get(thisObject, functionName);
        const args = JSON.parse(stringifiedArgs) as WrappedValue[];
        const rawArgs = args.map(e => _rawValue(e));
        const ret = Reflect.apply(thisFunction, thisObject, rawArgs);
        const returnVal = JSON.stringify(_wrappedValue(ret))
        NativeClient.log(`return:${returnVal}`)
        NativeClient.returnNative(returnVal)
    } catch (e) {
        NativeClient.log(`error:${e},${(e as any).stack}`)
        NativeClient.returnNative("")
    }
}
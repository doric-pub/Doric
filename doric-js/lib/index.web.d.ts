declare module NativeClient {
    function log(message: string): void;
    function returnNative(ret: string): void;
    function callNative(name: string, args: string): string;
}
declare type RawValue = number | string | boolean | object | undefined;
declare type WrappedValue = {
    type: "number" | "string" | "boolean" | "object" | "array" | "null";
    value: RawValue;
};
declare function _binaryValue(v: RawValue): {
    type: string;
    value: number;
} | {
    type: string;
    value: string;
} | {
    type: string;
    value: boolean;
} | {
    type: string;
    value: undefined;
};
declare function _wrappedValue(v: RawValue): WrappedValue;
declare function _rawValue(v: WrappedValue): RawValue;
declare function _injectGlobalObject(name: string, args: string): void;
declare function __injectGlobalFunction(name: string): void;
declare function __invokeMethod(objectName: string, functionName: string, stringifiedArgs: string): void;
declare function _prepared(): void;

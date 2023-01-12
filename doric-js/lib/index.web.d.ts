declare module NativeClient {
    function log(message: string): void;
    function returnNative(ret: string): void;
    function callNative(name: string, args: string): string;
    function fetchArrayBuffer(id: string): string;
}
type RawValue = number | string | boolean | object | undefined | ArrayBuffer;
type WrappedValue = {
    type: "number" | "string" | "boolean" | "object" | "array" | "null" | "arrayBuffer";
    value: RawValue;
};
declare function _arrayBufferToBase64(arrayBuffer: ArrayBuffer): string;
declare function _base64ToArrayBuffer(v: string): ArrayBufferLike;
declare function _wrappedValue(v: RawValue): WrappedValue;
declare const cachedArrayBuffer: Map<string, ArrayBuffer>;
declare let bufferId: number;
declare function traverse(obj: object): void;
declare function _rawValue(v: WrappedValue): RawValue;
declare function __injectGlobalObject(name: string, args: string): void;
declare function __injectGlobalFunction(name: string): void;
declare function __invokeMethod(objectName: string, functionName: string, stringifiedArgs: string): void;
declare function _prepared(): void;

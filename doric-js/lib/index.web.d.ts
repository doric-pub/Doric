declare module NativeClient {
    function callNative(name: string, args: string): string;
}
declare type RawValue = number | string | boolean | object | undefined;
declare type WrappedValue = {
    type: "number" | "string" | "boolean" | "object" | "array" | "null";
    value: RawValue;
};
declare function _wrappedValue(v: RawValue): WrappedValue;
declare function _rawValue(v: WrappedValue): RawValue;
declare function __injectGlobalObject(name: string, args: string): void;
declare function __injectGlobalFunction(name: string): void;

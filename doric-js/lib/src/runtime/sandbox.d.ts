import "reflect-metadata";
export declare function jsCallResolve(contextId: string, callbackId: string, args?: any): void;
export declare function jsCallReject(contextId: string, callbackId: string, args?: any): void;
export declare class Context {
    entity: any;
    id: string;
    callbacks: Map<string, {
        resolve: Function;
        reject: Function;
    }>;
    hookBeforeNativeCall(): void;
    hookAfterNativeCall(): void;
    constructor(id: string);
    callNative(namespace: string, method: string, args?: any): Promise<any>;
    register(instance: Object): void;
}
export declare function jsObtainContext(id: string): Context | undefined;
export declare function jsReleaseContext(id: string): void;
export declare function __require__(name: string): any;
export declare function jsRegisterModule(name: string, moduleObject: any): void;
export declare function jsCallEntityMethod(contextId: string, methodName: string, args?: any): any;
export declare function jsObtainEntry(contextId: string): <T extends new (...args: any[]) => {}>(constructor: T) => {
    new (...args: any[]): {
        context: Context | undefined;
    };
} & T;
export declare function jsCallbackTimer(timerId: number): void;

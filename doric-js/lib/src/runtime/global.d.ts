export * from 'reflect-metadata';
export declare type BridgeContext = {
    /**
     * The identify of current context
     */
    id: string;
    /**
     * In this case,It's current panel
     */
    entity: any;
    /**
     * call native plugin
     * @param namespace
     * @param method
     * @param args
     */
    callNative(namespace: string, method: string, args?: any): Promise<any>;
    /**
     * Transform function to functionId as string
     * @param func
     */
    function2Id(func: Function): string;
    /**
     * Remove transformed functions
     * @param funcId
     */
    removeFuncById(funcId: string): void;
};
declare global {
    const context: BridgeContext;
    const Environment: {
        platform: "Android" | "iOS" | "Qt" | "web";
        platformVersion: string;
        appName: string;
        appVersion: string;
        libVersion: string;
        screenWidth: number;
        screenHeight: number;
        statusBarHeight: number;
        hasNotch: boolean;
        /**
         * ex:Apple or Google
         */
        deviceBrand: string;
        /**
         * ex: iPhone12,5 or pixel 3
         */
        deviceModel: string;
        [index: string]: number | string | boolean | object | undefined;
    };
    function Entry(constructor: {
        new (...args: any[]): {};
    }): any;
}
export {};

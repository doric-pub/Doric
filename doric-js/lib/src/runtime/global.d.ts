export * from 'reflect-metadata';
export declare type BridgeContext = {
    [index: string]: {
        [index: string]: (args?: any) => Promise<any>;
    };
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
        [index: string]: number | string | boolean | object | undefined;
    };
    function Entry(constructor: {
        new (...args: any[]): {};
    }): any;
}
export {};

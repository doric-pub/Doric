export * from 'reflect-metadata';
export declare type BridgeContext = {
    [index: string]: {
        [index: string]: (args?: any) => Promise<any>;
    };
};
declare global {
    const context: BridgeContext;
    const Environment: {
        platform: "Android" | "iOS" | "Qt" | "h5";
        platformVersion: string;
        appName: string;
        appVersion: string;
        libVersion: string;
        screenWidth: number;
        screenHeight: number;
    };
    function Entry(constructor: {
        new (...args: any[]): {};
    }): any;
}
export {};

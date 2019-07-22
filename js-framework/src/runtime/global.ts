import { Context } from "./sandbox";
export * from 'reflect-metadata'

declare global {
    const context: Context;
    function Entry(constructor: { new(...args: any[]): {} }): any
}
export { }
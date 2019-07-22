import { Context } from "./sandbox";
require('reflect-metadata');

declare global {
    const context: Context;
    function Entry(constructor: { new(...args: any[]): {} }): any
}
export { }
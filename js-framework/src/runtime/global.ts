import { Context } from "./sandbox";

declare global {
    const context: Context;
    function Entry(constructor: { new(...args: any[]): {} }): any
}
export { }
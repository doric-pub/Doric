export * from 'reflect-metadata'

declare global {
    const context: { [index: string]: { [index: string]: (args?: any) => Promise<any> } };
    function Entry(constructor: { new(...args: any[]): {} }): any
}
export { }
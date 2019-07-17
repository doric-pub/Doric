/**
 * ``` TypeScript
 * // run in global scope
 * Reflect.apply(
 * function(hego,context,require){
 *  //Script content
 *  REG()
 * },hego.obtainContext(id),[
 * undefined,
 * hego.obtainContext(id),
 * hego.__require__,
 * ])
 * 
 * Reflect.apply(hego.registerModule,this,[
 *  moduleName,
 *  Reflect.apply(function(__module){
 *          return function(module,export,require){
 *                  })(__module,__module.exports,hego.__require__)
 *      },this,[{exports:{}}])
 * ])
 * 
 * ```
 */

export interface Context {
    id: number
    asyncCall(module: string, method: string, args: any, callbackId: string): any
}

const gContexts = new Map
const gModules = new Map

export function obtainContext(id: string) {
    if (gContexts.has(id)) {
        return gContexts.get(id)
    } else {
        const context = { id }
        gContexts.set(id, context)
        return context
    }
}

export function releaseContext(id: string) {
    gContexts.delete(id)
}

declare function nativeRequire(name: string): boolean

export function __require__(name: string): any {
    if (gModules.has(name)) {
        return gModules.get(name)
    } else {
        if (nativeRequire(name)) {
            return gModules.get(name)
        } else {
            return undefined
        }
    }
}
export function registerModule(name: string, moduleObject: any) {
    gModules.set(name, moduleObject)
}
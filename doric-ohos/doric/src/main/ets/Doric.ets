import { resourceManager } from '@kit.LocalizationKit';
import { DoricJSEngine } from './engine/DoricJSEngine'

export * from './DoricContext'
export * from './DoricPanel'
export * from './DoricViewController'
export * from './DoricRegistry'
export * from './engine/DoricJSEngine'
export * from './extension/DoricBridgeExtension'
export * from './loader/DoricJSLoaderManager'
export * from './plugin/DoricNativePlugin'
export * from './plugin/DoricShaderPlugin'
export * from './plugin/DoricPromise'
export * from './shader/DoricViewNode'
export * from './shader/DoricNodeModel'
export * from './shader/DoricNodeRenderer'
export * from './utils/DoricDelegates'

/**
 * Backward-compatible init function.
 * @param resMgr - ResourceManager instance from the caller's context
 */
export function init(resMgr: resourceManager.ResourceManager): void {
  DoricJSEngine.init(resMgr)
}

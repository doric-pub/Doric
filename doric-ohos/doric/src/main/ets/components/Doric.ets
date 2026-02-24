import {
  initDoric,
  prepareContext,
  destroyContext,
  invokeDoricMethod,
  setEnvironmentValue,
  teardownDoric,
  callEntityMethod
} from 'libdoric.so'
import { resourceManager } from '@kit.LocalizationKit';
import { DoricJSLoaderManager } from './DoricJSLoaderManager'

/**
 * DoricEngine - ArkTS wrapper for the native Doric JS Engine.
 *
 * Aligned with iOS DoricJSEngine interface.
 */
export class DoricEngine {

  /**
   * Initialize the Doric engine. Must be called once at app startup.
   * Aligned with iOS: [[DoricJSEngine alloc] init]
   *
   * @param resMgr - ResourceManager instance from the caller's context
   */
  static init(resMgr: resourceManager.ResourceManager): void {
    initDoric(resMgr)
    // Initialize default JS loaders with the resource manager
    DoricJSLoaderManager.getInstance().initDefaultLoaders(resMgr)
  }

  /**
   * Prepare a Doric context by loading a script.
   * Aligned with iOS: - (void)prepareContext:(NSString *)contextId script:(NSString *)script source:(NSString *)source;
   */
  static prepareContext(contextId: string, script: string, source: string): void {
    prepareContext(contextId, script, source)
  }

  /**
   * Destroy a Doric context.
   * Aligned with iOS: - (void)destroyContext:(NSString *)contextId;
   */
  static destroyContext(contextId: string): void {
    destroyContext(contextId)
  }

  /**
   * Invoke a method on the global "doric" JS object with arguments.
   * Aligned with iOS: - (JSValue *)invokeDoricMethod:(NSString *)method argumentsArray:(NSArray *)args;
   */
  static invokeDoricMethod(method: string, ...args: (string | number | boolean)[]): string {
    return invokeDoricMethod(method, ...args)
  }

  /**
   * Call a method on a specific context entity.
   * Aligned with iOS: DoricContext.callEntity:withArgumentsArray:
   */
  static callEntityMethod(contextId: string, method: string, ...args: (string | number | boolean)[]): string {
    return callEntityMethod(contextId, method, ...args)
  }

  /**
   * Set an environment key-value pair in the JS engine.
   * Aligned with iOS: - (void)setEnvironmentValue:(NSDictionary *)value;
   */
  static setEnvironmentValue(key: string, value: string | number): void {
    setEnvironmentValue(key, value)
  }

  /**
   * Teardown the Doric engine and release all resources.
   * Aligned with iOS: - (void)teardown;
   */
  static teardown(): void {
    teardownDoric()
  }
}

/**
 * Backward-compatible init function.
 * @param resMgr - ResourceManager instance from the caller's context
 */
export function init(resMgr: resourceManager.ResourceManager): void {
  DoricEngine.init(resMgr)
}

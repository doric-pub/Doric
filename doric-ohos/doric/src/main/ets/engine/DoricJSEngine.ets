import {
  initDoric,
  prepareContext,
  destroyContext,
  invokeDoricMethod,
  setEnvironmentValue,
  teardownDoric,
  callEntityMethod,
  registerBridgeCallback
} from 'libdoric.so'
import { resourceManager } from '@kit.LocalizationKit';
import { DoricJSLoaderManager } from '../loader/DoricJSLoaderManager'
import { DoricBridgeExtension } from '../extension/DoricBridgeExtension'
import { hilog } from '@kit.PerformanceAnalysisKit'

const TAG = 'DoricJSEngine'
const DOMAIN = 0x8000

/**
 * DoricJSEngine - ArkTS wrapper for the native Doric JS Engine.
 *
 * Aligned with iOS DoricJSEngine interface.
 */
export class DoricJSEngine {

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

    // Register the bridge callback so that nativeBridge calls from JS
    // are routed to DoricBridgeExtension on the ArkTS side.
    // Aligned with iOS: DoricJSEngine → DoricBridgeExtension chain
    const bridgeExtension = DoricBridgeExtension.getInstance()
    registerBridgeCallback(
      (contextId: string, module: string, method: string,
        callbackId: string, argument: string): void => {
        hilog.debug(DOMAIN, TAG,
          'Bridge callback: ctx=%{public}s mod=%{public}s method=%{public}s',
          contextId, module, method)
        bridgeExtension.callNative(contextId, module, method, callbackId, argument)
      }
    )

    hilog.info(DOMAIN, TAG, 'DoricJSEngine initialized with bridge callback')
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
  static invokeDoricMethod(method: string, ...args: (string | number | boolean | Object)[]): string {
    return invokeDoricMethod(method, ...args)
  }

  /**
   * Call a method on a specific context entity.
   * Aligned with iOS: DoricContext.callEntity:withArgumentsArray:
   */
  static callEntityMethod(contextId: string, method: string, ...args: (string | number | boolean | string[] | Object)[]): string {
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

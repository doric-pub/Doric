import { resourceManager } from '@kit.LocalizationKit';

/**
 * Initialize the Doric JS engine with a resource manager.
 * Must be called before any other Doric methods.
 */
export const initDoric: (resourceManager: resourceManager.ResourceManager) => void;

/**
 * Prepare a Doric context with a script.
 * Aligned with iOS: prepareContext:script:source:
 */
export const prepareContext: (contextId: string, script: string, source: string) => void;

/**
 * Destroy a Doric context.
 * Aligned with iOS: destroyContext:
 */
export const destroyContext: (contextId: string) => void;

/**
 * Invoke a method on the global "doric" JS object.
 * Aligned with iOS: invokeDoricMethod:argumentsArray:
 */
export const invokeDoricMethod: (method: string, ...args: (string | number | boolean)[]) => string;

/**
 * Set an environment value in the JS engine.
 * Aligned with iOS: setEnvironmentValue:
 */
export const setEnvironmentValue: (key: string, value: string | number) => void;

/**
 * Teardown the Doric JS engine and release all resources.
 * Aligned with iOS: teardown
 */
export const teardownDoric: () => void;

/**
 * Call a method on a Doric context entity.
 * Aligned with iOS: DoricContext.callEntity:withArgumentsArray:
 */
export const callEntityMethod: (contextId: string, method: string, ...args: (string | number | boolean)[]) => string;

/**
 * Register the ArkTS callback function that receives bridge calls from JS.
 * Must be called once during initialization, after initDoric().
 *
 * The callback is invoked on the ArkTS main thread whenever JS calls nativeBridge().
 * Aligned with iOS: DoricJSEngine → DoricBridgeExtension chain.
 */
export const registerBridgeCallback: (
  callback: (contextId: string, module: string, method: string, callbackId: string, argument: string) => void
) => void;

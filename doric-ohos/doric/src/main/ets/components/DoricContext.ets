/*
 * Copyright [2019] [Doric.Pub]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  prepareContext,
  destroyContext,
  callEntityMethod
} from 'libdoric.so'
import { DoricNavigatorDelegate, DoricNavBarDelegate, DoricStatusBarDelegate } from './DoricDelegates'

/**
 * DoricContextManager - Manages all active DoricContext instances.
 *
 * Aligned with iOS DoricContextManager.
 */
export class DoricContextManager {
  private static instance_: DoricContextManager | undefined = undefined
  private counter_: number = 0
  private contextMap_: Map<string, DoricContext> = new Map()

  static getInstance(): DoricContextManager {
    if (!DoricContextManager.instance_) {
      DoricContextManager.instance_ = new DoricContextManager()
    }
    return DoricContextManager.instance_!
  }

  /**
   * Create and register a new context. Returns the allocated contextId.
   */
  createContext(context: DoricContext, script: string, source: string): string {
    this.counter_++
    const contextId = this.counter_.toString()
    context.contextId = contextId
    this.contextMap_.set(contextId, context)
    prepareContext(contextId, script, source)
    return contextId
  }

  /**
   * Destroy and unregister a context by id.
   */
  destroyContext(context: DoricContext): void {
    const contextId = context.contextId
    this.contextMap_.delete(contextId)
    destroyContext(contextId)
  }

  /**
   * Get a context by its id.
   */
  getContext(contextId: string): DoricContext | undefined {
    return this.contextMap_.get(contextId)
  }

  /**
   * Get all alive contexts.
   */
  getAliveContexts(): DoricContext[] {
    const result: DoricContext[] = []
    this.contextMap_.forEach((ctx) => {
      result.push(ctx)
    })
    return result
  }
}

/**
 * Initial params for context build, aligned with iOS initialParams dictionary.
 */
class DoricInitialParams {
  width: number = 0
  height: number = 0
}

/**
 * DoricContext - Execution context for a single Doric panel.
 *
 * Aligned with iOS DoricContext:
 *   - contextId: unique identifier
 *   - source: script source identifier
 *   - script: raw JS script content
 *   - extra: initialization extra data (JSON string)
 *   - navigator / navBar / statusBar delegates
 *   - callEntity: invoke JS entity methods
 *   - build / onShow / onHidden / onEnvChanged lifecycle
 */
export class DoricContext {
  contextId: string = ''
  source: string = ''
  script: string = ''
  extra: string = ''
  destroyed: boolean = false

  /** Delegate references - aligned with iOS weak properties */
  navigator: DoricNavigatorDelegate | undefined = undefined
  navBar: DoricNavBarDelegate | undefined = undefined
  statusBar: DoricStatusBarDelegate | undefined = undefined

  /** Initial params for build, aligned with iOS initialParams */
  private initialParams_: DoricInitialParams = new DoricInitialParams()

  /**
   * Create a new DoricContext.
   * Aligned with iOS: initWithScript:source:extra:
   */
  constructor(script: string, source: string, extra?: string) {
    this.script = script
    this.source = source

    // Register with the context manager (this also calls prepareContext on native)
    DoricContextManager.getInstance().createContext(this, script, source)

    // Init and trigger __onCreate__
    if (extra !== undefined && extra.length > 0) {
      this.extra = extra
      this.callEntity('__init__', extra)
    }
    this.callEntity('__onCreate__')
  }

  /**
   * Invoke a method on this context's JS entity.
   * Aligned with iOS: - (DoricAsyncResult *)callEntity:(NSString *)method withArgumentsArray:(NSArray *)args;
   */
  callEntity(method: string, ...args: (string | number | boolean)[]): string {
    if (this.destroyed) {
      return ''
    }
    return callEntityMethod(this.contextId, method, ...args)
  }

  /**
   * Build the panel with the given size.
   * Aligned with iOS: - (void)build:(CGSize)size;
   */
  build(width: number, height: number): void {
    this.initialParams_.width = width
    this.initialParams_.height = height
    this.callEntity('__build__', JSON.stringify(this.initialParams_))
  }

  /**
   * Notify the context that it is being shown.
   * Aligned with iOS: - (void)onShow;
   */
  onShow(): void {
    this.callEntity('__onShow__')
  }

  /**
   * Notify the context that it is being hidden.
   * Aligned with iOS: - (void)onHidden;
   */
  onHidden(): void {
    this.callEntity('__onHidden__')
  }

  /**
   * Notify the context that environment has changed.
   * Aligned with iOS: - (void)onEnvChanged;
   */
  onEnvChanged(): void {
    this.callEntity('__onEnvChanged__')
  }

  /**
   * Reload with a new script.
   * Aligned with iOS: - (void)reload:(NSString *)script;
   */
  reload(script: string): void {
    // Destroy old context at native level
    destroyContext(this.contextId)

    this.script = script
    this.destroyed = false

    // Re-prepare at native level
    prepareContext(this.contextId, script, this.source)

    // Re-init
    if (this.extra.length > 0) {
      this.callEntity('__init__', this.extra)
    }
    this.callEntity('__onCreate__')
    this.build(this.initialParams_.width, this.initialParams_.height)
    this.onShow()
  }

  /**
   * Destroy this context and release resources.
   * Aligned with iOS: dealloc
   */
  teardown(): void {
    if (this.destroyed) {
      return
    }
    this.destroyed = true
    this.callEntity('__onDestroy__')
    DoricContextManager.getInstance().destroyContext(this)
  }
}

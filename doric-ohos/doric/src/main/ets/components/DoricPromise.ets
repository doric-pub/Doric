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

/**
 * DoricPromise - Promise callback mechanism for Doric plugins.
 *
 * Aligned with iOS DoricPromise:
 *   - initWithContext:callbackId:
 *   - resolve:
 *   - reject:
 *
 * When a JS -> Native bridge call is made, a callbackId is passed.
 * The plugin calls resolve/reject on this promise, which in turn
 * invokes the JS side's jsCallResolve/jsCallReject to complete the async cycle.
 *
 * Note: This module intentionally avoids importing DoricContext to prevent
 * circular dependencies. It uses DoricContextRef interface instead.
 */
import { invokeDoricMethod } from 'libdoric.so'
import { DoricContextRef } from './DoricViewNode'
import { hilog } from '@kit.PerformanceAnalysisKit'

const TAG = 'DoricPromise'
const DOMAIN = 0x8000

export class DoricPromise {
  private contextId_: string
  private callbackId_: string
  private contextRef_: DoricContextRef | undefined

  /**
   * Create a DoricPromise.
   * Aligned with iOS: - (instancetype)initWithContext:(DoricContext *)context callbackId:(NSString *)callbackId;
   *
   * @param contextId - The context ID
   * @param callbackId - The JS callback ID
   * @param contextRef - Optional context reference for destroyed check
   */
  constructor(contextId: string, callbackId: string, contextRef?: DoricContextRef) {
    this.contextId_ = contextId
    this.callbackId_ = callbackId
    this.contextRef_ = contextRef
  }

  /**
   * Resolve the promise, calling back to JS side.
   * Aligned with iOS: - (void)resolve:(id)result;
   *
   * Invokes doric.jsCallResolve(contextId, callbackId, result)
   */
  resolve(result?: string): void {
    if (this.contextRef_ !== undefined && this.contextRef_.destroyed) {
      return
    }
    try {
      if (result !== undefined && result !== null) {
        invokeDoricMethod('jsCallResolve', this.contextId_, this.callbackId_, result)
      } else {
        invokeDoricMethod('jsCallResolve', this.contextId_, this.callbackId_)
      }
    } catch (e) {
      hilog.error(DOMAIN, TAG, 'DoricPromise resolve error: %{public}s', (e as Error).message)
    }
  }

  /**
   * Reject the promise, calling back to JS side with an error.
   * Aligned with iOS: - (void)reject:(id)result;
   *
   * Invokes doric.jsCallReject(contextId, callbackId, result)
   */
  reject(result?: string): void {
    if (this.contextRef_ !== undefined && this.contextRef_.destroyed) {
      return
    }
    try {
      if (result !== undefined && result !== null) {
        invokeDoricMethod('jsCallReject', this.contextId_, this.callbackId_, result)
      } else {
        invokeDoricMethod('jsCallReject', this.contextId_, this.callbackId_)
      }
    } catch (e) {
      hilog.error(DOMAIN, TAG, 'DoricPromise reject error: %{public}s', (e as Error).message)
    }
  }
}

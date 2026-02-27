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

import { invokeDoricMethod } from 'libdoric.so'
import { DoricContextRef } from '../shader/DoricViewNode'
import { hilog } from '@kit.PerformanceAnalysisKit'

const TAG = 'DoricPromise'
const DOMAIN = 0x8000

/**
 * DoricPromise - Promise callback mechanism for Doric plugins.
 *
 * Aligned with iOS DoricPromise.
 */
export class DoricPromise {
  private contextId_: string
  private callbackId_: string
  private contextRef_: DoricContextRef | undefined

  /**
   * Create a DoricPromise.
   */
  constructor(contextId: string, callbackId: string, contextRef?: DoricContextRef) {
    this.contextId_ = contextId
    this.callbackId_ = callbackId
    this.contextRef_ = contextRef
  }

  /**
   * Resolve the promise, calling back to JS side.
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

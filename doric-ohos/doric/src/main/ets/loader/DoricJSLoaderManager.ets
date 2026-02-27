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

import { resourceManager } from '@kit.LocalizationKit'
import { http } from '@kit.NetworkKit'
import { hilog } from '@kit.PerformanceAnalysisKit'
import { util } from '@kit.ArkTS'

const TAG = 'DoricJSLoader'
const DOMAIN = 0x8000

/**
 * DoricLoaderProtocol
 */
export interface DoricLoaderProtocol {
  filter(source: string): boolean

  request(source: string): Promise<string>
}

/**
 * DoricRawFileJSLoader - Loads JS bundles from rawfile assets.
 */
export class DoricRawFileJSLoader implements DoricLoaderProtocol {
  private resMgr: resourceManager.ResourceManager

  constructor(resMgr: resourceManager.ResourceManager) {
    this.resMgr = resMgr
  }

  filter(source: string): boolean {
    return !source.includes('://') || source.startsWith('assets://')
  }

  async request(source: string): Promise<string> {
    let rawPath = source
    if (rawPath.startsWith('assets://')) {
      rawPath = rawPath.substring('assets://'.length)
    }
    if (!rawPath.endsWith('.js')) {
      rawPath = rawPath + '.js'
    }
    const filePath = `src/${rawPath}`

    try {
      const data = this.resMgr.getRawFileContentSync(filePath)
      const decoder = new util.TextDecoder('utf-8')
      const content = decoder.decodeToString(data)
      hilog.info(DOMAIN, TAG, 'Loaded rawfile: %{public}s (%{public}d bytes)', filePath, content.length)
      return content
    } catch (e) {
      try {
        const data = this.resMgr.getRawFileContentSync(rawPath)
        const decoder = new util.TextDecoder('utf-8')
        const content = decoder.decodeToString(data)
        hilog.info(DOMAIN, TAG, 'Loaded rawfile (fallback): %{public}s (%{public}d bytes)', rawPath, content.length)
        return content
      } catch (e2) {
        const errMsg = `Failed to load rawfile: ${filePath} and ${rawPath}`
        hilog.error(DOMAIN, TAG, '%{public}s', errMsg)
        throw new Error(errMsg)
      }
    }
  }
}

/**
 * DoricHttpJSLoader - Loads JS bundles from HTTP/HTTPS URLs.
 */
export class DoricHttpJSLoader implements DoricLoaderProtocol {
  filter(source: string): boolean {
    return source.startsWith('http://') || source.startsWith('https://')
  }

  async request(source: string): Promise<string> {
    const httpRequest = http.createHttp()
    try {
      const response = await httpRequest.request(source, {
        method: http.RequestMethod.GET,
        expectDataType: http.HttpDataType.STRING
      })
      if (response.responseCode === 200) {
        const content = response.result as string
        hilog.info(DOMAIN, TAG, 'Loaded HTTP: %{public}s (%{public}d bytes)', source, content.length)
        return content
      } else {
        throw new Error(`HTTP error ${response.responseCode} for ${source}`)
      }
    } finally {
      httpRequest.destroy()
    }
  }
}

/**
 * DoricJSLoaderManager - Manages JS bundle loaders.
 */
export class DoricJSLoaderManager {
  private static instance_: DoricJSLoaderManager | undefined = undefined
  private loaders_: DoricLoaderProtocol[] = []

  static getInstance(): DoricJSLoaderManager {
    if (!DoricJSLoaderManager.instance_) {
      DoricJSLoaderManager.instance_ = new DoricJSLoaderManager()
    }
    return DoricJSLoaderManager.instance_!
  }

  /**
   * Initialize default loaders with the given resource manager.
   */
  initDefaultLoaders(resMgr: resourceManager.ResourceManager): void {
    if (this.loaders_.length === 0) {
      this.loaders_.push(new DoricRawFileJSLoader(resMgr))
      this.loaders_.push(new DoricHttpJSLoader())
    }
  }

  /**
   * Add a custom JS loader.
   */
  addJSLoader(loader: DoricLoaderProtocol): void {
    this.loaders_.push(loader)
  }

  /**
   * Request a JS bundle from the first matching loader.
   */
  async request(source: string): Promise<string> {
    if (source.startsWith('_internal_://')) {
      const url = source.replace('_internal_://', 'internal://')
      const params = new Map<string, string>()
      const queryIndex = url.indexOf('?')
      if (queryIndex >= 0) {
        const queryStr = url.substring(queryIndex + 1)
        const pairs = queryStr.split('&')
        for (const pair of pairs) {
          const kv = pair.split('=')
          if (kv.length === 2) {
            params.set(kv[0], kv[1])
          }
        }
      }
      const contextId = params.get('context')
      const className = params.get('class')
      if (contextId && className) {
        return `Entry('${contextId}','${className}')`
      } else {
        throw new Error(`Scheme ${source} format error`)
      }
    }

    for (const loader of this.loaders_) {
      if (loader.filter(source)) {
        return await loader.request(source)
      }
    }

    throw new Error(`Cannot find JS Loader for ${source}`)
  }
}

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
import { BridgeContext } from "../runtime/global"

export interface IRequest {
    // `url` is the server URL that will be used for the request
    url?: string,
    // `method` is the request method to be used when making the request
    method?: "get" | "post" | "put" | "delete",
    // `headers` are custom headers to be sent
    headers?: { [index: string]: string }
    // `params` are the URL parameters to be sent with the request
    // Must be a plain object or a URLSearchParams object
    params?: { [index: string]: string }
    // `data` is the data to be sent as the request body
    // Only applicable for request methods 'PUT', 'POST', and 'PATCH'
    data?: object | string
    // `timeout` specifies the number of milliseconds before the request times out.
    // If the request takes longer than `timeout`, the request will be aborted.
    timeout?: number, // default is `0` (no timeout)
}

export interface IResponse {
    // `data` is the response that was provided by the server
    data: any,
    // `status` is the HTTP status code from the server response
    status: number,
    // `headers` the headers that the server responded with
    // All header names are lower cased
    headers?: { [index: string]: string },
}

function transformRequest(request: IRequest) {
    let url = request.url || ""
    if (request.params !== undefined) {
        const queryStrings = []
        for (let key in request.params) {
            queryStrings.push(`${key}=${encodeURIComponent(request.params[key])}`)
        }
        request.url = `${request.url}${url.indexOf('?') >= 0 ? '&' : '?'}${queryStrings.join('&')}`
    }
    if (typeof request.data === 'object') {
        request.data = JSON.stringify(request.data)
    }
    return request
}

export function network(context: BridgeContext) {
    return {
        request: (config: IRequest) => {
            return context.network.request(transformRequest(config)) as Promise<IResponse>
        },
        get: (url: string, config?: IRequest) => {
            let finalConfig = config
            if (finalConfig === undefined) {
                finalConfig = {}
            }
            finalConfig.url = url
            finalConfig.method = "get"
            return context.network.request(transformRequest(finalConfig)) as Promise<IResponse>
        },
        post: (url: string, data?: object | string, config?: IRequest) => {
            let finalConfig = config
            if (finalConfig === undefined) {
                finalConfig = {}
            }
            finalConfig.url = url
            finalConfig.method = "post"
            if (data !== undefined) {
                finalConfig.data = data
            }
            return context.network.request(transformRequest(finalConfig)) as Promise<IResponse>
        },
        put: (url: string, data?: object | string, config?: IRequest) => {
            let finalConfig = config
            if (finalConfig === undefined) {
                finalConfig = {}
            }
            finalConfig.url = url
            finalConfig.method = "put"
            if (data !== undefined) {
                finalConfig.data = data
            }
            return context.network.request(transformRequest(finalConfig)) as Promise<IResponse>
        },
        delete: (url: string, data?: object | string, config?: IRequest) => {
            let finalConfig = config
            if (finalConfig === undefined) {
                finalConfig = {}
            }
            finalConfig.url = url
            finalConfig.method = "delete"
            return context.network.request(transformRequest(finalConfig)) as Promise<IResponse>
        },
    }
}
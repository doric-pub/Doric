import { BridgeContext } from "../runtime/global";
export interface IRequest {
    url?: string;
    method?: "get" | "post" | "put" | "delete";
    headers?: {
        [index: string]: string;
    };
    params?: {
        [index: string]: string;
    };
    data?: object | string;
    timeout?: number;
}
export interface IResponse {
    data: any;
    status: number;
    headers?: {
        [index: string]: string;
    };
}
export declare function network(context: BridgeContext): {
    request: (config: IRequest) => Promise<IResponse>;
    get: (url: string, config?: IRequest | undefined) => Promise<IResponse>;
    post: (url: string, data?: string | object | undefined, config?: IRequest | undefined) => Promise<IResponse>;
    put: (url: string, data?: string | object | undefined, config?: IRequest | undefined) => Promise<IResponse>;
    delete: (url: string, data?: string | object | undefined, config?: IRequest | undefined) => Promise<IResponse>;
};

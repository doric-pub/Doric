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
    data: string;
    status: number;
    headers?: {
        [index: string]: string;
    };
}
export declare function network(context: BridgeContext): {
    request: (config: IRequest) => Promise<IResponse>;
    get: (url: string, config?: IRequest) => Promise<IResponse>;
    post: (url: string, data?: object | string, config?: IRequest) => Promise<IResponse>;
    put: (url: string, data?: object | string, config?: IRequest) => Promise<IResponse>;
    delete: (url: string, data?: object | string, config?: IRequest) => Promise<IResponse>;
};

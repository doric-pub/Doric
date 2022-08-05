import axios from "axios";
import { DoricPlugin } from "../DoricPlugin";

export class NetworkPlugin extends DoricPlugin {
    async request(args: {
        url: string,
        method: string,
        headers: any,
        data: any,
        timeout: number,
    }) {
        let result: any
        let error: any
        if (args.method.toLowerCase() === "get") {
            try {
                result = await axios.get<any>(
                    args.url,
                    {
                        headers: args.headers ? args.headers : {},
                        timeout: args.timeout
                    },
                )
            } catch (exception) {
                error = exception
            }
        } else if (args.method.toLowerCase() === "post") {
            try {
                result = await axios.post<any>(
                    args.url,
                    args.data,
                    {
                        headers: args.headers ? args.headers : {},
                        timeout: args.timeout
                    },
                )
            } catch (exception) {
                error = exception
            }
        } else if (args.method.toLowerCase() === "put") {
            try {
                result = await axios.put<any>(
                    args.url,
                    args.data,
                    {
                        headers: args.headers ? args.headers : {},
                        timeout: args.timeout
                    },
                )
            } catch (exception) {
                error = exception
            }
        } else if (args.method.toLowerCase() === "delete") {
            try {
                result = await axios.delete<any>(
                    args.url,
                    {
                        headers: args.headers ? args.headers : {},
                        timeout: args.timeout
                    },
                )
            } catch (exception) {
                error = exception
            }
        }

        result.data = JSON.stringify(result.data)
        if (result) {
            return Promise.resolve(result)
        }
        if (error) {
            return Promise.reject(error)
        }
    }
}
import { DoricPlugin } from "../DoricPlugin";

export class NavigatorPlugin extends DoricPlugin {
    push(args: {
        scheme: string,
        config?: {
            alias?: string,
            extra?: string,
        }
    }) {

    }

    pop() {

    }
}
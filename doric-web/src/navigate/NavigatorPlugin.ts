import { DoricPlugin } from "../DoricPlugin";
import { DoricElement } from "../DoricElement";
import { NavigationElement } from "./NavigationElement";

export class NavigatorPlugin extends DoricPlugin {
    navigation: NavigationElement | undefined = document.getElementsByTagName('doric-navigation')[0] as (NavigationElement | undefined)

    push(args: {
        source: string,
        config?: {
            alias?: string,
            extra?: string,
        }
    }) {
        if (this.navigation) {
            const div = new DoricElement
            div.src = args.source
            div.alias = args.config?.alias || args.source
            this.navigation.push(div)
            return Promise.resolve()
        } else {
            return Promise.reject('Not implemented')
        }
    }

    pop() {
        if (this.navigation) {
            this.navigation.pop()
            return Promise.resolve()
        } else {
            return Promise.reject('Not implemented')
        }
    }
}
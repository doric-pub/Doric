import { Panel } from '../ui/panel'
import { View } from '../ui/view'

export interface Driver {
    /**
     * Create and destory page
     */
    createPage(): Panel
    destoryPage(): Panel

    /**
     * Page lifecycle
     */
    dispatchOnCreate(): void
    dispatchOnDestory(): void
    dispatchOnShow(): void
    dispatchOnHidden(): void

    /**
     * Page render
     */
    dispatchBuild(): View
}

export interface Responser {
    constructor(): void
    respond(action: string, extra: any): void
}
import { Page } from '../ui/page'
import { View } from '../ui/view'

export interface Driver {
    /**
     * Create and destory page
     */
    createPage(): Page
    destoryPage(): Page

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
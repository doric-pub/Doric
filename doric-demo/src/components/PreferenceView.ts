import { hlayout, HLayout, layoutConfig, ViewComponent } from "doric";

@ViewComponent
export class PreferenceView extends HLayout {

    constructor() {
        super()
        hlayout(
            [],
            {
                layoutConfig: layoutConfig(),
            }).in(this)
    }
}
import { DoricPlugin } from "../DoricPlugin";

export class ShaderPlugin extends DoricPlugin {
    render(ret: any) {
        console.log('render', ret)
    }
}
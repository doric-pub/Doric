import { DoricPlugin } from './sandbox';

export class ShaderPlugin extends DoricPlugin {
  async render(props: any) {
    console.log("ShaderPlugin", JSON.stringify(props))
  }
}
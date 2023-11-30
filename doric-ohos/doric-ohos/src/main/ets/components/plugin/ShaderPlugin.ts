import { Panel } from 'doric';
import { DoricPlugin } from '../lib/sandbox';

export class ShaderPlugin extends DoricPlugin {
  async render(props: any) {
    const rootView = (this.context.entity as Panel).getRootView()
    console.log("ShaderPlugin", rootView.isDirty());
    this.context.rootNode.render();
  }
}
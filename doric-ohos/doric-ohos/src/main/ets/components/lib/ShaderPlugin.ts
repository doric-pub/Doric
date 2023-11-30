import { Panel, Superview, View } from 'doric';
import { DoricPlugin, RootNode } from './sandbox';
declare const Column: any;
declare const Row: any;
declare const Text: any;
declare const Image: any;
declare const Alignment: any;

export class ShaderPlugin extends DoricPlugin {

  async render(props: any) {
    const rootView = (this.context.entity as Panel).getRootView()
    console.log("ShaderPlugin", rootView.isDirty());
    this.context.rootNode.render();
  }
}
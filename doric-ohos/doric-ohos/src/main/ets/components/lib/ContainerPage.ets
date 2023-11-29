import { injectViewPU } from './Container';

/**
 * This template implements the business card function and consists of three components.The top part is the
 * title, and the bottom part is the Tab. The middle card content shows the business information.
 * Developers can enrich the function of title and Tab, and add relevant business information to the list.
 */

@Component
export struct ContainerPage {

  initialRenderView(){
    // @ts-ignore
    injectViewPU(this)
    // @ts-ignore
    super.initialRenderView()
  }

  build() {
  }
}
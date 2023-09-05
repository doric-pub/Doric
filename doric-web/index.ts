import axios from 'axios';
import smoothscroll from 'smoothscroll-polyfill';
import { registerDoricJSLoader } from './src/DoricBundleLoader';
import { DoricElement } from './src/DoricElement'
import { NavigationElement } from './src/navigate/NavigationElement'
export * from './src/DoricElement'
export * from './src/navigate/NavigationElement'
export * from './src/DoricPlugin'
export * from './src/DoricRegistry'
export * from './src/DoricDriver'
export * from './src/shader/DoricViewNode'
export * from './src/resource/DoricResourceLoader'

window.customElements.define('doric-div', DoricElement);
window.customElements.define('doric-navigation', NavigationElement);

smoothscroll.polyfill();

registerDoricJSLoader({
    filter: (source) => source.startsWith("assets://"),
    request: async (source) => {
        const ret = await axios.get<string>(source.replace("assets://", `${window.location.href}/../../doric-demo/bundle/`))
        return ret.data
    }
})
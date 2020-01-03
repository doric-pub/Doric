import { DoricElement } from './src/DoricElement'
import { NavigationElement } from './src/navigate/NavigationElement'
window.customElements.define('doric-div', DoricElement);
window.customElements.define('doric-navigation', NavigationElement);
export * from './src/DoricElement'
export * from './src/navigate/NavigationElement'
export * from './src/DoricPlugin'
export * from './src/DoricRegistry'
export * from './src/DoricDriver'
export * from './src/shader/DoricViewNode'
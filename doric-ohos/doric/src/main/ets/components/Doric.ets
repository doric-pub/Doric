import { initDoric } from 'libdoric.so'

export function init() {
  initDoric(getContext().resourceManager)
}
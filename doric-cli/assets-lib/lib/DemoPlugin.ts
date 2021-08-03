import { BridgeContext } from "doric";

export function demoPlugin(context: BridgeContext) {
  return {
    call: () => {
      return context.callNative("demoPlugin", "call") as Promise<string>;
    },
  };
}

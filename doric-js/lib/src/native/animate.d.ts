import { BridgeContext } from "../runtime/global";
/**
 * Only supports x,y,width,height,corner(just for four corners),rotation,bgColor,
 * @param panel @see Panel
 */
export declare function animate(context: BridgeContext): (args: {
    animations: () => void;
    duration: number;
}) => Promise<unknown>;

import { Stack } from "../widget/layouts";
import { View } from "../ui/view";
export declare class BlurEffect extends Stack {
    /**
     * Specify the effective rectangle.
     * If not set, the default is the entire area.
     */
    effectiveRect?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    /**
     * Specify the radius of blur effect.
     * If not set, the default value is 15.
     * Suggested value is from 1 to 25.
     */
    radius?: number;
}
export declare function blurEffect(views: View | View[], config?: Partial<BlurEffect>): BlurEffect;

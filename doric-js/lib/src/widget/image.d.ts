import { View } from "../ui/view";
import { Color } from "../util/color";
export declare enum ScaleType {
    ScaleToFill = 0,
    ScaleAspectFit = 1,
    ScaleAspectFill = 2
}
export declare class Image extends View {
    imageUrl?: string;
    /**
     * Read image from local file system.
    */
    imageFilePath?: string;
    /**
     * Read image from local path
     * For android,it based on assets dir.
     * For iOS,it based on main bundle dir.
    */
    imagePath?: string;
    /**
     * Read image from resource
     * For android,it will try to read from drawable.
     * For iOS,it will try to read from Image.Assets.
     */
    imageRes?: string;
    imageBase64?: string;
    scaleType?: ScaleType;
    isBlur?: boolean;
    /**
     * Display while image is loading
     * Local file name
     */
    placeHolderImage?: string;
    placeHolderImageBase64?: string;
    /**
     * Display while image is loading
     * Color
     * This priority is lower than placeHolderImage
     */
    placeHolderColor?: Color;
    /**
     * Display while image is failed to load
     * It can be file name in local path
     */
    errorImage?: string;
    errorImageBase64?: string;
    /**
     * Display while image is failed to load
     * Color
     * This priority is lower than errorImage
     */
    errorColor?: Color;
    loadCallback?: (image: {
        width: number;
        height: number;
        animated: boolean;
    } | undefined) => void;
    /**
     * Default is Environment.screenScale.
     */
    imageScale?: number;
    /**
     * Unit in pixel
     */
    stretchInset?: {
        left: number;
        top: number;
        right: number;
        bottom: number;
    };
}
export declare function image(config: Partial<Image>): Image;

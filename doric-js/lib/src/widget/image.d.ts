import { View } from "../ui/view";
import { Color } from "../util/color";
import { BridgeContext } from "../runtime/global";
import { Resource } from "../util/resource";
export declare enum ScaleType {
    ScaleToFill = 0,
    ScaleAspectFit = 1,
    ScaleAspectFill = 2
}
export declare class Image extends View {
    /**
     * Set pixels for image directly
    */
    imagePixels?: {
        width: number;
        height: number;
        pixels: ArrayBuffer;
    };
    /**
     * This could be loaded by customized resource loader
    */
    image?: Resource;
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
    /**
    * image tile
    *
    * If boolean value 'true' is passed, it equals { left: 0, top: 0, right: 0, bottom: 0 }
    * Android: only support all area tile, so you'd better pass boolean value.
    * iOS: support custom area tile, so you can pass object value and boolean value.
    */
    tileInset?: {
        left: number;
        top: number;
        right: number;
        bottom: number;
    } | boolean;
    /**
     * Called if loaded image is animated and played end.
     */
    onAnimationEnd?: () => void;
    isAnimating(context: BridgeContext): Promise<boolean>;
    startAnimating(context: BridgeContext): Promise<any>;
    stopAnimating(context: BridgeContext): Promise<any>;
    getImageInfo(context: BridgeContext): Promise<{
        width: number;
        height: number;
        mimeType: string;
    }>;
    getImagePixels(context: BridgeContext): Promise<ArrayBuffer>;
    setImagePixels(context: BridgeContext, image: {
        width: number;
        height: number;
        pixels: ArrayBuffer;
    }): Promise<void>;
}
export declare function image(config: Partial<Image>): Image;

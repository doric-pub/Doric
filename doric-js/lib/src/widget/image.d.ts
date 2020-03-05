import { IView, View } from "../ui/view";
import { Color } from "../util/color";
export declare enum ScaleType {
    ScaleToFill = 0,
    ScaleAspectFit = 1,
    ScaleAspectFill = 2
}
export interface IImage extends IView {
    imageUrl?: string;
    imageBase64?: string;
    scaleType?: ScaleType;
    isBlur?: boolean;
    placeHolderImage?: string;
    placeHolderColor?: Color;
    errorImage?: string;
    errorColor?: Color;
    loadCallback?: (image: {
        width: number;
        height: number;
    } | undefined) => void;
}
export declare class Image extends View implements IImage {
    imageUrl?: string;
    imageBase64?: string;
    scaleType?: ScaleType;
    isBlur?: boolean;
    /**
     * Display while image is loading
     * Local file name
     */
    placeHolderImage?: string;
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
    /**
     * Display while image is failed to load
     * Color
     * This priority is lower than errorImage
     */
    errorColor?: Color;
    loadCallback?: (image: {
        width: number;
        height: number;
    } | undefined) => void;
}
export declare function image(config: IImage): Image;

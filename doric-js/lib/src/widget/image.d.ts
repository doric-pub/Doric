import { IView, View } from "../ui/view";
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
    loadCallback?: (image: {
        width: number;
        height: number;
    } | undefined) => void;
}
export declare function image(config: IImage): Image;

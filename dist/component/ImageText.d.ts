import React from 'react';
import { ComponentDefinition } from "./Editable";
interface ImageTextProps {
    src: string;
    imageStyle?: any;
    textStyle?: any;
    imageClass?: string;
    textClass?: string;
    alt?: string;
    style?: any;
}
export declare const ImageText: React.FC<ImageTextProps>;
export declare const ImageTextDefinition: ComponentDefinition;
export {};

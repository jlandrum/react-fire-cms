import React from 'react';
import { ComponentDefinition } from "../interface/ComponentDefinition";
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

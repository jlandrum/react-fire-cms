import React from 'react';
import { ComponentDefinition } from '../interface/ComponentDefinition';
import { DescribeDynamicComponent } from '../interface/DescribeDynamicComponent';
interface DynamicComponentProps {
    content: DescribeDynamicComponent;
    className?: string;
    style?: string;
}
export declare const DynamicComponent: React.FC<DynamicComponentProps>;
export declare const DynamicComponentDefinition: ComponentDefinition;
export {};

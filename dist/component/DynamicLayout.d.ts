import React from 'react';
import { ComponentDefinition, DynamicLayoutCell } from '../interface';
export interface DynamicLayoutProps {
    cells?: DynamicLayoutCell[];
}
export declare const DynamicLayout: React.FC<DynamicLayoutProps>;
export declare const DynamicLayoutDefinition: ComponentDefinition<DynamicLayoutCell[]>;

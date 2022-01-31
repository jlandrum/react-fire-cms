import React from 'react';
import { DialogProps } from '..';
export interface DeleterProps extends DialogProps {
    path: string;
    style?: any;
    className?: any;
}
export declare const Deleter: React.FC<DeleterProps>;

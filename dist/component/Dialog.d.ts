import React from 'react';
export declare type ButtonType = 'normal' | 'primary' | 'warning';
export declare type Buttons = {
    label: string;
    action: Function;
    type?: ButtonType;
    disabled?: boolean;
}[];
export interface DialogProps {
    title?: string;
    open?: boolean;
    onClose?: () => void;
    buttons?: Buttons;
}
export declare const Dialog: React.FC<DialogProps>;

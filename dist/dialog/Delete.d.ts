import React from 'react';
import { DialogProps } from '../component/Dialog';
export interface LogoutProps extends DialogProps {
    identity: string;
    onDelete: () => Promise<void>;
}
export declare const Delete: React.FC<LogoutProps>;

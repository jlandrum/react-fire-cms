import React from 'react';
export declare type OnDataSet = (data: string) => void;
export interface ComponentDefinition {
    name: string;
    key: string;
    component: any;
    Editor: React.FC<{
        onDataSet: OnDataSet;
        data: string;
    }>;
}
import React from 'react';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
export declare type FieldType = 'string' | 'longform' | 'boolean' | 'image' | 'component';
export interface EditorField {
    name: string;
    hint?: string;
    type: FieldType;
}
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
export interface EditorComponentProps {
    onUpdateField: (key: string, value: string) => void;
    path: string;
    value: string;
}
interface EditableProps {
    fields: EditorField[];
    path: string;
    style?: any;
    className?: any;
}
export declare const Editable: React.FC<EditableProps>;
export {};

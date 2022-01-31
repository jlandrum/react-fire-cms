import React from 'react';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
export declare type FieldType = 'string' | 'longform' | 'boolean' | 'image' | 'component' | 'dynamicLayout' | 'menu' | 'url';
export interface EditorField {
    name: string;
    hint?: string;
    type: FieldType;
}
export declare type OnDataSet = (data: string) => void;
interface EditableProps {
    fields: EditorField[];
    path: string;
    style?: any;
    className?: any;
}
export declare const Editable: React.FC<EditableProps>;
export {};

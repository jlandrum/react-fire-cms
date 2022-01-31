import React from 'react';
import { EditorComponentProps } from '../../interface/EditorComponentProps';
import { LinkReference } from '../../interface/LinkReference';
interface MenuEditorProps extends EditorComponentProps<LinkReference[]> {
}
export declare const MenuEditor: React.FC<MenuEditorProps>;
export default MenuEditor;

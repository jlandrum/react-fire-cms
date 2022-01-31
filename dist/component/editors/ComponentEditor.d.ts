import React from 'react';
import { EditorComponentProps } from '../../interface/EditorComponentProps';
import { DescribeDynamicComponent } from '../../interface/DescribeDynamicComponent';
interface ComponentEditorProps extends EditorComponentProps<DescribeDynamicComponent> {
}
declare const ComponentEditor: React.FC<ComponentEditorProps>;
export default ComponentEditor;

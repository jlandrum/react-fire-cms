import React from 'react';
import { EditorComponentProps } from '../../interface/EditorComponentProps';

interface StringEditorProps extends EditorComponentProps<string> {}

const StringEditor: React.FC<StringEditorProps> = ({onUpdate, value}) => {
  return (
    <>
      <input 
              onChange={(e) => onUpdate(e.target.value)} 
              value={value} />
    </>);

}

export default StringEditor;
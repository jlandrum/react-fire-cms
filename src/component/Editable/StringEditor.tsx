import React from 'react';
import { EditorComponentProps } from ".";

interface StringEditorProps extends EditorComponentProps {}

const StringEditor: React.FC<StringEditorProps> = ({onUpdateField, path, value}) => {
  return (
    <>
      <input 
              onChange={(e) => onUpdateField(path, e.target.value)} 
              id={path} 
              value={value} />
    </>);

}

export default StringEditor;
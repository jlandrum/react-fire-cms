import React from 'react';
import { EditorComponentProps } from ".";

interface NumberEditorProps extends EditorComponentProps {}

const NumberEditor: React.FC<NumberEditorProps> = ({onUpdateField, path, value}) => {
  return (
    <>
      <input 
              type='number'
              onChange={(e) => onUpdateField(path, e.target.value)} 
              id={path} 
              value={value} />
    </>);

}

export default NumberEditor;
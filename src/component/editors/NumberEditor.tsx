import React from 'react';
import { EditorComponentProps } from '../../interface/EditorComponentProps';

interface NumberEditorProps extends EditorComponentProps<string> {}

const NumberEditor: React.FC<NumberEditorProps> = ({onUpdate, value}) => {
  return (
    <>
      <input 
              type='number'
              onChange={(e) => onUpdate(e.target.value)} 
              value={value} />
    </>);

}

export default NumberEditor;
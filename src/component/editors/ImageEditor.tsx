import React from 'react';
import { EditorComponentProps } from '../../interface/EditorComponentProps';
import MediaSelector from "../../dialog/MediaSelector";

interface ImageEditorProps extends EditorComponentProps<string> {}

const ImageEditor: React.FC<ImageEditorProps> = ({onUpdate, value}) => {
  return (
    <div className="RFCMS__Editable__Dialog__Image">
      <input 
              onChange={(e) => onUpdate(e.target.value)} 
              value={value} />
      <MediaSelector onSelect={onUpdate} />
    </div>
  );

}

export default ImageEditor;
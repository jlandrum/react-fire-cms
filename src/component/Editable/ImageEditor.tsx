import React from 'react';
import { EditorComponentProps } from ".";
import MediaSelector from "../../dialog/MediaSelector";

interface ImageEditorProps extends EditorComponentProps {}

const ImageEditor: React.FC<ImageEditorProps> = ({onUpdateField, path, value}) => {
  return (
    <div className="RFC__Editable__Dialog__Image">
      <input 
              onChange={(e) => onUpdateField(path, e.target.value)} 
              id={path} 
              value={value} />
      <MediaSelector onSelect={v => onUpdateField(path, v)} />
    </div>
  );

}

export default ImageEditor;
import React from 'react';
import { ComponentDefinition } from "../interface/ComponentDefinition";
import ImageEditor from './editors/ImageEditor';

interface ImageTextProps {
  src: string;
  imageStyle?: any;
  textStyle?: any;
  imageClass?: string;
  textClass?: string;
  alt?: string;
  style?: any;
}

export const ImageText: React.FC<ImageTextProps> = ({alt, style, imageStyle, textStyle, imageClass, textClass, src}) => {
  if (src?.startsWith('http')) {
    return <img src={src} style={{...style, ...imageStyle}} className={imageClass} alt={alt} />
  } else {
    return <span style={{...style, ...textStyle}} className={textClass}>{src}</span>
  }
}

export const ImageTextDefinition: ComponentDefinition = {
  name: 'Image / Text',
  key: 'imageText',
  component: ImageText,
  Editor: ({onDataSet, data}) => (
    <div className="RFCMS__EditorStyles__Editor__Form">
      <span>Image URL / Text</span>
      <ImageEditor value={data} onUpdate={onDataSet} />
    </div>
  )  
}

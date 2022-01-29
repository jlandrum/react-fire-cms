import React from 'react';
import { useEffect, useState } from "react";
import { ComponentDefinition } from "./Editable";
import StringEditor from "./Editable/StringEditor";

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
  Editor: ({onDataSet, data}) => {
    const parsed = JSON.parse(data);
    const [src, setSrc] = useState(parsed?.src)

    useEffect(() => {
      onDataSet(JSON.stringify({src}));
    }, [src]);

    return (
      <div className="RFC__EditorStyles__Editor__Form">
        <span>Source</span>
        <StringEditor value={parsed.src} path='' onUpdateField={(_, value) => setSrc(value)} />
      </div>
    )
  }
}

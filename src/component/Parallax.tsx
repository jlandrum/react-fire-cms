import React from 'react';
import { createRef, useCallback, useEffect, useState } from "react";
import { ComponentDefinition } from "./Editable";
import ImageEditor from "./Editable/ImageEditor";
import NumberEditor from "./Editable/NumberEditor";

interface ParallaxProps {
  src: string;
  zoom: number;
}

const Parallax: React.FC<ParallaxProps> = ({src, zoom}) => {
  const ref = createRef<HTMLDivElement>();
  const [offset, setOffset] = useState(-1);

  const scrollHandler = useCallback(() => {    
    const offset = ref.current?.getBoundingClientRect()?.top || 0;
    const percent = offset / window.innerHeight / 2;
    setOffset(percent - 1);
  }, [ref])

  useEffect(() => { 
    window.addEventListener('scroll', scrollHandler);
    return () => { window.removeEventListener('scroll', scrollHandler)}
  }, [scrollHandler]);

  return (
    <div ref={ref} className="RFC__Parallax">
      <div className="RFC__Parallax__Inner" 
           style={{backgroundImage: `url(${src})`, 
                  width: `100%`,
                  height: `calc(100% + ${zoom * 2}px)`,
                  backgroundPositionY: `calc(${zoom * offset}px)`,
                  }}/>

    </div>
  )
}

export const ParallaxDefinition: ComponentDefinition = {
  name: 'Parallax',
  key: 'Parallax',
  component: Parallax,
  Editor: ({onDataSet, data}) => {
    const parsed = JSON.parse(data || '{}');
    const [src, setSrc] = useState(parsed?.src || '')
    const [zoom, setZoom] = useState(parsed?.zoom || '0')

    useEffect(() => {
      onDataSet(JSON.stringify({src, zoom}));
    }, [src, zoom]);

    return (
      <div className="RFC__EditorStyles__Editor__Form">
        <span>Source</span>
        <ImageEditor value={parsed.src} path='' onUpdateField={(_, value) => setSrc(value)} />
        <span>Zoom</span>
        <NumberEditor value={parsed.zoom} path='' onUpdateField={(_, value) => setZoom(value)} />
      </div>
    )
  }
}

export default Parallax;
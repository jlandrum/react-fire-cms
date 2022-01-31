import React from 'react';
import { createRef, useCallback, useEffect, useState } from "react";
import { ComponentDefinition } from "../interface";
import ImageEditor from "./editors/ImageEditor";
import NumberEditor from "./editors/NumberEditor";

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
    <div ref={ref} className="RFCMS__Parallax">
      <div className="RFCMS__Parallax__Inner" 
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
  key: 'parallax',
  component: Parallax,
  Editor: ({onDataSet, data}) => {
    const update = (src?: string, zoom?: string) => {
      onDataSet({
        src: src || data.src, 
        zoom: zoom || data.zoom
      });
    };

    return (
      <div className="RFCMS__EditorStyles__Editor__Form">
        <span>Source</span>
        <ImageEditor value={data?.src} onUpdate={s => update(s)} />
        <span>Zoom</span>
        <NumberEditor value={data?.zoom} onUpdate={z => update(undefined, z)} />
      </div>
    )
  }
}

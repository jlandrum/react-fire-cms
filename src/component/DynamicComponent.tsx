import React from 'react';
import { useConfig } from '../ReactFireCms';

interface DynamicComponentProps {
  content: string;
  className?: string;
  style?: string;
}

export const DynamicComponent: React.FC<DynamicComponentProps> = ({content, className, style}) => {
  const config = useConfig();
  const parsed = JSON.parse(content || '{}');
  const component = parsed?.component;
  const props = JSON.parse(parsed?.data || '{}');
  const Component = config.components.find(it => it.key === component)?.component;

  return (
    Component ? <Component {...props} className={className} style={style} /> : <></>
  )
}
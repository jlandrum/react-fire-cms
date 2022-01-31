import React from 'react';
import { useConfig } from '../hooks';
import { ComponentDefinition } from '../interface/ComponentDefinition';
import { DescribeDynamicComponent } from '../interface/DescribeDynamicComponent';
import ComponentEditor from './editors/ComponentEditor';

interface DynamicComponentProps {
  content: DescribeDynamicComponent;
  className?: string;
  style?: string;
}

export const DynamicComponent: React.FC<DynamicComponentProps> = ({content, className, style}) => {
  const config = useConfig();
  const component = content?.component;
  const props = (content?.props || {}) as DescribeDynamicComponent;
  const Component = config.components.find(it => it.key === component)?.component;

  return (
    Component ? <Component {...props} className={className} style={style} /> : <></>
  )
}

export const DynamicComponentDefinition: ComponentDefinition = {
  name: 'Dynamic Component',
  key: 'dynamicComponent',
  component: DynamicComponent,
  Editor: ({onDataSet, data}) => {
    return (
      <div className="RFCMS__EditorStyles__Editor__Form">
        <span>Component</span>
        <ComponentEditor value={data} onUpdate={onDataSet} />
      </div>
    )
  }
}
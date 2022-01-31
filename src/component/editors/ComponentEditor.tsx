import React from 'react';
import { EditorComponentProps } from '../../interface/EditorComponentProps';
import { useConfig } from "../../hooks";
import { DescribeDynamicComponent } from '../../interface/DescribeDynamicComponent';

interface ComponentEditorProps extends EditorComponentProps<DescribeDynamicComponent> {}

const ComponentEditor: React.FC<ComponentEditorProps> = ({onUpdate, value}) => {
  const config = useConfig();
  
  const component = value?.component
  const props = value?.props

  const update = (component?: string, props?: any) => {
    onUpdate({
      component: component || value?.component,
      props: props || value?.props
    });
  }

  const Editor = config.components.find(it => it.key === component)?.Editor;

  return (
    <>
      <select value={component} onChange={e => update(e.target.value)}>
        <option>Select a Component</option>
        { config.components.map((c, i) => <option key={`${c.key}_${i}`} value={c.key}>{c.name}</option>)}
      </select>
      { Editor && <Editor onDataSet={(data) => update(undefined, data)} data={props} />}
    </>);

}

export default ComponentEditor;
import React from 'react';
import { useEffect } from "react";
import { ChangeEvent, useCallback, useState } from "react";
import { EditorComponentProps } from ".";
import { useConfig } from "../../ReactFireCms";

interface ComponentEditorProps extends EditorComponentProps {}

const ComponentEditor: React.FC<ComponentEditorProps> = ({onUpdateField, path, value}) => {
  const input = JSON.parse(value || '{}');
  const rfcConfig = useConfig();
  
  const [component, setComponent] = useState(input.component || '')
  const [data, setData] = useState(input.data || '{}')

  useEffect(() => {
    const output = {
      component,
      data
    };
    onUpdateField(path, JSON.stringify(output));
  }, [data, component]);

  const onOptionSelect = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setComponent(e.target.value)
  }, []);

  const onDataSet = useCallback((data: string) => {
    setData(data);
  }, [])

  const Editor = rfcConfig.components.find(it => it.key === component)?.Editor;

  return (
    <>
      <select value={component} onChange={onOptionSelect}>
        <option>Select a Component</option>
        { rfcConfig.components.map(c => <option value={c.key}>{c.name}</option>)}
      </select>
      { Editor && <Editor onDataSet={onDataSet} data={data} />}
    </>);

}

export default ComponentEditor;
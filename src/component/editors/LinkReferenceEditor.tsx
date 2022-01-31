import React from 'react';
import { EditorComponentProps } from '../../interface/EditorComponentProps';
import { LinkReference } from '../../interface/LinkReference';

interface StringEditorProps extends EditorComponentProps<LinkReference> {}

export const LinkReferenceEditor: React.FC<StringEditorProps> = ({onUpdate, value}) => {
  const updateValue = (content?: string, url?: string) => {
    onUpdate({
      content: content || value.content,
      url: url || value.url,
    })
  }
  return (
    <>
      <input 
              onChange={(e) => updateValue(e.target.value)} 
              value={value.content} />
      <input 
              onChange={(e) => updateValue(undefined, e.target.value)} 
              value={value.url} />
    </>);

}

export default LinkReferenceEditor;
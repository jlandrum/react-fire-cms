import React, { useCallback } from 'react';
import { IoCloseCircle } from 'react-icons/io5';
import { EditorComponentProps } from '../../interface/EditorComponentProps';
import { LinkReference } from '../../interface/LinkReference';
import LinkReferenceEditor from './LinkReferenceEditor';

interface MenuEditorProps extends EditorComponentProps<LinkReference[]> {}

export const MenuEditor: React.FC<MenuEditorProps> = ({onUpdate, value}) => {
  const addRow = useCallback(e => {
    e.preventDefault();
    onUpdate([...(value || []), {
      url: '',
      content: '',
    }]);
  }, [value]);

  const removeItemAt = useCallback((index: number) => {
    const after = [...value.slice(0,index), ...value.slice(index+1)];
    onUpdate(after)
  }, [value]);
  
  const replaceItemAt = useCallback((index: number, data: LinkReference) => {
    const after = [
      ...value.slice(0,index), 
      { 
        ...data
      },
      ...value.slice(index+1)];
      onUpdate(after)
  }, [value]);

  return (
    <div className="RFCMS__EditorStyles__Editor__Form">
      <button onClick={addRow}>Add Menu Item</button>
      <div>
        {
          value?.map((it, index) => 
            <div key={`${index}_`} className="RFCMS__MenuEditor__Editor">
              <div className="RFCMS__MenuEditor__Editor__Row">
                <LinkReferenceEditor               
                  onUpdate={(data) => replaceItemAt(index, data)} 
                  value={it} 
                />
                <IoCloseCircle className="RFCMS__DynamicLayout__Editor__Header__Delete" onClick={() => removeItemAt(index)} />
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default MenuEditor;


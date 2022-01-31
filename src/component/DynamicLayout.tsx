import React, { useCallback } from 'react';
import { IoCloseCircle } from 'react-icons/io5';
import { DynamicComponent, DynamicComponentDefinition } from '..';
import { ComponentDefinition, DynamicLayoutCell } from '../interface';
import StringEditor from './editors/StringEditor';

export interface DynamicLayoutProps {
  cells?: DynamicLayoutCell[]
}

export const DynamicLayout: React.FC<DynamicLayoutProps> = ({cells}) => {
  return (
    <>
      {cells?.map?.(comp => <DynamicComponent content={comp.description} />)}
    </>
  )
}

export const DynamicLayoutDefinition: ComponentDefinition<DynamicLayoutCell[]> = {
  name: 'DynamicLayout',
  key: 'dynamicLayout',
  component: DynamicLayout,
  Editor: ({onDataSet, data}) => {  
    const addRow = useCallback(e => {
      e.preventDefault();
      onDataSet([...(data || []), {
        description: { component: undefined, props: {} },
        size: '100%',
      }]);
    }, [data]);

    const removeItemAt = useCallback((index: number) => {
      const after = [...data.slice(0,index), ...data.slice(index+1)];
      onDataSet(after)
    }, [data]);
    
    const replaceItemAt = useCallback((index: number, description: any, size?: string) => {
      const after = [
        ...data.slice(0,index), 
        { 
          description: description || data[index].description,
          size: size || data[index].size,
        }, 
        ...data.slice(index+1)];
      onDataSet(after)
    }, [data]);

    return (
      <div className="RFCMS__EditorStyles__Editor__Form">
        <button onClick={addRow}>Add Row</button>
        <div>
          {
            data?.map((it, index) => 
              <div key={`${index}_`} className="RFCMS__DynamicLayout__Editor">
                <div className="RFCMS__DynamicLayout__Editor__Header">
                  <label>Size (See guide for accepted formats)</label>
                  <StringEditor value={it.size} onUpdate={data => replaceItemAt(index, undefined, data)} />
                  <IoCloseCircle className="RFCMS__DynamicLayout__Editor__Header__Delete" onClick={() => removeItemAt(index)} />
                </div>
                <DynamicComponentDefinition.Editor                   
                  onDataSet={(data) => replaceItemAt(index, data)} 
                  data={it.description} 
                />
              </div>
            )
          }
        </div>
      </div>
    )
  }
}

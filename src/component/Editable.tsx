import React from 'react';
import { doc, setDoc } from "firebase/firestore";
import { FormEvent, useCallback, useEffect, useState } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useHotkeys } from "react-hotkeys-hook";
import { FaPencilAlt } from "react-icons/fa";
import { useUser, useFirestore, useFirestoreDocData } from "reactfire";
import { Dialog, Buttons, DialogProps } from "./Dialog";
import StringEditor from "./editors/StringEditor";
import LongFormEditor from "./editors/LongFormEditor";
import ComponentEditor from "./editors/ComponentEditor";
import { ImageTextDefinition } from '..';
import { DynamicLayoutDefinition } from './DynamicLayout';
import MenuEditor from './editors/MenuEditor';
import LinkReferenceEditor from './editors/LinkReferenceEditor';

export type FieldType = 'string' | 'longform' | 'boolean' | 'image' | 
                        'component' | 'dynamicLayout' | 'menu' | 'url';

export interface EditorField {
  name: string,
  hint?: string,
  type: FieldType,
}

export type OnDataSet = (data: string) => void;

interface EditableProps {
  fields: EditorField[]
  path: string,
  style?: any,
  className?: any,
}

interface EditableDialogProps extends DialogProps {
  fields: EditorField[],
  path: string,
}

const EditableDialog: React.FC<EditableDialogProps> = ({open, fields, path, onClose}) => {
  const firestore = useFirestore();
  const document = doc(firestore, path);
  const data = useFirestoreDocData(document);
  const [error, setError] = useState('')
  const [toSubmit, setToSubmit] = useState({} as {[key:string]: any})

  useEffect(() => {
    setToSubmit(
      fields.reduce((p, c) => {
        const current = p;
        current[c.name] = data.data?.[c.name] || undefined;
        return current;
      }, {} as {[key:string]: any})
    )
  }, [fields, data]);

  const submitChanges = (e?: FormEvent) => {
    e?.preventDefault();
    console.error('Submitting: ', toSubmit);

    setDoc(document, toSubmit, {merge: true})
      .then(onClose)
      .catch((e) => setError(e));
  }

  const updateField = useCallback((name: string, value: any) => {
    const copy = {...toSubmit};
    copy[name] = value;
    setToSubmit(copy);
  }, [toSubmit]);

  const buttons: Buttons = [
    { label: 'Cancel', action: () => onClose?.()},
    { label: 'Save', action: submitChanges },
  ]

  const renderEditor = (field: EditorField) => {
    switch (field.type) {
      case 'string':
        return <StringEditor onUpdate={v => updateField(field.name, v)} value={toSubmit[field.name]} />
      case 'image':
        return <ImageTextDefinition.Editor onDataSet={v => updateField(field.name, v)} data={toSubmit[field.name]} />
      case 'longform':
        return <LongFormEditor onUpdate={v => updateField(field.name, v)} value={toSubmit[field.name]} />
      case 'component':
        return <ComponentEditor onUpdate={v => updateField(field.name, v)} value={toSubmit[field.name]} />
      case 'dynamicLayout': 
        return <DynamicLayoutDefinition.Editor onDataSet={v => updateField(field.name, v)} data={toSubmit[field.name]} />  
      case 'url':
        return <LinkReferenceEditor onUpdate={v => updateField(field.name, v)} value={toSubmit[field.name]} />
      case 'menu':
        return <MenuEditor onUpdate={v => updateField(field.name, v)} value={toSubmit[field.name]} />
      default:
        return <></>;  
    }
  }

  return (
    <Dialog title="Edit Fields" {...{onClose, open}} buttons={buttons}>
      { open && (
        <form className="RFCMS__Editable__Dialog" onSubmit={submitChanges}>
        <span className='Text__Error'>{error}</span>
        {
          fields?.map(field => (
            <div key={field.name} className="RFCMS__Editable__Dialog__Field">
              <div className="RFCMS__Editable__Dialog__Label">
                {field.hint || field.name}
              </div>
              { renderEditor(field) }
            </div>
          ))
        }
      </form>
      )
    }
    </Dialog>
  )
}

export const Editable: React.FC<EditableProps> = ({fields, style, path, className, children}) => {
  const user = useUser();
  const [shown, setShown] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const [preview, setPreview] = useState(false);

  useHotkeys('e', () => { setHighlight(true) });
  useHotkeys('e', () => { setHighlight(false) }, { keydown: false, keyup: true });
  useHotkeys('p', () => { setPreview(true) });
  useHotkeys('p', () => { setPreview(false) }, { keydown: false, keyup: true });

  return user.data ? (
    <div style={style} className={`${className} RFCMS__Editable ${preview && 'RFCMS__Editable--Preview'}`}>
      {children}
      <EditableDialog path={path} open={shown} fields={fields} onClose={() => setShown(false)} />
      <div className={`RFCMS__Editable__Pencil ${highlight && 'RFCMS__Editable__Pencil--Highlight'} ${preview && 'RFCMS__Editable__Pencil--Preview'}`}>
        <FaPencilAlt onClick={() => setShown(true)} className="RFCMS__Editable__Pencil__Text" />
      </div>
    </div>
  ) : (<>{children}</>)
}
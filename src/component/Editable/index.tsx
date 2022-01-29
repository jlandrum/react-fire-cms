import React from 'react';
import { doc, setDoc } from "firebase/firestore";
import { FormEvent, useCallback, useEffect, useState } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useHotkeys } from "react-hotkeys-hook";
import { FaPencilAlt } from "react-icons/fa";
import { useUser, useFirestore, useFirestoreDocData } from "reactfire";
import { Dialog, Buttons, DialogProps } from "../Dialog";
import StringEditor from "./StringEditor";
import ImageEditor from "./ImageEditor";
import LongFormEditor from "./LongFormEditor";
import ComponentEditor from "./ComponentEditor";

export type FieldType = 'string' | 'longform' | 'boolean' | 'image' | 'component';

export interface EditorField {
  name: string,
  hint?: string,
  type: FieldType,
}

export type OnDataSet = (data: string) => void;

export interface ComponentDefinition {
  name: string;
  key: string;
  component: any;
  Editor: React.FC<{onDataSet: OnDataSet, data: string}>;
}

export interface EditorComponentProps {
  onUpdateField: (key: string, value: string) => void;
  path: string;
  value: string;
}

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
        current[c.name] = data.data?.[c.name] || '';
        return current;
      }, {} as {[key:string]: any})
    )
  }, [fields, data]);

  const submitChanges = (e?: FormEvent) => {
    e?.preventDefault();
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
        return <StringEditor onUpdateField={updateField} path={field.name} value={toSubmit[field.name]} />
      case 'image':
        return <ImageEditor onUpdateField={updateField} path={field.name} value={toSubmit[field.name]} />
      case 'longform':
        return <LongFormEditor onUpdateField={updateField} path={field.name} value={toSubmit[field.name]} />
      case 'component':
        return <ComponentEditor onUpdateField={updateField} path={field.name} value={toSubmit[field.name]} />
      default:
        return <></>;  
    }
  }

  return (
    <Dialog title="Edit Fields" {...{onClose, open}} buttons={buttons}>
      { open && (
        <form className="RFC__Editable__Dialog" onSubmit={submitChanges}>
        <span className='Text__Error'>{error}</span>
        {
          fields?.map(field => (
            <div key={field.name} className="RFC__Editable__Dialog__Field">
              <div className="RFC__Editable__Dialog__Label">
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
    <div style={style} className={`${className} RFC__Editable ${preview && 'RFC__Editable--Preview'}`}>
      {children}
      <EditableDialog path={path} open={shown} fields={fields} onClose={() => setShown(false)} />
      <div className={`RFC__Editable__Pencil ${highlight && 'RFC__Editable__Pencil--Highlight'} ${preview && 'RFC__Editable__Pencil--Preview'}`}>
        <FaPencilAlt onClick={() => setShown(true)} className="RFC__Editable__Pencil__Text" />
      </div>
    </div>
  ) : (<>{children}</>)
}
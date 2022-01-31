import { deleteDoc, doc } from 'firebase/firestore';
import React from 'react';
import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { FaTrash } from 'react-icons/fa';
import { useFirestore } from 'reactfire';
import { DialogProps } from '..';
import { Delete } from '../dialog/Delete';
import { useUser } from "../hooks";

export interface DeleterProps extends DialogProps {
  path: string;
  style?: any;
  className?: any;
}

export const Deleter: React.FC<DeleterProps> = ({style, className, path, children}) => {
  const { userExists } = useUser();
  const [shown, setShown] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const [preview, setPreview] = useState(false);

  const firestore = useFirestore();

  useHotkeys('e', () => { setHighlight(true) });
  useHotkeys('e', () => { setHighlight(false) }, { keydown: false, keyup: true });
  useHotkeys('p', () => { setPreview(true) });
  useHotkeys('p', () => { setPreview(false) }, { keydown: false, keyup: true });

  return userExists ? (
    <div style={style} className={`${className} RFCMS__Editable ${preview && 'RFCMS__Editable--Preview'}`}>
      <Delete open={shown} identity="this page" onClose={() => setShown(false)} onDelete={() => deleteDoc(doc(firestore, path))}/>
      <div className={`RFCMS__Editable__Trash ${highlight && 'RFCMS__Editable__Trash--Highlight'}  ${preview && 'RFCMS__Editable__Pencil--Preview'}`}>
        <FaTrash onClick={() => setShown(true)} className="RFCMS__Editable__Pencil__Text" />
      </div>
    </div>
  ) : (<>{children}</>)
}
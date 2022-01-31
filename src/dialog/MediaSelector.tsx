import React from 'react';
import { listAll, ref, StorageReference, getDownloadURL } from "firebase/storage";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useStorage } from "reactfire";
import { Dialog, Buttons } from "../component/Dialog"
import { useConfig } from '../hooks';

export interface MediaSelectorProps {
  onSelect: (url: string) => void;
}

interface FirebaseImageProps {
  image: StorageReference;
  selected?: boolean;
  onSelect: (url: string) => void;
}

const FirebaseImage: React.FC<FirebaseImageProps> = (props) => {
  const {image, selected, onSelect } = props;
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (!image) return;
    getDownloadURL(image)
      .then(setUrl)
      .catch(console.error)
  }, [image]);

  return (
    <div onClick={() => onSelect(url)} 
         className={`RFCMS__MediaSelector__Item ${selected && 'RFCMS__MediaSelector__Item--Selected'}`}>
      <img src={url} alt={image?.name} className="RFCMS__MediaSelector__Item__Image" />
      <span className="RFCMS__MediaSelector__Item__Text">{image?.name}</span>
    </div>
  );
}

const MediaSelector: React.FC<MediaSelectorProps> = ({onSelect}) => {
  const config = useConfig();
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([] as StorageReference[]);
  const [selection, setSelection] = useState(-1);
  const [url, setUrl] = useState('');

  const storage = useStorage();

  const showDialog = useCallback((e) => {
    e.preventDefault();
    setOpen(true);
  }, [setOpen])

  useEffect(() => {
    if (!open) return;
    listAll(ref(storage, config.firebase.storage.bucket))
      .then(r => {
        setItems(r.items);
      })
      .catch(e => setError(e));
  }, [storage, open])

  const buttons = useMemo<Buttons>(() => {
    return [
      { label: 'Cancel', action: () => setOpen(false) },
      { label: 'Upload', action: () => {} },
      { label: 'Select', action: () => {
        onSelect(url);
        setOpen(false);
      }, disabled: selection === -1 },
    ]
  }, [onSelect, selection, url]);

  return (
    <div>
      <button onClick={showDialog}>Select Image</button>
      { open &&
        <Dialog buttons={buttons} title="Media Gallery" open={open} onClose={() => setOpen(false)}>
          { error && <span className="RFCMS__TextStyles__Error">{error}</span> }
          <div className="RFCMS__MediaSelector__Grid">
            {
              items.map((item, index) => (              
                <FirebaseImage 
                  onSelect={(url) => {
                    setSelection(index);
                    setUrl(url);
                  }} 
                  selected={index === selection} 
                  image={item} />
              ))
            }
          </div>
        </Dialog>
      }
    </div>
  )
}

export default MediaSelector;
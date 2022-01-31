import React from 'react';
import { useCallback } from 'react';
import { Dialog, Buttons, DialogProps } from '../component/Dialog'

export interface LogoutProps extends DialogProps {
  identity: string;
  onDelete: () => Promise<void>;
}

export const Delete: React.FC<LogoutProps> = ({open, identity, onClose, onDelete}) => {
  const doDelete = useCallback(() => {
    onDelete().then(onClose);  
  }, [onDelete, onClose]);

  const buttons: Buttons = [
    { label: 'Cancel', action: () => onClose?.() }, 
    { label: 'Delete', action: doDelete, type: 'warning' }
  ];
  
  return (
    <Dialog 
      title={`Delete ${identity}`} 
      open={open} 
      onClose={onClose}
      buttons={buttons}>
      Do you wish to delete {identity}
    </Dialog>
  )
}

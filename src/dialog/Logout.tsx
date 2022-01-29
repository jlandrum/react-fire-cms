import React from 'react';
import { signOut, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { useCallback } from 'react';
import { useAuth } from 'reactfire'
import { Dialog, Buttons, DialogProps } from '../component/Dialog'

export interface LogoutProps extends DialogProps {}

export const Logout: React.FC<LogoutProps> = ({open, onClose}) => {
  const auth = useAuth();

  const doLogout = useCallback(() => {
    setPersistence(auth, browserSessionPersistence)
      .then(() => signOut(auth))
      .then(onClose);  
  }, [auth, onClose]);

  const buttons: Buttons = [
    { label: 'Cancel', action: () => onClose?.() }, 
    { label: 'Logout', action: doLogout, type: 'warning' }
  ];
  
  return (
    <Dialog 
      title="Login" 
      open={open} 
      onClose={onClose}
      buttons={buttons}>
      Are you sure you wish to logout?
    </Dialog>
  )
}

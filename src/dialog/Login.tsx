import React from 'react';
import { signInWithEmailAndPassword, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { useCallback, useState } from 'react';
import { useAuth } from 'reactfire'
import { Dialog, Buttons, DialogProps } from '../component/Dialog'

export interface LoginProps extends DialogProps {}

export const Login: React.FC<LoginProps> = ({open, onClose}) => {
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const doLogin = useCallback((e) => {
    e?.preventDefault();
    setPersistence(auth, browserSessionPersistence)
      .then(() => signInWithEmailAndPassword(auth, email, password)) 
      .then(onClose)
  }, [email, password, auth, onClose]);

  const buttons: Buttons = [
    {label: 'Login', action: doLogin}
  ]
  return (
    <Dialog title="Login" open={open} onClose={onClose} buttons={buttons}>
      <form onSubmit={doLogin}
            className="RFC__LoginDialog__Content">
        <label htmlFor="email">Email</label>
        <input value={email} onChange={v => setEmail(v.target.value)} type="email" id="email" />
        <label htmlFor="password">Password</label>
        <input value={password} onChange={v => setPassword(v.target.value)} type="password" id="password"/>
      </form>
    </Dialog>
  )
}

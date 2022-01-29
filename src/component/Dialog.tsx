import React from 'react';
import { IoCloseSharp } from 'react-icons/io5';

export type ButtonType = 'normal' | 'primary' | 'warning';
export type Buttons = { label: string, action: Function, type?: ButtonType, disabled?: boolean }[];

export interface DialogProps {
  title?: string;
  open?: boolean;
  onClose?: () => void;
  buttons?: Buttons
};

export const Dialog: React.FC<DialogProps> = ({title, open, children, buttons, onClose}) => {  
  return open ? (
    <>
      <div className='RFC__AntiClick' />
      <div className='RFC__Dialog'>
        <div className={'RFC__Dialog__Header'}>
          {title}
          { onClose && <IoCloseSharp onClick={onClose} className={'RFC__Dialog__Close'} />}
        </div>
        <div className={'RFC__Dialog__Content'}>
          {children}
        </div>
        {buttons && 
          <div className={'RFC__Dialog__Buttons'}>
            { buttons?.map(it => 
              <div key={it.label} 
                   className={`${'RFC__Dialog__Buttons__Button'} ${it.disabled && 'RFC__Dialog__Buttons__Button--disabled'} ${`RFC__Dialog__Buttons__Button--${it.type}`}`} 
                   onClick={() => {
                     if (!it.disabled) { it.action() }
                   }}>{it.label}</div>)}
          </div>
        }
      </div>
    </>
  ) : null;
}
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import './alert.css';
import { ReactNode } from 'react';

const AlertDialog = ({
  open,
  setOpen,
  children,
  description,
  onConfirm,
  confirmText,
}: {
  open?: boolean;
  setOpen?: (state: boolean) => void;
  children?: ReactNode;
  description?: string;
  onConfirm: () => void;
  confirmText?: string;
}) => (
  <AlertDialogPrimitive.Root open={open} onOpenChange={setOpen}>
    <AlertDialogPrimitive.Trigger asChild>
      {children}
    </AlertDialogPrimitive.Trigger>
    <AlertDialogPrimitive.Portal>
      <AlertDialogPrimitive.Overlay className='AlertDialogOverlay' />
      <AlertDialogPrimitive.Content className='AlertDialogContent'>
        <AlertDialogPrimitive.Title className='AlertDialogTitle'>
          Are you absolutely sure?
        </AlertDialogPrimitive.Title>
        <AlertDialogPrimitive.Description className='AlertDialogDescription'>
          {description || ' This action cannot be undone.'}
        </AlertDialogPrimitive.Description>
        <div style={{ display: 'flex', gap: 25, justifyContent: 'flex-end' }}>
          <AlertDialogPrimitive.Cancel asChild>
            <button className='Button mauve'>Cancel</button>
          </AlertDialogPrimitive.Cancel>
          <AlertDialogPrimitive.Action asChild>
            <button onClick={onConfirm} className='Button red'>
              {confirmText || 'Yes, delete'}
            </button>
          </AlertDialogPrimitive.Action>
        </div>
      </AlertDialogPrimitive.Content>
    </AlertDialogPrimitive.Portal>
  </AlertDialogPrimitive.Root>
);

export default AlertDialog;

import { forwardRef } from 'react';
import './index.css';
import { Root, Thumb } from '@radix-ui/react-switch';

interface Props {
  id: string;
  label: string;
  checked?: boolean;
  toggle?: (state: boolean) => void;
}

const Switch = forwardRef<HTMLButtonElement, Props>(
  ({ id, label: labelText, checked, toggle }, ref) => {
    return (
      <div className='form-switch'>
        <Root
          id={id}
          ref={ref}
          className='SwitchRoot'
          checked={checked}
          onCheckedChange={toggle}>
          <Thumb className='SwitchThumb' />
        </Root>

        <label htmlFor={id}>{labelText}</label>
      </div>
    );
  }
);

export default Switch;

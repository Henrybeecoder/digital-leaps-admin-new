import ChevronDownIcon from '../assets/icons/fi_chevron-down.svg';
import {
  Root,
  Trigger,
  Value,
  Icon,
  Portal,
  Content,
  Item,
  ItemText,
  Viewport,
} from '@radix-ui/react-select';
import './index.css';
import { CSSProperties, forwardRef } from 'react';

interface SelectProps {
  triggerClassName?: string;
  //   contentStyle?: CSSProperties;
  contentClassName?: string;
  defaultSelected?: string;
  onValueChange: (value: any) => void;
  options: { value: string; item: string }[];
  value?: string;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  required?: boolean;
  triggerStyle?: CSSProperties;
  error?: string;
}

const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      value,
      placeholder,
      options,
      disabled,
      defaultSelected,
      onValueChange,
      label: labelText,
      required,
      triggerClassName = '',
      triggerStyle,
      error,
    },
    ref
  ) => {
    return (
      <div ref={ref as any} className='form-select-container'>
        <label>
          {labelText}
          {required && <span>*</span>}
        </label>
        <Root
          required={required}
          disabled={disabled}
          value={value}
          defaultValue={defaultSelected}
          onValueChange={(e) => onValueChange(e as any)}>
          <Trigger
            className={`form-select ${
              error ? 'form-select-error' : ''
            } ${triggerClassName}`}
            style={triggerStyle}>
            <Value placeholder={placeholder} className='form-select-value' />
            <Icon className=''>
              <img alt='chevron-down' src={ChevronDownIcon} />
            </Icon>
          </Trigger>
          <Portal>
            <Content className='form-select-content'>
              <Viewport>
                {options.map(({ item, value }) => (
                  <Item key={value} value={value} className='form-select-item'>
                    <ItemText>{item}</ItemText>
                  </Item>
                ))}
              </Viewport>
            </Content>
          </Portal>
        </Root>

        {error && <span className='form-error-text'>{error}</span>}
      </div>
    );
  }
);

export default Select;

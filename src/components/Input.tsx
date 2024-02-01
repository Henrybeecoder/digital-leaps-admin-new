import {
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
  forwardRef,
} from 'react';
import './index.css';

export interface InputTempProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  touched?: boolean;
  error?: string | string[];
  hColor?: 'light' | 'dark';
  icon?: 'left' | 'right';
}

export interface TextareaTempProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  touched?: boolean;
  error?: string | string[];
  // hColor?: 'light' | 'dark';
  resize?: boolean;
  rows?: number;
}

export const InputTemp = forwardRef<HTMLInputElement, InputTempProps>(
  (props, ref) => {
    //TODO switch ibg to inputprops
    const {
      label: labelText,
      touched,
      required,
      error,
      className,
      children,
      style,
      icon = 'left',
      ...rest
    } = props;

    return (
      <div className={`w-100 form-input-container ${className || ''}`}>
        <div className='form-input-text'>
          <label>
            {labelText}
            {required && <span>*</span>}
          </label>
          {error && <p>{error?.toString()}</p>}
        </div>
        <div className='form-input'>
          {children && (
            <aside
              className={`${
                icon === 'left'
                  ? 'form-input-icon-left'
                  : 'form-input-icon-right'
              }`}>
              {children}
            </aside>
          )}
          <input
            ref={ref}
            className={`${
              children && icon === 'left'
                ? 'form-input-children-p'
                : children && icon === 'right'
                ? 'form-input-children-p-right'
                : ''
            } ${error ? 'error' : ''}`}
            style={{
              ...style,
              paddingLeft: children && icon === 'left' ? '45px' : undefined,
              paddingRight: children && icon === 'right' ? '45px' : undefined,
            }}
            {...rest}
          />
        </div>
      </div>
    );
  }
);

InputTemp.displayName = 'InputTemp';

export const TextareaTemp = forwardRef<HTMLTextAreaElement, TextareaTempProps>(
  (props, ref) => {
    //TODO switch ibg to inputprops
    const {
      label: labelText,
      touched,
      error,
      resize,
      className,
      required,
      rows = 4,
      ...rest
    } = props;

    return (
      <div className={`w-100 ${className || ''}`}>
        <div
          className='form-input-text'
          style={{ height: labelText ? undefined : 'auto' }}>
          {labelText && (
            <label>
              {labelText}
              {required && <span>*</span>}
            </label>
          )}
          {error && <p>{error?.toString()}</p>}
        </div>
        <div className='form-input'>
          <textarea
            ref={ref}
            {...rest}
            rows={rows}
            style={{ borderColor: error ? 'red' : '#abafb1' }}
          />
        </div>
      </div>
    );
  }
);

TextareaTemp.displayName = 'TextareaTemp';

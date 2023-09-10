import {
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
  forwardRef,
} from 'react';

export interface InputTempProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  touched?: boolean;
  error?: string | string[];
  hColor?: 'light' | 'dark';
}

export interface TextareaTempProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  touched?: boolean;
  error?: string | string[];
  hColor?: 'light' | 'dark';
  resize?: boolean;
  rows?: number;
}

export const InputTemp = forwardRef<HTMLInputElement, InputTempProps>(
  (props, ref) => {
    //TODO switch ibg to inputprops
    const {
      label,
      touched,
      hColor = 'dark',
      required,
      error,
      className,
      children,
      ...rest
    } = props;

    return (
      <div className={`w-full ${className || ''}`}>
        <div className='flex justify-between w-full h-5 mb-2 mt-1'>
          <h1
            className={`${
              hColor === 'light' ? 'text-neutral-200 ' : 'text-neutral-700'
            } ml-1 flex gap-2`}>
            {label}
            {required && <span className='text-red-500'>*</span>}
          </h1>
          {touched && error && (
            <p className='text-xs text-red-500 pr-4'>{error?.toString()}</p>
          )}
        </div>
        <div className='relative'>
          <input
            ref={ref}
            className={`bg-transparent w-full py-1 rounded-lg text-base ${
              children ? 'pl-3 pr-12' : 'px-3'
            }
          text-start placeholder:text-opacity-60 text-md outline-none border border-neutral-300 disabled:bg-neutral-100`}
            {...rest}
          />
          <div className='absolute center-y right-2 flex justify-center'>
            {children}
          </div>
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
      label,
      touched,
      hColor = 'light',
      error,
      resize,
      className,
      required,
      ...rest
    } = props;

    return (
      <div className={`w-full ${className || ''}`}>
        <div className='flex justify-between w-full h-5 mb-2'>
          <h1
            className={`${
              hColor === 'light' ? 'text-neutral-600 ' : 'text-gray-700'
            } flex gap-2 `}>
            {label}
            {required && <span className='text-red-500'>*</span>}
          </h1>
          {touched && error && (
            <span className='text-xs text-red-500 pr-4'>
              {error?.toString()}
            </span>
          )}
        </div>
        <textarea
          ref={ref}
          className={`border border-neutral-200 disabled:bg-neutral-100 w-full ${
            !resize && 'resize-none'
          } rounded-lg text-base placeholder:text-opacity-60 py-1 px-3 outline-none `}
          {...rest}
        />
      </div>
    );
  }
);

TextareaTemp.displayName = 'TextareaTemp';

import { forwardRef, useState } from 'react';

interface SCDProps {
  onValueChange: (value: any) => void;
  value?: string;
  label?: string;
  error?: string;
}

export const SelectCourseDays = forwardRef<any, SCDProps>(
  ({ label: labelText, error, value, onValueChange }, ref) => {
    const options = ['Mon', 'Tues', 'Wed', 'Thur', 'Fri'];

    const list = value?.split('-') || [];

    return (
      <div ref={ref as any} className='form-select-container'>
        <label>
          {labelText}
          {<span>*</span>}
        </label>
        <div
          className={`form-select-days ${error ? 'form-select-error' : ''}`}
          style={{ border: error ? '1px solid red' : '' }}>
          {options.map((option) => (
            <div className='' key={option}>
              <input
                type='checkbox'
                checked={list.includes(option)}
                onChange={(e) => {
                  onValueChange(
                    options
                      .map((x) => {
                        if (option === x) {
                          return e.target.checked ? x : null;
                        } else {
                          return !!list.some((value) => value === x) ? x : null;
                        }
                      })
                      .filter((x) => !!x)
                      .join('-')
                  );
                }}
              />
              <p>{option}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

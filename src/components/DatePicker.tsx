import { forwardRef } from 'react';
import DatePickerPrimitive from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// import TimePickerPrimitive from 'react-time-picker';

interface Props {
  label: string;
  value: any;
  onChange: any;
  required?: boolean;
  error?: string;
}

export const DatePicker = forwardRef<any, Props>(
  ({ value, onChange, label: labelText, required, error }, ref) => {
    return (
      <div style={{ width: '100%' }}>
        <div className='form-datepicker'>
          <div className='flex-between'>
            <label>
              {labelText}
              {required && <span>*</span>}
            </label>
            {error && <p>{error?.toString()}</p>}
          </div>

          <DatePickerPrimitive
            ref={ref}
            placeholderText='Select Date'
            customInput={((props) => (
              <CustomInput {...(props as any)} error={error} />
            ))()}
            selected={value}
            onChange={onChange}
            dateFormat='P'
            className=''
            autoFocus={false}
          />
        </div>
      </div>
    );
  }
);

export const TimePicker = forwardRef<any, Props>(
  ({ value, onChange, label: labelText, required, error }, ref) => {
    return (
      <div style={{ width: '100%' }}>
        <div className='form-datepicker'>
          <div className='flex-between'>
            <label>
              {labelText}
              {required && <span>*</span>}
            </label>
            {error && <p>{error?.toString()}</p>}
          </div>
          {/* <TimePickerPrimitive onChange={onChange} value={value} /> */}
          <DatePickerPrimitive
            // ref={ref}
            placeholderText='Select Time'
            customInput={((props) => (
              <CustomTimeInput {...(props as any)} error={error} />
            ))()}
            selected={value}
            showTimeSelect
            showTimeSelectOnly
            onChange={onChange}
            timeIntervals={15}
            timeCaption='Time'
            dateFormat='h:mm aa'
          />
        </div>
      </div>
    );
  }
);

const CustomInput = forwardRef<HTMLInputElement>((props: any, ref) => {
  const { value, placeholder, onChange, error, ...rest } = props;

  return (
    <div
      {...rest}
      className='form-datepicker-input-group'
      style={{ borderColor: error ? 'red' : '#abafb1' }}>
      <span>
        <svg
          width='18'
          height='18'
          viewBox='0 0 20 22'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'>
          <g id='Calendar'>
            <path
              id='Line_200'
              d='M1.09253 8.57145H18.9165'
              stroke='#5E6366'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              id='Line_201'
              d='M14.442 12.4767H14.4512'
              stroke='#5E6366'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              id='Line_202'
              d='M10.0047 12.4767H10.014'
              stroke='#5E6366'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              id='Line_203'
              d='M5.55793 12.4767H5.5672'
              stroke='#5E6366'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              id='Line_204'
              d='M14.442 16.3634H14.4512'
              stroke='#5E6366'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              id='Line_205'
              d='M10.0047 16.3634H10.014'
              stroke='#5E6366'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              id='Line_206'
              d='M5.55793 16.3634H5.5672'
              stroke='#5E6366'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              id='Line_207'
              d='M14.0438 1.16699V4.45777'
              stroke='#5E6366'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              id='Line_208'
              d='M5.9654 1.16699V4.45777'
              stroke='#5E6366'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              id='Path'
              fillRule='evenodd'
              clipRule='evenodd'
              d='M14.2383 2.74609H5.77096C2.83427 2.74609 1 4.38203 1 7.38912V16.4388C1 19.4931 2.83427 21.1669 5.77096 21.1669H14.229C17.175 21.1669 19 19.5215 19 16.5144V7.38912C19.0092 4.38203 17.1842 2.74609 14.2383 2.74609Z'
              stroke='#5E6366'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </g>
        </svg>
      </span>
      <input
        ref={ref}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
});

const CustomTimeInput = forwardRef<HTMLInputElement>((props: any, ref) => {
  const { value, placeholder, onChange, error, ...rest } = props;

  return (
    <div
      {...rest}
      className='form-datepicker-input-group'
      style={{ borderColor: error ? 'red' : '#abafb1' }}>
      <span>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='20'
          height='20'
          viewBox='0 0 24 25'
          fill='none'>
          <g clipPath='url(#clip0_512_4059)'>
            <path
              d='M12.0001 0.166992C5.38337 0.166992 0.000488281 5.55016 0.000488281 12.1668C0.000488281 18.7838 5.38337 24.167 12.0001 24.167C18.6168 24.167 23.9999 18.7838 23.9999 12.1668C23.9999 5.55016 18.6165 0.166992 12.0001 0.166992ZM12.0001 22.4321C6.34018 22.4321 1.73512 17.827 1.73512 12.1668C1.73512 6.50667 6.33989 1.90191 12.0001 1.90191C17.6602 1.90191 22.265 6.50667 22.265 12.1668C22.265 17.827 17.6602 22.4321 12.0001 22.4321Z'
              fill='#5E6366'
            />
            <path
              d='M15.4722 13.2707C15.4676 13.2707 15.4635 13.2707 15.4589 13.2707L12.8675 13.3094V6.52762C12.8675 6.04849 12.4792 5.66016 12 5.66016C11.5209 5.66016 11.1326 6.04849 11.1326 6.52762V14.1902C11.1326 14.1919 11.1331 14.1936 11.1331 14.1954C11.1331 14.1983 11.1326 14.2009 11.1326 14.2032C11.1331 14.2385 11.1398 14.2717 11.1444 14.3055C11.1473 14.3267 11.1476 14.3483 11.1517 14.3692C11.1595 14.4065 11.1725 14.4412 11.1849 14.4761C11.1913 14.4944 11.1953 14.5134 11.2028 14.5308C11.2179 14.5664 11.2381 14.5988 11.2575 14.632C11.2664 14.6467 11.2731 14.6629 11.2826 14.6774C11.3046 14.7095 11.3309 14.7381 11.357 14.7673C11.3679 14.7795 11.3769 14.7933 11.3885 14.8052C11.4165 14.833 11.448 14.8564 11.4796 14.8804C11.4923 14.8899 11.5036 14.9015 11.5166 14.9105C11.5507 14.9336 11.588 14.9518 11.6253 14.9697C11.6383 14.9758 11.6499 14.9845 11.6632 14.99C11.7065 15.0082 11.7528 15.0209 11.7996 15.0322C11.8083 15.0342 11.8164 15.0383 11.8254 15.04C11.8815 15.0513 11.9396 15.0576 11.9992 15.0576C12.0035 15.0576 12.0081 15.0576 12.0125 15.0576L15.4846 15.0056C15.9635 14.9984 16.346 14.604 16.3391 14.1251C16.3324 13.6506 15.9452 13.2707 15.4722 13.2707Z'
              fill='#5E6366'
            />
          </g>
          <defs>
            <clipPath id='clip0_512_4059'>
              <rect
                width='24'
                height='24'
                fill='white'
                transform='translate(0 0.166992)'
              />
            </clipPath>
          </defs>
        </svg>
      </span>
      <input
        ref={ref}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
});

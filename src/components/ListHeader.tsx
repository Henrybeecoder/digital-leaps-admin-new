import { ReactNode, useState } from 'react';

interface Props {
  heading: string;
  subHeading: string;
  button?: {
    name: string;
    onClick: () => void;
  };
  button2?: {
    name: string;
    onClick: () => void;
  };
  input: {
    placeholder: string;
    onSearch: (search: string) => void;
  };
  children?: ReactNode;
}

const ListHeader = ({
  button,
  button2,
  heading,
  subHeading,
  input,
  children,
}: Props) => {
  return (
    <>
      <PageHeader
        heading={heading}
        button={button}
        subHeading={subHeading}
        button2={button2}>
        {children}
      </PageHeader>

      <div className='reg-students-search-container'>
        <div>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='16'
            height='16'
            viewBox='0 0 16 16'
            fill='none'>
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M6.66667 2C4.08934 2 2 4.08934 2 6.66667C2 9.244 4.08934 11.3333 6.66667 11.3333C7.71489 11.3333 8.68239 10.9877 9.46145 10.4043L12.1953 13.1381C12.4557 13.3985 12.8778 13.3985 13.1381 13.1381C13.3985 12.8778 13.3985 12.4557 13.1381 12.1953L10.4043 9.46145C10.9877 8.68239 11.3333 7.71489 11.3333 6.66667C11.3333 4.08934 9.244 2 6.66667 2ZM3.33333 6.66667C3.33333 4.82572 4.82572 3.33333 6.66667 3.33333C8.50762 3.33333 10 4.82572 10 6.66667C10 8.50762 8.50762 10 6.66667 10C4.82572 10 3.33333 8.50762 3.33333 6.66667Z'
              fill='#64748B'
            />
          </svg>
          <input
            placeholder={input.placeholder}
            onChange={(e) => {
              if (e.target.value === '') {
                input.onSearch(e.target.value);
              }
            }}
            onKeyDown={(e: any) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (!e.target.value) return;
                input.onSearch(e.target.value);
                // e.target.value = '';
              }
            }}
          />
        </div>
      </div>
    </>
  );
};

export const PageHeader = ({
  heading,
  button,
  button2,
  subHeading,
  children,
}: Pick<Props, 'heading' | 'button' | 'children' | 'button2'> & {
  subHeading?: string;
}) => {
  return (
    <div className='header'>
      <div className='reg-students-header'>
        <h3>{heading}</h3>
        {subHeading && <p>{subHeading}</p>}
        {children}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        {button && (
          <button className='btn-main' onClick={button.onClick}>
            {button?.name}
          </button>
        )}
        {button2 && (
          <button className='btn-main' onClick={button2.onClick}>
            {button2?.name}
          </button>
        )}
      </div>
    </div>
  );
};

export default ListHeader;

import { FallingLines } from 'react-loader-spinner';

export const Loading = ({
  position = 'absolute',
}: {
  position?: 'fixed' | 'absolute';
}) => {
  return (
    <div
      className={`flex justify-center items-center ${
        position === 'fixed' ? 'fixed w-screen' : 'absolute w-full'
      } inset-0 bg-white z-50  h-screen`}>
      <FallingLines width={'70'} color='#24559c' />
    </div>
  );
};

export const LoadingBlur = ({
  position = 'fixed',
}: {
  position?: 'fixed' | 'absolute';
}) => {
  return (
    <div
      className={`loading-blur flex justify-center items-center fixed inset-0 bg-white/30
     backdrop-blur-[2px] ${position} ${
        position === 'absolute' ? 'inset-[2px]' : ''
      }`}>
      <FallingLines width={'70'} color={'#24559c'} />
    </div>
  );
};

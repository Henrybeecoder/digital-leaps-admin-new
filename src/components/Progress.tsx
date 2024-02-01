import './index.css';
import { Root, Indicator } from '@radix-ui/react-progress';

const Progress = ({ progress }: { progress: number }) => {
  return (
    <Root className='ProgressRoot' value={progress}>
      <Indicator
        className='ProgressIndicator'
        style={{ transform: `translateX(-${100 - progress}%)` }}
      />
    </Root>
  );
};

export default Progress;

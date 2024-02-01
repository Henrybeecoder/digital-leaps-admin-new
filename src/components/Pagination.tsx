import './index.css';

const list = Array.from(Array(6).keys());

interface Props {
  prev: () => void;
  next: () => void;
  prevDisabled: boolean;
  nextDisabled: boolean;
}

const Pagination = ({ next, nextDisabled, prev, prevDisabled }: Props) => {
  return (
    <div className='w-100 container-oveflow'>
      <div className='pagination-container'>
        <button disabled={prevDisabled} onClick={prev} className='prev'>
          Previous
        </button>
        {/* <button disabled className='active w-[43px] h-full font-medium'>
          1
        </button>
        {list.map((x) => (
          <button disabled key={x} className=''>
            {x + 2}
          </button>
        ))} */}
        <button disabled={nextDisabled} onClick={next} className='next'>
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;

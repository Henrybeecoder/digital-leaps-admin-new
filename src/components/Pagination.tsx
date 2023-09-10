const list = Array.from(Array(6).keys());

const Pagination = () => {
  return (
    <div className='w-full overflow-x-auto'>
      <div className='flex gap-2 w-fit mx-auto mt-14 mb-10 h-[43px]'>
        <button className='border border-[#ececec] rounded-[5px] text-[#667085] h-full px-3 text-[15px] shadow-sm'>
          Previews
        </button>
        <button className='border rounded-[5px] bg-mainblue w-[43px] h-full font-medium'>
          1
        </button>
        {list.map((x) => (
          <button
            key={x}
            className='border border-[#ececec] rounded-[5px] w-[43px] h-full text-[#667085] font-medium'>
            {x + 2}
          </button>
        ))}

        <button className='border border-[#ececec] rounded-[5px] text-[#667085] h-full px-3 text-[15px] shadow-sm'>
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;

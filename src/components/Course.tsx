import courseImg from '../assets/course-placeholder.png';
import user from '../assets/user.png';
import { CourseType } from '../../t';
import { firstUpperCase, formatDate } from '../../utils/helper';

const Course = ({ data }: { data?: CourseType }) => {
  return (
    <article className='flex flex-col text-xs bg-white p-3 shadow-xl'>
      <img
        src={courseImg}
        alt=''
        width=''
        height=''
        className='rounded-lg w-full object-cover'
      />
      <div className='flex flex-col gap-2 mt-1.5 h-full'>
        <div className='text-xs flex justify-between items-center'>
          <p className='text-[#777]'>{data?.category}</p>
          <span className='bg-mainblue text-[10px] text-white  rounded py-[0.15rem] px-1'>
            {firstUpperCase(data?.expertise)}
          </span>
        </div>
        <h4 className='text-sm font-bold text-mainblue'>{data?.title}</h4>
        <p className='text-[#777] flex-1'>{data?.about}</p>
        <div className='justify-between flex'>
          <span className='flex gap-3 items-center justify-center text-boldblue'>
            <img src={user} alt='' className='inline-block' />
            <p>{data?.author.name}</p>
          </span>
          <p className='text-boldblue font-bold'>${data?.price}</p>
        </div>
        <span className='text-gray flex gap-3 items-center'>
          <p>{data?.duration}</p>
          {data?.createdAt && <p>{formatDate(data.createdAt.toDate())}</p>}
        </span>
        <a
          href='#'
          className='rounded-lg bg-mainblue text-white p-2 text-center'>
          View details
        </a>
      </div>
    </article>
  );
};

export default Course;

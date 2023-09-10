import { Timestamp, addDoc, collection } from 'firebase/firestore';
import Illustration from '../assets/header-illustration.svg';
import Course from '../components/Course';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { db } from '../../utils/fire';
import { Loading } from '../components/Loading';
import { CourseType } from '../../t';
import { CourseSvg, StudentSvg } from '../components/Svg';
import Pagination from '../components/Pagination';

const Dashboard = () => {
  const [courses, loading] = useCollectionData(collection(db, 'courses'));

  if (loading) return <Loading />;

  return (
    <>
      <button
        hidden
        onClick={async () => {
          await addDoc(collection(db, 'courses'), {
            category: 'UI/UX Design',
            title: 'UI/UX Design for Beginners',
            author: {
              name: 'Eid Hamouda',
              photourl: '',
            },
            duration: '12 Weeks',
            about:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et ',
            createdAt: Timestamp.now(),
            expertise: 'intermediate',
            price: 98,
          } as CourseType);
        }}
        className='bg-red-500'>
        Add
      </button>
      {/* header goes here */}
      <section className='flex gap-5 md:gap-10 md:flex-row flex-col'>
        <article className='flex items-center w-full md:w-[70%] gap-5 bg-lightblue py-7 px-6 rounded-lg'>
          <div className='flex flex-col w-[40%] md:w-fit gap-5'>
            <h2 className='text-lg md:text-xl font-bold max-w-[170px] text-boldblue font-century_gothic'>
              Good Evening, Eid
            </h2>
            <p className='text-gray max-w-xs text-sm'>
              Here's an overview about what has been happening at your website
            </p>
            <span className='text-xs flex flex-col md:flex-row gap-4'>
              <a
                href=''
                className='px-3 whitespace-nowrap py-2 text-center rounded-md bg-boldblue text-white'>
                New Course
              </a>
              <a
                href=''
                className='text-boldblue whitespace-nowrap  text-center px-4 py-2 rounded-md border '>
                New Mentor
              </a>
            </span>
          </div>
          <figure>
            <img
              src={Illustration}
              alt=''
              height=''
              width=''
              className='w-44 md:w-60 object-cover'
            />
          </figure>
        </article>
        <div className='flex md:flex-col flex-grow text-gray gap-3'>
          <article className='bg-lightblue rounded-lg flex-grow py-4 px-7 flex flex-col gap-3'>
            <h3 className='text-lg text-boldblue font-century_gothic'>
              Total Course
            </h3>
            <p className='flex items-center gap-1 font-semibold text-xl md:text-2xl'>
              <span>
                <CourseSvg className='stroke-boldblue fill-boldblue w-[20px]' />
              </span>{' '}
              153
            </p>
          </article>
          <article className='bg-lightblue rounded-lg flex-grow py-4 px-7 flex flex-col gap-3'>
            <h3 className='text-lg text-boldblue font-century_gothic'>
              Total Students
            </h3>
            <p className='flex items-center gap-1 font-semibold text-xl md:text-2xl'>
              <span>
                <StudentSvg className='stroke-boldblue fill-boldblue w-[20px]' />
              </span>{' '}
              153
            </p>
          </article>
        </div>
      </section>
      <section className='mt-7'>
        <div className='flex justify-between items-center'>
          <h2 className='font-bold text-boldblue text-lg'>Upcoming Course</h2>
          <p className='text-[#1393C9] text-sm'>View all</p>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-14'>
          {courses?.map((course) => (
            <Course key={course.createdAt} data={course as any} />
          ))}
        </div>
        <Pagination />
      </section>
    </>
  );
};

export default Dashboard;

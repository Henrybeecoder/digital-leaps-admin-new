//@ts-ignore
//@ts-nocheck

import Illustration from '../assets/header-illustration.svg';
import Course from './courses/Course';
// import { db } from '../../utils/fire';
import { LoadingBlur } from '../components/Loading';
// import { CourseType } from '../../t';
import { CourseSvg, StudentSvg } from '../components/Svg';
import Pagination from '../components/Pagination';
import { useGetCollection } from '../utils/hooks/useData';
import { Link } from 'react-router-dom';
import '../styles/home.css';
import { useEffect, useState } from 'react';
import { collection, limit, onSnapshot, query } from 'firebase/firestore';
import { db } from '../utils/fire';
import { useGetCourses } from '../utils/hooks/useGetCourses';
import { useStore } from '../store';
import { limitText } from '../utils/helper';
import useMediaQuery from '../utils/hooks/useMediaquery';


const Dashboard = () => {
  const { courses, loading, next, nextDisabled, prev, prevDisabled } =
    useGetCourses({ max: 4 });

  const { data: students, loading: sLoading } = useGetCollection('users');
  const { user } = useStore((s) => s.auth);
  console.log(user, "my user")
  const matches = useMediaQuery('(min-width: 800px)');

  return (
    <>
      {(loading || sLoading) && <LoadingBlur />}
      {/* header goes here */}
      <section className='dashboard-main-container'>
        <article className='dashboard-main-article'>
          <div className=''>
            <h2 className=''>Goodx Day,  {matches
                ? limitText(user?.displayName || user?.email.split('@')[0])
                : limitText(user?.displayName || user?.email.split('@')[0], 15)}</h2>
            <p className='max-w-xs text-sm text-gray'>
              Here's an overview about what has been happening at your website
            </p>
            <span className='flex flex-col gap-4 text-xs md:flex-row'>
              <Link to={'/courses/new-course'} className='link1'>
                New Course
              </Link>
              <Link to={'/mentors/new'} className='link2'>
                New Mentor
              </Link>
            </span>
          </div>
          <figure>
            <img src={Illustration} alt='' height='' width='' className='' />
          </figure>
        </article>

        <div className='dashboard-metrics'>
          <article className=''>
            <h3>Total Course</h3>
            <p>
              <span>
                <CourseSvg className='dashboard-metric-svg' />
              </span>{' '}
              {courses?.length || 0}
            </p>
          </article>
          <article className=''>
            <h3>Total Students</h3>
            <p>
              <span>
                <StudentSvg className='dashboard-metric-svg' />
              </span>{' '}
              {students?.length || 0}
            </p>
          </article>
        </div>
      </section>
      <section className='dashboard-course-section'>
        <div className='dashboard-course-section-header'>
          <h2 className='text-lg font-bold text-boldblue'>All Courses</h2>
          <Link to={'/courses'} className='text-[#1393C9] text-sm'>
            View all
          </Link>
        </div>
        <div className='list-grid'>
          {courses?.map((course) => (
            <Course
              key={course.createdAt}
              data={course as any}
              category={{} as any}
            />
          ))}
        </div>
        <Pagination
          prev={prev}
          next={next}
          prevDisabled={prevDisabled}
          nextDisabled={nextDisabled}
        />
      </section>
    </>
  );
};

export default Dashboard;

import { useState } from 'react';
import { useParams } from 'react-router-dom';
import CourseDetailsSection from './CourseDetailsSection';
import CoursseRegistered from './CoursseRegistered';
import { Loading } from '../../../components/Loading';
import { useGetDocument } from '../../../utils/hooks/useData';

const CourseDetails = () => {
  const courseId = useParams()?.courseId;

  const [page, setPage] = useState('details');

  const { data: course, loading } = useGetDocument('courses', courseId);

  if (loading) return <Loading />;

  if (!courseId) return <>Something went wrong</>;

  return (
    <>
      {page === 'details' ? (
        <CourseDetailsSection setPage={setPage} course={course as any} />
      ) : page === 'r-students' ? (
        <CoursseRegistered setPage={setPage} course={course as any} />
      ) : null}
    </>
  );
};

export default CourseDetails;

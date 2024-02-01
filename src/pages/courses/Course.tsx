import courseImg from '../../assets/course-placeholder.png';
import user from '../../assets/user.png';
import { CourseType, categoryType } from '../../../types';
import { firstUpperCase, formatDate, limitText } from '../../utils/helper';
import { useNavigate } from 'react-router-dom';

const Course = ({
  data,
  category,
}: {
  data?: CourseType;
  category: categoryType;
}) => {
  const navigate = useNavigate();

  return (
    <article className='course-container' style={{ cursor: 'default' }}>
      <img
        src={data?.imageLink || courseImg}
        alt=''
        width=''
        height={250}
        className='course-img'
      />
      <div className='course-text-section'>
        <div className='flex-between course-expertise'>
          <p>{category?.name}</p>
          <span>{firstUpperCase(data?.level)}</span>
        </div>
        <h4 className='text-blue-heading-1'>{data?.title}</h4>
        <p className='text-descr'>{limitText(data?.about, 180)}</p>
        <div className='course-author'>
          <span>
            {data?.instructor && data?.instructor?.imageLink?.length > 0 ? (
              <img
                src={data?.instructor?.imageLink}
                alt='instructor-image'
                style={{
                  width: '25px',
                  height: '25px',
                  borderRadius: '50%',
                }}
              />
            ) : (
              <img src={user} alt='instructor-image' />
            )}

            <p>{data?.instructor?.name}</p>
          </span>
          <h5 className=''>${data?.price}</h5>
        </div>
        <span className='course-date'>
          {/* <p>{data?.duration}</p> */}
          {data?.createdAt && <p>{formatDate(data.createdAt.toDate())}</p>}
        </span>
        <button
          onClick={() => navigate(`/courses/course-details/${data?.id}`)}
          className='btn-view-course'>
          View details
        </button>
      </div>
    </article>
  );
};

export default Course;

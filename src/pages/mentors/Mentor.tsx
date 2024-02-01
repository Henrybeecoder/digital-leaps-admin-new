import { useNavigate, useParams } from 'react-router-dom';
import { Loading, LoadingBlur } from '../../components/Loading';
import {
  useGetMentor,
  useGetMentorCourses,
} from '../../utils/hooks/useGetMentors';
import ListHeader, { PageHeader } from '../../components/ListHeader';
import emptyStateImg from '../../assets/Frame.svg';
import calenderIcon from '../../assets/icons/uiw_date.svg';
import cashIcon from '../../assets/icons/ph_money-light.svg';
import { formatDate, limitText } from '../../utils/helper';
import useMediaQuery from '../../utils/hooks/useMediaquery';
import mailIcon from '../../assets/icons/mdi_email-outline.svg';
import phoneIcon from '../../assets/icons/ph_phone.svg';
import fieldIcon from '../../assets/icons/mdi_brain-freeze-outline.svg';
import degreeIcon from '../../assets/icons/cil_education.svg';
import countryIcon from '../../assets/icons/gis_search-country.svg';
import profIcon from '../../assets/icons/Frame.svg';
import scheduleIcon from '../../assets/icons/streamline_interface-calendar-blank-calendar-date-day-month.svg';
import resumeIcon from '../../assets/icons/pepicons-pop_cv.svg';
import linkedInIcon from '../../assets/icons/ant-design_linkedin-outlined.svg';
import websiteIcon from '../../assets/icons/mdi_web.svg';
import facebookIcon from '../../assets/icons/cil_education.svg';
import editIcon from '../../assets/icons/material-symbols_edit.svg';
import AlertDialog from '../../components/AlertDialog';
import Pagination from '../../components/Pagination';
import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../utils/fire';
import toast from 'react-hot-toast';

const Mentor = () => {
  const matches = useMediaQuery('(min-width: 800px)');
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id;

  const [mentor, loading] = useGetMentor(id);
  const {
    courses,
    loading: loadingCourses,
    onSearch,
  } = useGetMentorCourses(id);

  const [mutating, setLoading] = useState(false);
  const deactivate = async () => {
    try {
      setLoading(true);
      await updateDoc(doc(db, 'mentors', mentor.id), {
        status: mentor.status === 'Active' ? 'Inactive' : 'Active',
      });
      navigate(-1);
    } catch (err) {
      toast.error('something went wrong');
    }
    setLoading(false);
  };

  if (loading) return <Loading />;

  return (
    <>
      {(loadingCourses || mutating) && <LoadingBlur />}
      <div>
        <div className='header'>
          <div className='reg-students-header'>
            <div>
              <h3>{mentor?.name}</h3>
              <button onClick={() => navigate(`/mentors/${mentor.id}/edit`)}>
                <img alt='edit-icon' src={editIcon} />
              </button>
            </div>
          </div>
          <AlertDialog
            onConfirm={deactivate}
            confirmText='Confirm'
            description={`This mentor will become ${
              mentor?.status === 'Inactive' ? 'Active' : 'Inactive'
            }`}>
            <button className='btn-main'>
              {mentor?.status === 'Inactive' ? 'Activate' : 'Deactivate'}
            </button>
          </AlertDialog>
        </div>

        <section className='mentor-details'>
          <p>
            <span>
              <img alt='mail-icon' src={mailIcon} />
            </span>
            {mentor?.email}
          </p>
          <p>
            <span>
              <img alt='phone-icon' src={phoneIcon} />
            </span>
            {mentor?.phoneNumber}
          </p>
          <p>
            <span>
              <img alt='field-icon' src={fieldIcon} />
            </span>
            {mentor?.field}
          </p>
          <p>
            <span>
              <img alt='degree-icon' src={degreeIcon} />
            </span>
            {mentor?.degree || 'Masters Degree'}
          </p>
          <p>
            <span>
              <img alt='country-icon' src={countryIcon} />
            </span>
            {mentor?.country}
          </p>
          <p>
            <span>
              <img alt='prof-icon' src={profIcon} />
            </span>
            {mentor?.proficiency}
          </p>
          <p>
            <span>
              <img alt='schedule-icon' src={scheduleIcon} />
            </span>
            {mentor?.schedule}
          </p>
          <a
            href={mentor?.resume?.link}
            target='_blank'
            rel='noopener noreferrer'>
            <span>
              <img alt='resume-icon' src={resumeIcon} />
            </span>
            Resume
          </a>
          <a
            href={mentor?.linkedInUrl}
            target='_blank'
            rel='noopener noreferrer'>
            <span>
              <img alt='linkedin-icon' src={linkedInIcon} />
            </span>
            LinkedIn profile
          </a>

          <a
            href={mentor?.facebookUrl}
            target='_blank'
            rel='noopener noreferrer'>
            <span>
              <img alt='facebook-icon' src={facebookIcon} />
            </span>
            Facebook Link
          </a>
          <a
            href={mentor?.youtubeUrl}
            target='_blank'
            rel='noopener noreferrer'>
            <span>
              <img alt='facebook-icon' src={facebookIcon} />
            </span>
            Youtube Link
          </a>
          <a
            href={mentor?.website_portfolio}
            target='_blank'
            rel='noopener noreferrer'>
            <span>
              <img alt='web-icon' src={websiteIcon} />
            </span>
            Website/Portfolio
          </a>
        </section>
      </div>

      <ListHeader
        heading='Courses'
        subHeading=''
        input={{ placeholder: 'Search by ID, Title', onSearch }}
      />

      {courses.length < 1 ? (
        <div className='empty-screen'>
          <img alt='empty-category' src={emptyStateImg} />
          <p>There are no courses from this mentors</p>
        </div>
      ) : (
        <>
          {!matches ? (
            <div className='gap-5 list-grid'>
              {courses.map((course) => (
                <div key={mentor.id} className='sm-reg-details'>
                  <div>
                    {/* <input type='checkbox' /> */}
                    <h3></h3>
                    <div>
                      {/* <h5
                        className={`${
                          mentor.status === 'Active'
                            ? 'reg-status-paid'
                            : 'reg-status-unpaid'
                        }`}>
                        {mentor.status}
                      </h5> */}
                    </div>
                  </div>
                  <div>
                    {/* <img className='mentor-icon' src={mentorIcon} /> */}
                    <h3>{course.title}</h3>
                  </div>
                  <div>
                    <img className='mentor-icon' src={calenderIcon} />
                    {/* <h3>{formatDate(course.?.toDate())}</h3> */}
                  </div>
                  <div className='table-buttons-container'>
                    <div className='flex-between'>
                      <div style={{ justifyContent: 'flex-start' }}>
                        <img className='mentor-icon' src={cashIcon} />
                        <h3 style={{ fontWeight: 600 }}>{4}</h3>
                      </div>

                      <button
                        onClick={() =>
                          navigate(`/courses/course-details/${course.id}`)
                        }
                        type='button'
                        className='btn-activate'>
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='table-container'>
              <table className=''>
                <thead>
                  <tr>
                    <th>Course ID</th>
                    <th>Course Title</th>
                    <th>Starting Date</th>
                    <th>Profit</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={mentor.id}>
                      <td>{limitText(course.id, 15)}</td>
                      <td>{course.title}</td>
                      <td style={{ letterSpacing: '2px' }}>
                        {formatDate(course.startDate?.toDate())}
                      </td>
                      <td>{course.price}</td>
                      <td />
                      <td className=''>
                        <div className='table-buttons-container'>
                          <button
                            onClick={() =>
                              navigate(`/courses/course-details/${course.id}`)
                            }
                            type='button'
                            className='btn-activate'>
                            View Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Pagination
            next={() => {}}
            nextDisabled
            prev={() => {}}
            prevDisabled
          />
        </>
      )}
    </>
  );
};

export default Mentor;

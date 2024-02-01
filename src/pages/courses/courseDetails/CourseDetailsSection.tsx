import circleCheck from '../../../assets/icons/mdi_success-circle-outline.svg';
import user from '../../../assets/user.png';
import Accordion from '../../../components/Accordion';
import Stars from '../../../components/Stars';
import mockImage from '../../../assets/mock/999af86c2265c937933820ab7a07d63d.jpeg';
import timeIcon from '../../../assets/icons/time-svgrepo-com 1.svg';
import calenderIcon from '../../../assets/icons/streamline_interface-calendar-blank-calendar-date-day-month.svg';
import linkedinIcon from '../../../assets/icons/linkedin.svg';
import facebookIcon from '../../../assets/icons/facebook.svg';
import youtubeIcon from '../../../assets/icons/mdi_youtube.svg';
import InImage from '../../../assets/icons/in-image.svg';
import { CourseType } from '../../../../types';
import Progress from '../../../components/Progress';
import { formatDate, getDurationFromDates } from '../../../utils/helper';
import AlertDialog from '../../../components/AlertDialog';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../utils/fire';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { LoadingBlur } from '../../../components/Loading';

const CourseDetailsSection = ({
  course,
  setPage,
}: {
  course: CourseType;
  setPage: (page: string) => void;
}) => {
  const navigate = useNavigate();

  const deleteCourse = async () => {
    if (!course.id) return;

    try {
      await deleteDoc(doc(db, 'courses', course.id));
      toast.success('deleted');
      navigate('/courses');
    } catch (err) {
      toast.error('something went wrong');
    }
  };

  const [loadingHide, setLoading] = useState(false);
  const hideCourse = async () => {
    setLoading(true);
    try {
      await updateDoc(doc(db, `courses`, course.id), {
        isHidden: !course?.isHidden,
      });

      setLoading(false);
      toast.success('Course Hidden');
    } catch (err) {
      setLoading(false);
      toast.error('something went wrong');
    }
  };

  return (
    <>
      {loadingHide && <LoadingBlur />}
      <div className='course-details-header'>
        <div className='flex cdh-buttons'>
          <button className={`active`} onClick={() => setPage('details')}>
            Course Details
          </button>
          <button
            // className={`${page === 'r-students' ? 'active' : ''}`}
            onClick={() => setPage('r-students')}>
            Registered Students
          </button>
        </div>

        <div className='header-buttons course-detail-header'>
          <>
            <AlertDialog
              onConfirm={deleteCourse}
              description='This cannot be undone. This will delete this
          course permanently'>
              <button className='btn-red'>Delete Course</button>
            </AlertDialog>
            <button
              className='btn-main'
              onClick={() =>
                navigate(`/courses/course-details/${course.id}/edit`)
              }>
              Edit Course
            </button>
            {course?.isHidden ? (
              <AlertDialog
                onConfirm={hideCourse}
                confirmText='Yes, Make Visible'
                description='Are you sure you want this course Visible?'>
                <button className='btn-main'>UnHide Course</button>
              </AlertDialog>
            ) : (
              <AlertDialog
                onConfirm={hideCourse}
                confirmText='Yes, Hide'
                description='Are you sure you want this course Hidden?'>
                <button className='btn-main'>Hide Course</button>
              </AlertDialog>
            )}
          </>
        </div>
      </div>

      <section className='main-details-section'>
        <div className='main-details-text-section'>
          <div className='course-expertise'>
            <span className=''>{course?.level}</span>
          </div>
          <h4 className='course-details-title'>{course?.title}</h4>
          <h5>${course?.price}</h5>
          <p className='main-details-text-section-text'>
            {course?.description}
          </p>

          <div className='instructor-container'>
            {course?.instructor?.imageLink?.length > 0 ? (
              <img
                src={course?.instructor?.imageLink}
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
            <span>{course?.instructor?.name}</span>
          </div>

          <div className='course-date'>
            <div className='flex gap-1'>
              <img alt='time' src={timeIcon} />
              <p>{course?.durationInWeeks} weeks</p>
            </div>

            <div className='flex gap-1'>
              <img alt='calender' src={calenderIcon} />
              <p>{formatDate(course?.startDate?.toDate())}</p>
            </div>
          </div>
        </div>

        <div className='main-details-image-section'>
          <img className='course-image' src={course?.imageLink || mockImage} />
        </div>
      </section>

      <section className='course-details-container'>
        <div className='course-details-about-container'>
          <div>
            <h4>About this course</h4>

            <p>{course?.about}</p>
          </div>

          <article className='course-details-maindetails'>
            <h5>Course Details</h5>

            <p>
              <span>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-6 h-6'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25'
                  />
                </svg>
              </span>
              {course?.totalNumberOfLectures} Lectures
            </p>
            <p>
              <span>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='22'
                  viewBox='0 0 20 22'
                  fill='none'>
                  <path
                    d='M1.09253 8.57145H18.9165'
                    stroke='#5E6366'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M14.442 12.4767H14.4512'
                    stroke='#5E6366'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M10.0047 12.4767H10.014'
                    stroke='#5E6366'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M5.55793 12.4767H5.5672'
                    stroke='#5E6366'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M14.442 16.3634H14.4512'
                    stroke='#5E6366'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M10.0047 16.3634H10.014'
                    stroke='#5E6366'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M5.55793 16.3634H5.5672'
                    stroke='#5E6366'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M14.0438 1.16699V4.45777'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M5.9654 1.16699V4.45777'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    fill-rule='evenodd'
                    clip-rule='evenodd'
                    d='M14.2383 2.74609H5.77096C2.83427 2.74609 1 4.38203 1 7.38912V16.4388C1 19.4931 2.83427 21.1669 5.77096 21.1669H14.229C17.175 21.1669 19 19.5215 19 16.5144V7.38912C19.0092 4.38203 17.1842 2.74609 14.2383 2.74609Z'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </span>
              {course?.startDate &&
                getDurationFromDates(
                  course.startDate.toDate(),
                  course.endDate.toDate()
                )}{' '}
              Weeks - ({course?.lectureDays})
            </p>
            <p>
              <span>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='20'
                  viewBox='0 0 24 25'
                  fill='none'>
                  <g clipPath='url(#clip0_512_4059)'>
                    <path
                      d='M12.0001 0.166992C5.38337 0.166992 0.000488281 5.55016 0.000488281 12.1668C0.000488281 18.7838 5.38337 24.167 12.0001 24.167C18.6168 24.167 23.9999 18.7838 23.9999 12.1668C23.9999 5.55016 18.6165 0.166992 12.0001 0.166992ZM12.0001 22.4321C6.34018 22.4321 1.73512 17.827 1.73512 12.1668C1.73512 6.50667 6.33989 1.90191 12.0001 1.90191C17.6602 1.90191 22.265 6.50667 22.265 12.1668C22.265 17.827 17.6602 22.4321 12.0001 22.4321Z'
                      fill='#5E6366'
                    />
                    <path
                      d='M15.4722 13.2707C15.4676 13.2707 15.4635 13.2707 15.4589 13.2707L12.8675 13.3094V6.52762C12.8675 6.04849 12.4792 5.66016 12 5.66016C11.5209 5.66016 11.1326 6.04849 11.1326 6.52762V14.1902C11.1326 14.1919 11.1331 14.1936 11.1331 14.1954C11.1331 14.1983 11.1326 14.2009 11.1326 14.2032C11.1331 14.2385 11.1398 14.2717 11.1444 14.3055C11.1473 14.3267 11.1476 14.3483 11.1517 14.3692C11.1595 14.4065 11.1725 14.4412 11.1849 14.4761C11.1913 14.4944 11.1953 14.5134 11.2028 14.5308C11.2179 14.5664 11.2381 14.5988 11.2575 14.632C11.2664 14.6467 11.2731 14.6629 11.2826 14.6774C11.3046 14.7095 11.3309 14.7381 11.357 14.7673C11.3679 14.7795 11.3769 14.7933 11.3885 14.8052C11.4165 14.833 11.448 14.8564 11.4796 14.8804C11.4923 14.8899 11.5036 14.9015 11.5166 14.9105C11.5507 14.9336 11.588 14.9518 11.6253 14.9697C11.6383 14.9758 11.6499 14.9845 11.6632 14.99C11.7065 15.0082 11.7528 15.0209 11.7996 15.0322C11.8083 15.0342 11.8164 15.0383 11.8254 15.04C11.8815 15.0513 11.9396 15.0576 11.9992 15.0576C12.0035 15.0576 12.0081 15.0576 12.0125 15.0576L15.4846 15.0056C15.9635 14.9984 16.346 14.604 16.3391 14.1251C16.3324 13.6506 15.9452 13.2707 15.4722 13.2707Z'
                      fill='#5E6366'
                    />
                  </g>
                  <defs>
                    <clipPath id='clip0_512_4059'>
                      <rect
                        width='24'
                        height='24'
                        fill='white'
                        transform='translate(0 0.166992)'
                      />
                    </clipPath>
                  </defs>
                </svg>
              </span>
              {course?.lectureStartTime} - {course?.lectureEndTime} UTC Time
            </p>
            <p>
              <span>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='25'
                  viewBox='0 0 24 25'
                  fill='none'>
                  <path
                    d='M2 21.167C1.71667 21.167 1.479 21.071 1.287 20.879C1.095 20.687 0.999337 20.4497 1 20.167C1 19.8837 1.096 19.646 1.288 19.454C1.48 19.262 1.71734 19.1663 2 19.167H22C22.2833 19.167 22.521 19.263 22.713 19.455C22.905 19.647 23.0007 19.8843 23 20.167C23 20.4503 22.904 20.688 22.712 20.88C22.52 21.072 22.2827 21.1677 22 21.167H2ZM4 18.167C3.45 18.167 2.979 17.971 2.587 17.579C2.195 17.187 1.99934 16.7163 2 16.167V5.16699C2 4.61699 2.196 4.14599 2.588 3.75399C2.98 3.36199 3.45067 3.16633 4 3.16699H20C20.55 3.16699 21.021 3.36299 21.413 3.75499C21.805 4.14699 22.0007 4.61766 22 5.16699V16.167C22 16.717 21.804 17.188 21.412 17.58C21.02 17.972 20.5493 18.1677 20 18.167H4ZM4 16.167H20V5.16699H4V16.167Z'
                    fill='#5E6366'
                  />
                </svg>
              </span>
              {course?.coursePlatform}
            </p>
            <p>
              <span>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='25'
                  viewBox='0 0 24 25'
                  fill='none'>
                  <path
                    d='M12 22.167C10.6333 22.167 9.34167 21.9043 8.125 21.379C6.90833 20.8537 5.84567 20.137 4.937 19.229C4.029 18.321 3.31233 17.2587 2.787 16.042C2.26167 14.8253 1.99933 13.5337 2 12.167C2 10.7837 2.26267 9.48766 2.788 8.27899C3.31333 7.07033 4.03 6.01233 4.938 5.10499C5.846 4.19633 6.908 3.47966 8.124 2.95499C9.34 2.43033 10.632 2.16766 12 2.16699C13.3833 2.16699 14.6793 2.42966 15.888 2.95499C17.0967 3.48033 18.1547 4.19699 19.062 5.10499C19.9707 6.01299 20.6873 7.07133 21.212 8.27999C21.7367 9.48866 21.9993 10.7843 22 12.167C22 13.5337 21.7373 14.8253 21.212 16.042C20.6867 17.2587 19.97 18.3213 19.062 19.23C18.154 20.138 17.0957 20.8547 15.887 21.38C14.6783 21.9053 13.3827 22.1677 12 22.167ZM12 20.117C12.4333 19.517 12.8083 18.892 13.125 18.242C13.4417 17.592 13.7 16.9003 13.9 16.167H10.1C10.3 16.9003 10.5583 17.592 10.875 18.242C11.1917 18.892 11.5667 19.517 12 20.117ZM9.4 19.717C9.1 19.167 8.83734 18.596 8.612 18.004C8.38667 17.412 8.19934 16.7997 8.05 16.167H5.1C5.58333 17.0003 6.18767 17.7253 6.913 18.342C7.63833 18.9587 8.46733 19.417 9.4 19.717ZM14.6 19.717C15.5333 19.417 16.3627 18.9587 17.088 18.342C17.8133 17.7253 18.4173 17.0003 18.9 16.167H15.95C15.8 16.8003 15.6127 17.413 15.388 18.005C15.1633 18.597 14.9007 19.1677 14.6 19.717ZM4.25 14.167H7.65C7.6 13.8337 7.56234 13.5043 7.537 13.179C7.51167 12.8537 7.49933 12.5163 7.5 12.167C7.5 11.817 7.51267 11.4797 7.538 11.155C7.56333 10.8303 7.60067 10.501 7.65 10.167H4.25C4.16667 10.5003 4.104 10.8297 4.062 11.155C4.02 11.4803 3.99933 11.8177 4 12.167C4 12.517 4.021 12.8543 4.063 13.179C4.105 13.5037 4.16733 13.833 4.25 14.167ZM9.65 14.167H14.35C14.4 13.8337 14.4377 13.5043 14.463 13.179C14.4883 12.8537 14.5007 12.5163 14.5 12.167C14.5 11.817 14.4873 11.4797 14.462 11.155C14.4367 10.8303 14.3993 10.501 14.35 10.167H9.65C9.6 10.5003 9.56233 10.8297 9.537 11.155C9.51167 11.4803 9.49933 11.8177 9.5 12.167C9.5 12.517 9.51267 12.8543 9.538 13.179C9.56333 13.5037 9.60067 13.833 9.65 14.167ZM16.35 14.167H19.75C19.8333 13.8337 19.896 13.5043 19.938 13.179C19.98 12.8537 20.0007 12.5163 20 12.167C20 11.817 19.979 11.4797 19.937 11.155C19.895 10.8303 19.8327 10.501 19.75 10.167H16.35C16.4 10.5003 16.4377 10.8297 16.463 11.155C16.4883 11.4803 16.5007 11.8177 16.5 12.167C16.5 12.517 16.4873 12.8543 16.462 13.179C16.4367 13.5037 16.3993 13.833 16.35 14.167ZM15.95 8.16699H18.9C18.4167 7.33366 17.8127 6.60866 17.088 5.99199C16.3633 5.37533 15.534 4.91699 14.6 4.61699C14.9 5.16699 15.1627 5.73799 15.388 6.32999C15.6133 6.92199 15.8007 7.53433 15.95 8.16699ZM10.1 8.16699H13.9C13.7 7.43366 13.4417 6.74199 13.125 6.09199C12.8083 5.44199 12.4333 4.81699 12 4.21699C11.5667 4.81699 11.1917 5.44199 10.875 6.09199C10.5583 6.74199 10.3 7.43366 10.1 8.16699ZM5.1 8.16699H8.05C8.2 7.53366 8.38767 6.92099 8.613 6.32899C8.83833 5.73699 9.10067 5.16633 9.4 4.61699C8.46667 4.91699 7.63733 5.37533 6.912 5.99199C6.18667 6.60866 5.58267 7.33366 5.1 8.16699Z'
                    fill='#5E6366'
                  />
                </svg>
              </span>
              {course?.courseLanguage}
            </p>
            <p>
              <span>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-6 h-6'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z'
                  />
                </svg>
              </span>
              {/* {course?.courseCertificate} */}
              Provided Upon completion
            </p>
          </article>

          <article>
            <h5>What will you learn?</h5>

            {course?.learningObjectives?.map((x) => (
              <div key={x} className='gap-2 flex-center'>
                <img alt='circle-check' src={circleCheck} />
                <p>{x}</p>
              </div>
            ))}
          </article>

          <div className=''>
            <h4>Skills you will gain</h4>
            <div className='course-details-skills'>
              {course?.skills?.map((x) => (
                <h5 key={x}>{x}</h5>
              ))}
            </div>
          </div>

          <div className=''>
            <h4>Requirements</h4>
            <div className='course-details-requirements'>
              {course?.requirements?.map((x) => (
                <div key={x} className='gap-2 flex-center'>
                  <img alt='circle-check' src={circleCheck} />
                  <h5>{x}</h5>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4>What’s in this course?</h4>

            <Accordion
              showLength='lesson'
              list={(course?.chapters || []).map((x) => ({
                title: x.title,
                items: x.lessons,
              }))}
            />
          </div>

          <div>
            <h4>About the instructor</h4>
          </div>

          <div className='course-details-instructor'>
            <div className='instructor-image'>
              <img src={course?.instructor.imageLink || InImage} />
            </div>
            <div className='course-details-instructor-texts'>
              <div className='course-details-instructor-texts-header'>
                <h6>{course?.instructor?.name}</h6>
                <p className='instructor-content-container-header-tag'>
                  Mentor
                </p>
              </div>
              <Stars stars={course?.instructor?.rating} size='12' />

              <p>{course?.instructor?.description}</p>
            </div>
          </div>

          {course?.instructor2 && course?.instructor2?.name?.length > 0 && (
            <div className='course-details-instructor'>
              <div className='instructor-image'>
                <img src={course?.instructor2?.imageLink || InImage} />
              </div>
              <div className='course-details-instructor-texts'>
                <div className='course-details-instructor-texts-header'>
                  <h6>{course?.instructor2?.name}</h6>
                  <p className='instructor-content-container-header-tag'>
                    Mentor
                  </p>
                </div>
                <Stars stars={course?.instructor2?.rating} size='12' />

                <p>{course?.instructor2?.description}</p>
              </div>
            </div>
          )}

          <div className='flex gap-3'>
            <img src={facebookIcon} alt='facebook-icon' />
            <img src={linkedinIcon} alt='linkedin-icon' />
            <img src={youtubeIcon} alt='youtube-icon' />
          </div>

          <div className='course-details-instructor-rating-metrics'>
            <div className='course-details-rating'>
              <h3>{course?.instructor?.rating}</h3>
              <Stars stars={course?.instructor?.rating} size='14' />
              <p>Course Rating</p>
              <button>Leave a review</button>
              <Stars stars={5} />
            </div>

            {/* <div className='course-details-metrics'>
              {[1, 2, 3, 4, 5].map((x) => (
                <span key={x} className=''>
                  <Progress progress={100 / x} />
                  <Stars stars={5} size='14' />
                  <p>{Math.round(100 / x)}%</p>
                </span>
              ))}
            </div> */}
          </div>
        </div>

        <div className='course-details-faqs-container'>
          <h4>FAQs</h4>
          <Accordion
            list={course?.faq?.map((x: any) => ({
              items: [x.answer],
              title: `${x.question}`,
            }))}
            type='single'
          />
        </div>
      </section>
    </>
  );
};

export default CourseDetailsSection;

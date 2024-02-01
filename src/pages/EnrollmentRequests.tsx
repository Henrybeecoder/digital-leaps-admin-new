import { PageHeader } from '../components/ListHeader';
import { LoadingBlur } from '../components/Loading';
import Pagination from '../components/Pagination';
import { useGetEnrollRequest } from '../utils/hooks/useEnrollRequests';
import useMediaQuery from '../utils/hooks/useMediaquery';
import emptyStateImg from '../assets/Frame.svg';
import { formatDate, limitText } from '../utils/helper';
import { useNavigate } from 'react-router-dom';
import studentIcon from '../assets/icons/Student_icon.png';
import cashIcon from '../assets/icons/ph_money-light.svg';
import calenderIcon from '../assets/icons/uiw_date.svg';
import { Timestamp, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../utils/fire';
import { useState } from 'react';
import toast from 'react-hot-toast';

const EnrollmentRequests = () => {
  const matches = useMediaQuery('(min-width: 800px)');
  const navigate = useNavigate();

  const [deleting, setDeleting] = useState(false);

  const { requests, loading, prev, next, nextDisabled, prevDisabled } =
    useGetEnrollRequest();

  const deleteEnroll = async (id: string) => {
    const docRef = doc(db, 'enrollRequests', id);

    setDeleting(true);

    try {
      await deleteDoc(docRef);
      toast('deleted request');
      setDeleting(false);
    } catch (err) {
      toast.error('something went wrong');
      setDeleting(false);
    }
  };

  // const sendEnrollRequest = async () => {
  //   const id = nanoid();
  //   const payload = {
  //     courseId: '',
  //     courseName: '',
  //     dateEnrolled: Timestamp.now(),
  //     email: '',
  //     name: '',
  //     price: '',
  //     id,
  //   };

  //   const docRef = doc(db, 'enrollRequests', id);

  //   await setDoc(docRef, payload);
  // };

  return (
    <>
      {(loading || deleting) && <LoadingBlur />}

      <PageHeader
        heading='Enrollment Requests'
        subHeading='See students enrollment requests'
      />

      {requests.length < 1 ? (
        <div className='empty-screen'>
          <img alt='empty-category' src={emptyStateImg} />
          <p>There are no enrollment requests</p>
        </div>
      ) : (
        <>
          {!matches ? (
            <div className='gap-5 list-grid'>
              {requests.map((request) => (
                <div key={request.id} className='sm-reg-details'>
                  <div>
                    <h3>{request.email}</h3>
                  </div>
                  <div>
                    <img className='request-icon' src={studentIcon} />
                    <h3>{request?.name}</h3>
                  </div>

                  <div className='table-buttons-container'>
                    <div className='flex-between'>
                      <div style={{ justifyContent: 'flex-start' }}>
                        <img className='request-icon' src={calenderIcon} />
                        <h3>{formatDate(request.dateEnrolled?.toDate())}</h3>
                      </div>

                      <button
                        onClick={() =>
                          navigate(
                            `/courses/course-details/${request.courseId}`
                          )
                        }
                        type='button'
                        className='btn-primary-outline'>
                        View Course
                      </button>
                    </div>
                    <div className='flex-between'>
                      <div style={{ justifyContent: 'flex-start' }}>
                        <img className='request-icon' src={cashIcon} />
                        <h3 style={{}}>{limitText(request.courseName, 15)}</h3>
                      </div>

                      <button
                        onClick={() => deleteEnroll(request.id)}
                        type='button'
                        className='btn-deactivate'>
                        Delete
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
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Course Name</th>
                    {/* <th>Course ID</th> */}
                    <th>Enrollment Date</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request.id}>
                      <td>{limitText(request?.name, 21)}</td>
                      <td
                        style={{
                          fontSize: '13px',
                          maxWidth: '140px',
                          whiteSpace: 'break-spaces',
                        }}>
                        <p style={{ wordBreak: 'break-all' }}>
                          {request.email}
                        </p>
                      </td>
                      <td
                        style={{
                          fontSize: '11px',
                          maxWidth: '150px',
                          whiteSpace: 'break-spaces',
                        }}>
                        {limitText(request.courseName, 100)}
                      </td>

                      {/* <td>{limitText(request.courseId, 15)}</td> */}
                      <td style={{ letterSpacing: '2px' }}>
                        {formatDate(request.dateEnrolled?.toDate())}
                      </td>
                      <td className=''>
                        <div className='table-buttons-container'>
                          <button
                            onClick={() =>
                              navigate(
                                `/courses/course-details/${request.courseId}`
                              )
                            }
                            type='button'
                            className='btn-primary-outline'>
                            View Course
                          </button>

                          <button
                            onClick={() => deleteEnroll(request.id)}
                            type='button'
                            className='btn-deactivate'>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      <Pagination
        next={next}
        prev={prev}
        nextDisabled={nextDisabled}
        prevDisabled={prevDisabled}
      />
    </>
  );
};

export default EnrollmentRequests;

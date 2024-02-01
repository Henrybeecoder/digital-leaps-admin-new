import { useNavigate } from 'react-router-dom';
import { LoadingBlur } from '../../components/Loading';
// import mentorIcon from '../../assets/icons/mentor_icon.png';
import calenderIcon from '../../assets/icons/uiw_date.svg';
import cashIcon from '../../assets/icons/ph_money-light.svg';
import Pagination from '../../components/Pagination';
import { formatDate, limitText } from '../../utils/helper';
import useMediaQuery from '../../utils/hooks/useMediaquery';
import { useState } from 'react';
import ChangeStatus from '../../components/ChangeStatus';
import {
  useGetmentorRequests,
  useGetmentors,
} from '../../utils/hooks/useGetMentors';
import emptyStateImg from '../../assets/Frame.svg';
import ListHeader, { PageHeader } from '../../components/ListHeader';
import AlertDialog from '../../components/AlertDialog';
import toast from 'react-hot-toast';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../utils/fire';

const MentorRequests = () => {
  const navigate = useNavigate();
  const matches = useMediaQuery('(min-width: 800px)');

  const [loadingStatus, setLoadingStatus] = useState(false);

  const { requests, loading, next, nextDisabled, prev, prevDisabled } =
    useGetmentorRequests();

  const deleteMentorRequest = async (id: string) => {
    setLoadingStatus(true);
    await deleteDoc(doc(db, 'mentorRequests', id));
    setLoadingStatus(false);
  };

  return (
    <>
      {(loading || loadingStatus) && <LoadingBlur />}
      <PageHeader
        heading='Mentor Requests'
        subHeading='Manage your mentors request'
      />

      {requests.length < 1 ? (
        <div className='empty-screen'>
          <img alt='empty-category' src={emptyStateImg} />
          <p>There are no mentors request</p>
        </div>
      ) : (
        <>
          {!matches ? (
            <div className='gap-5 list-grid'>
              {requests.map((mentor) => (
                <div key={mentor.id} className='sm-reg-details'>
                  <div>
                    {/* <input type='checkbox' /> */}
                    <h3></h3>
                    <div>
                      <h5
                        className={`${
                          mentor.status === 'Active'
                            ? 'reg-status-paid'
                            : 'reg-status-unpaid'
                        }`}>
                        {mentor.status}
                      </h5>
                    </div>
                  </div>
                  <div style={{ display: 'block' }}>
                    {/* <img className='mentor-icon' src={mentorIcon} /> */}
                    <h3>{mentor.fullName}</h3>
                    <p>{mentor.email}</p>
                  </div>
                  <div className='table-buttons-container'>
                    <div className='flex-between'>
                      <div style={{ justifyContent: 'flex-start' }}>
                        <img className='mentor-icon' src={calenderIcon} />
                        <h3>{formatDate(mentor.timeStamp?.toDate())}</h3>
                      </div>

                      <button
                        onClick={() =>
                          navigate(`/mentors/requests/${mentor.id}`)
                        }
                        type='button'
                        className='btn-primary-outline'>
                        View
                      </button>
                    </div>
                    <div className='flex-between'>
                      {/* <div style={{ justifyContent: 'flex-start' }}>
                        <img className='mentor-icon' src={cashIcon} />
                        <h3 style={{ fontWeight: 600 }}>{4}</h3>
                      </div> */}

                      <AlertDialog
                        onConfirm={() => deleteMentorRequest(mentor.id)}>
                        <button className={`btn-deactivate`}>Delete</button>
                      </AlertDialog>
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
                    <th>Name</th>
                    <th>PhoneNumber</th>
                    <th>Email</th>
                    <th>Date Sent</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((mentor) => (
                    <tr key={mentor.id}>
                      <td>{limitText(mentor.fullName, 21)}</td>
                      <td>{mentor.phoneNumber}</td>
                      <td>{mentor.email}</td>
                      <td style={{ letterSpacing: '2px' }}>
                        {formatDate(mentor.timeStamp?.toDate())}
                      </td>

                      <td />
                      <td className=''>
                        <div className='table-buttons-container'>
                          <button
                            onClick={() =>
                              navigate(`/mentors/requests/${mentor.id}`)
                            }
                            type='button'
                            className='btn-primary-outline'>
                            View
                          </button>

                          <AlertDialog
                            confirmText='Delete'
                            onConfirm={() => deleteMentorRequest(mentor.id)}>
                            <button className={`btn-deactivate`}>Delete</button>
                          </AlertDialog>
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
        prev={prev}
        next={next}
        prevDisabled={prevDisabled}
        nextDisabled={nextDisabled}
      />
    </>
  );
};

export default MentorRequests;

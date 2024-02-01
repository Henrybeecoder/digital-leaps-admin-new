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
import { useGetmentors } from '../../utils/hooks/useGetMentors';
import emptyStateImg from '../../assets/Frame.svg';
import ListHeader from '../../components/ListHeader';
import AlertDialog from '../../components/AlertDialog';
import toast from 'react-hot-toast';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../utils/fire';

const Mentors = () => {
  const navigate = useNavigate();
  const matches = useMediaQuery('(min-width: 800px)');

  const [loadingStatus, setLoadingStatus] = useState(false);

  const { mentors, loading, onSearch, next, nextDisabled, prev, prevDisabled } =
    useGetmentors();

  const deleteMentor = async (mentorId: string) => {
    setLoadingStatus(true);
    try {
      await deleteDoc(doc(db, 'mentors', mentorId));
      setLoadingStatus(false);
      toast.success('deleted');
    } catch (err) {
      toast.error('something went wrong');
      setLoadingStatus(false);
    }
  };

  return (
    <>
      {(loading || loadingStatus) && <LoadingBlur />}
      <ListHeader
        heading='Mentors'
        subHeading='Manage your mentors and registration details'
        button={{
          name: '+New Mentor',
          onClick: () => navigate(`/mentors/new`),
        }}
        button2={{
          name: 'Requests',
          onClick: () => navigate(`/mentors/requests`),
        }}
        input={{ placeholder: 'Search by mentor name', onSearch }}
      />

      {mentors.length < 1 ? (
        <div className='empty-screen'>
          <img alt='empty-category' src={emptyStateImg} />
          <p>There are no registered mentors</p>
        </div>
      ) : (
        <>
          {!matches ? (
            <div className='gap-5 list-grid'>
              {mentors.map((mentor) => (
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
                  <div>
                    {/* <img className='mentor-icon' src={mentorIcon} /> */}
                    <h3>{mentor?.name}</h3>
                  </div>
                  <div className='table-buttons-container'>
                    <div className='flex-between'>
                      <div style={{ justifyContent: 'flex-start' }}>
                        <img className='mentor-icon' src={calenderIcon} />
                        <h3>{formatDate(mentor.dateRegistered?.toDate())}</h3>
                      </div>

                      <button
                        onClick={() => navigate(mentor.id)}
                        type='button'
                        className='btn-primary-outline'>
                        View
                      </button>
                    </div>
                    <div className='flex-between'>
                      <div style={{ justifyContent: 'flex-start' }}>
                        <img className='mentor-icon' src={cashIcon} />
                        <h3 style={{ fontWeight: 600 }}>{4}</h3>
                      </div>

                      <button className={`btn-deactivate`}>Delete</button>
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
                    <th>Mentor Name</th>
                    <th>Registration Date</th>
                    <th>Status</th>
                    <th>No. of Courses</th>
                  </tr>
                </thead>
                <tbody>
                  {mentors.map((mentor) => (
                    <tr key={mentor.id}>
                      <td>{limitText(mentor?.name, 21)}</td>
                      <td style={{ letterSpacing: '2px' }}>
                        {formatDate(mentor.dateRegistered?.toDate())}
                      </td>
                      <td>
                        <p
                          className={`${
                            mentor.status === 'Active'
                              ? 'reg-status-paid'
                              : 'reg-status-unpaid'
                          }`}>
                          {mentor.status}
                        </p>
                      </td>
                      <td>{mentor.numberOfCourses || 0}</td>
                      <td />
                      <td className=''>
                        <div className='table-buttons-container'>
                          <button
                            onClick={() => navigate(mentor.id)}
                            type='button'
                            className='btn-primary-outline'>
                            View
                          </button>

                          <AlertDialog
                            confirmText='Delete'
                            onConfirm={() => deleteMentor(mentor.id)}>
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

export default Mentors;

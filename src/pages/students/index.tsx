// import { useNavigate } from 'react-router-dom';
import { LoadingBlur } from '../../components/Loading';
import studentIcon from '../../assets/icons/Student_icon.png';
import calenderIcon from '../../assets/icons/uiw_date.svg';
import cashIcon from '../../assets/icons/ph_money-light.svg';
import Pagination from '../../components/Pagination';
import { formatDate, limitText } from '../../utils/helper';
import useMediaQuery from '../../utils/hooks/useMediaquery';
import { UserType } from '../../../types';
import { useState } from 'react';
import ChangeStatus from '../../components/ChangeStatus';
import { useGetStudents } from '../../utils/hooks/useGetStudents';
import emptyStateImg from '../../assets/Frame.svg';
import { useNavigate } from 'react-router-dom';
import ListHeader from '../../components/ListHeader';

const Students = () => {
  const navigate = useNavigate();
  const matches = useMediaQuery('(min-width: 800px)');

  const [filter, setFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [loadingStatus, setLoadingStatus] = useState(false);

  const {
    students,
    loading,
    onSearch,
    prev,
    next,
    nextDisabled,
    prevDisabled,
  } = useGetStudents(filter);

  return (
    <>
      {(loading || loadingStatus) && <LoadingBlur />}

      <ListHeader
        heading='Students'
        subHeading='Manage your students and registration details'
        // button={{ name: '+ Add Student', onClick: () => {} }}
        input={{ placeholder: 'Search by student name', onSearch }}>
        <div className=''>
          <button
            className={`${filter === 'All' ? 'active' : ''}`}
            onClick={() => filter !== 'All' && setFilter('All')}>
            All
          </button>
          <button
            className={`${filter === 'Active' ? 'active' : ''}`}
            onClick={() => filter !== 'Active' && setFilter('Active')}>
            Active
          </button>
          <button
            className={`${filter === 'Inactive' ? 'active' : ''}`}
            onClick={() => filter !== 'Inactive' && setFilter('Inactive')}>
            Inactive
          </button>
        </div>
      </ListHeader>

      {students.length < 1 ? (
        <div className='empty-screen'>
          <img alt='empty-category' src={emptyStateImg} />
          <p>There are no registered students</p>
        </div>
      ) : (
        <>
          {!matches ? (
            <div className='gap-5 list-grid'>
              {students.map((student) => (
                <div key={student.id} className='sm-reg-details'>
                  <div>
                    {/* <input type='checkbox' /> */}
                    <h3>{limitText(student.id, 5)}</h3>
                    <div>
                      <h5
                        className={`${
                          student.status === 'Active'
                            ? 'reg-status-paid'
                            : 'reg-status-unpaid'
                        }`}>
                        {student.status}
                      </h5>
                    </div>
                  </div>
                  <div>
                    <img className='student-icon' src={studentIcon} />
                    <h3>{student.displayName}</h3>
                  </div>

                  <div className='table-buttons-container'>
                    <div className='flex-between'>
                      <div style={{ justifyContent: 'flex-start' }}>
                        <img className='student-icon' src={calenderIcon} />
                        <h3>{formatDate(student.dateRegistered?.toDate())}</h3>
                      </div>

                      <button
                        onClick={() => navigate(student.id)}
                        type='button'
                        className='btn-primary-outline'>
                        View Details
                      </button>
                    </div>
                    <div className='flex-between'>
                      <div style={{ justifyContent: 'flex-start' }}>
                        <img className='student-icon' src={cashIcon} />
                        <h3 style={{ fontWeight: 600 }}>${student.amount}</h3>
                      </div>
                      <ChangeStatus
                        id={student.id}
                        prevStatus={student.status}
                        field='users'
                        setLoadingStatus={setLoadingStatus}
                      />
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
                    <th>Student ID</th>
                    <th>Registration Date</th>
                    <th>Status</th>
                    {/* <th>Total</th> */}
                    <th />
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {students.map((student: UserType) => (
                    <tr key={student.id}>
                      <td>{limitText(student.displayName, 21)}</td>
                      <td>{limitText(student.id, 10)}</td>
                      <td style={{ letterSpacing: '2px' }}>
                        {formatDate(student.dateRegistered?.toDate())}
                      </td>
                      <td>
                        <p
                          className={`${
                            student.status === 'Active'
                              ? 'reg-status-paid'
                              : 'reg-status-unpaid'
                          }`}>
                          {student.status}
                        </p>
                      </td>
                      {/* <td style={{ fontWeight: 600 }}>${student.amount}</td> */}
                      <td />
                      <td />
                      <td className=''>
                        <div className='table-buttons-container'>
                          <button
                            onClick={() => navigate(student.id)}
                            type='button'
                            className='btn-primary-outline'>
                            View Details
                          </button>

                          <ChangeStatus
                            id={student.id}
                            prevStatus={student.status}
                            field='users'
                            setLoadingStatus={setLoadingStatus}
                          />
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

export default Students;

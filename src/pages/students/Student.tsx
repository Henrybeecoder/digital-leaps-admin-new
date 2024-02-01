import { useParams } from 'react-router-dom';
import {
  useGetStudent,
  useGetStudentCourses,
} from '../../utils/hooks/useGetStudents';
import { Loading } from '../../components/Loading';
import { PasswordHidden } from '../../components/Svg';
import { useState } from 'react';
import useMediaQuery from '../../utils/hooks/useMediaquery';
import emptyStateImg from '../../assets/Frame.svg';
import { formatDate, limitText } from '../../utils/helper';
import calenderIcon from '../../assets/icons/uiw_date.svg';
import cashIcon from '../../assets/icons/ph_money-light.svg';
import Pagination from '../../components/Pagination';
import studentIcon from '../../assets/icons/Student_icon.png';
import { PayModalStudent } from '../../components/PayModal';
import UpdateStudentForm from './UpdateStudentForm';

const Student = () => {
  const matches = useMediaQuery('(min-width: 800px)');
  const params = useParams();
  const id = params?.id;

  const [filter, setFilter] = useState<'All' | 'Paid' | 'Unpaid'>('All');

  const [student, loading] = useGetStudent(id);
  const { courses, loading: loadingCourses } = useGetStudentCourses(id, filter);

  const [edit, setEdit] = useState(false);

  const [open, setOpen] = useState<string | null>(null);

  // console.log(courses);

  if (loading || loadingCourses) return <Loading />;

  return (
    <>
      <PayModalStudent open={open} setOpen={setOpen} student={student} />
      <div className='header'>
        <div className='reg-students-header'>
          <div>
            <h3>{student?.displayName}</h3>
            {/* <button onClick={() => setEdit((x) => !x)}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='25'
                height='25'
                viewBox='0 0 32 32'
                fill='none'>
                <rect width='32' height='32' rx='4' fill='#24559C' />
                <path
                  d='M23.0538 13.0904L18.868 8.94795L20.2469 7.56712C20.6244 7.18904 21.0883 7 21.6385 7C22.1887 7 22.6523 7.18904 23.0292 7.56712L24.408 8.94795C24.7856 9.32603 24.9826 9.78236 24.999 10.3169C25.0154 10.8515 24.8348 11.3075 24.4573 11.6849L23.0538 13.0904ZM21.6257 14.5452L11.1858 25H7V20.8082L17.4399 10.3534L21.6257 14.5452Z'
                  fill='white'
                />
              </svg>
            </button> */}
          </div>
          {edit && !!student ? (
            <UpdateStudentForm student={student} />
          ) : (
            <>
              {/* <div className=''>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='26'
                  height='26'
                  viewBox='0 0 32 32'
                  fill='none'>
                  <path
                    d='M29.3334 8.00065C29.3334 6.53398 28.1334 5.33398 26.6667 5.33398H5.33341C3.86675 5.33398 2.66675 6.53398 2.66675 8.00065V24.0007C2.66675 25.4673 3.86675 26.6673 5.33341 26.6673H26.6667C28.1334 26.6673 29.3334 25.4673 29.3334 24.0007V8.00065ZM26.6667 8.00065L16.0001 14.6673L5.33341 8.00065H26.6667ZM26.6667 24.0007H5.33341V10.6673L16.0001 17.334L26.6667 10.6673V24.0007Z'
                    fill='#22319E'
                  />
                </svg>
                <p>{student?.email}</p>
              </div>

              <div className=''>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='26'
                  height='26'
                  viewBox='0 0 32 32'
                  fill='none'>
                  <path
                    d='M15.9999 22.6673C15.2927 22.6673 14.6144 22.3864 14.1143 21.8863C13.6142 21.3862 13.3333 20.7079 13.3333 20.0007C13.3333 18.5207 14.5199 17.334 15.9999 17.334C16.7072 17.334 17.3854 17.6149 17.8855 18.115C18.3856 18.6151 18.6666 19.2934 18.6666 20.0007C18.6666 20.7079 18.3856 21.3862 17.8855 21.8863C17.3854 22.3864 16.7072 22.6673 15.9999 22.6673ZM23.9999 26.6673V13.334H7.99992V26.6673H23.9999ZM23.9999 10.6673C24.7072 10.6673 25.3854 10.9483 25.8855 11.4484C26.3856 11.9485 26.6666 12.6267 26.6666 13.334V26.6673C26.6666 27.3746 26.3856 28.0528 25.8855 28.5529C25.3854 29.053 24.7072 29.334 23.9999 29.334H7.99992C7.29267 29.334 6.6144 29.053 6.1143 28.5529C5.6142 28.0528 5.33325 27.3746 5.33325 26.6673V13.334C5.33325 11.854 6.51992 10.6673 7.99992 10.6673H9.33325V8.00065C9.33325 6.23254 10.0356 4.53685 11.2859 3.28661C12.5361 2.03636 14.2318 1.33398 15.9999 1.33398C16.8754 1.33398 17.7423 1.50642 18.5511 1.84145C19.36 2.17649 20.0949 2.66755 20.714 3.28661C21.333 3.90566 21.8241 4.64059 22.1591 5.44943C22.4941 6.25827 22.6666 7.12517 22.6666 8.00065V10.6673H23.9999ZM15.9999 4.00065C14.9391 4.00065 13.9216 4.42208 13.1715 5.17222C12.4213 5.92237 11.9999 6.93979 11.9999 8.00065V10.6673H19.9999V8.00065C19.9999 6.93979 19.5785 5.92237 18.8283 5.17222C18.0782 4.42208 17.0608 4.00065 15.9999 4.00065Z'
                    fill='#22319E'
                  />
                </svg>
                <PasswordHidden />
              </div> */}
            </>
          )}
        </div>

        <button className='btn-main'>Deactivate</button>
      </div>

      <div className='course-details-header'>
        <div className='reg-students-header'>
          <h3 style={{ fontSize: '18px' }}>Courses</h3>

          <div className=''>
            <button
              className={`${filter === 'All' ? 'active' : ''}`}
              onClick={() => filter !== 'All' && setFilter('All')}>
              All
            </button>
            <button
              className={`${filter === 'Paid' ? 'active' : ''}`}
              onClick={() => filter !== 'Paid' && setFilter('Paid')}>
              Paid
            </button>
            <button
              className={`${filter === 'Unpaid' ? 'active' : ''}`}
              onClick={() => filter !== 'Unpaid' && setFilter('Unpaid')}>
              Unpaid
            </button>
          </div>
        </div>
      </div>

      {courses.length < 1 ? (
        <div className='empty-screen'>
          <img alt='empty-category' src={emptyStateImg} />
          <p>There are no {filter !== 'All' ? filter : ''} courses enrolled</p>
        </div>
      ) : (
        <>
          {!matches ? (
            <div className='list-grid gap-5'>
              {courses.map((x) => (
                <div key={x.id} className='sm-reg-details'>
                  <div>
                    {/* <input type='checkbox' /> */}
                    <h3>{limitText(x.invoiceNumber, 11)}</h3>
                    <div>
                      <h5
                        className={`${
                          x.status === 'Paid'
                            ? 'reg-status-paid'
                            : 'reg-status-unpaid'
                        }`}>
                        {x.status}
                      </h5>
                    </div>
                  </div>
                  <div>
                    <img className='student-icon' src={studentIcon} />
                    <h3>{student.displayName}</h3>
                  </div>
                  <div>
                    <img className='student-icon' src={calenderIcon} />
                    <h3>{formatDate(x.startDate.toDate())}</h3>
                  </div>

                  <div className='table-buttons-container'>
                    <div className='flex-between'>
                      <div style={{ justifyContent: 'flex-start' }}>
                        <img className='student-icon' src={calenderIcon} />
                        <h3>{formatDate(x.endDate.toDate())}</h3>
                      </div>
                      <div>
                        <button
                          type='button'
                          onClick={() => setOpen(x.id)}
                          disabled={x.status === 'Paid'}
                          className='btn-reg-students-pay'>
                          Pay
                        </button>
                      </div>
                    </div>

                    <div className='flex-between'>
                      <div style={{ justifyContent: 'flex-start' }}>
                        <img className='student-icon' src={cashIcon} />
                        <h3 style={{ fontWeight: 600 }}>${x.price}</h3>
                      </div>
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
                    <th>Invoice Number</th>
                    <th>Course Title</th>
                    <th>Gegistration Date</th>
                    <th>Status</th>
                    <th>Amount</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {courses.map((x) => (
                    <tr key={x.id}>
                      {/* <td>
                    <input type='checkbox' />
                  </td> */}
                      <td>{limitText(x.invoiceNumber, 15)}</td>
                      <td>{limitText(x.title, 20)}</td>
                      <td style={{ letterSpacing: '2px' }}>
                        {formatDate(x.startDate.toDate())}
                      </td>
                      <td>
                        <p
                          className={`${
                            x.status === 'Paid'
                              ? 'reg-status-paid'
                              : 'reg-status-unpaid'
                          }`}>
                          {x.status}
                        </p>
                      </td>
                      <td style={{ fontWeight: 600 }}>${x.price}</td>
                      <td className=''>
                        <div className='table-buttons-container'>
                          <button
                            type='button'
                            onClick={() => setOpen(x.id)}
                            disabled={x.status === 'Paid'}
                            className='btn-reg-students-pay'>
                            Pay
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
      <Pagination next={() => {}} nextDisabled prev={() => {}} prevDisabled />
    </>
  );
  {
    (' ');
  }
};

export default Student;

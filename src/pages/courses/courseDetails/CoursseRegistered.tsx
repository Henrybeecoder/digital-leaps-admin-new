import { useState } from 'react';
import { formatDate, limitText } from '../../../utils/helper';
import useMediaQuery from '../../../utils/hooks/useMediaquery';
import Pagination from '../../../components/Pagination';
import studentIcon from '../../../assets/icons/Student_icon.png';
import calenderIcon from '../../../assets/icons/uiw_date.svg';
import cashIcon from '../../../assets/icons/ph_money-light.svg';
import { CertificateType, CourseType } from '../../../../types';
import { Timestamp } from 'firebase/firestore';
import { useGetRegisteredStudents } from '../../../utils/hooks/useGetRegisteredStudents';
import { LoadingBlur } from '../../../components/Loading';
import { CSVLink } from 'react-csv';
import { AddStudentForm, CertificateModal } from './Modals';
import { PayModalCourse } from '../../../components/PayModal';
import ListHeader from '../../../components/ListHeader';
import AlertDialog from '../../../components/AlertDialog';
import { deleteDoc, doc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { db } from '../../../utils/fire';

const CourseRegistered = ({
  course,
  setPage,
}: {
  course: CourseType;
  setPage: (page: string) => void;
}) => {
  const matches = useMediaQuery('(min-width: 800px)');
  const [open, setOpen] = useState<string | null>(null);
  const [filter, setFilter] = useState('All');

  const {
    students,
    loading: dataLoading,
    onSearch,
    next,
    nextDisabled,
    prev,
    prevDisabled,
  } = useGetRegisteredStudents(course?.id, filter);

  const [certificateModal, setCertificateModal] =
    useState<CertificateType | null>(null);
  const [serverCertificate, setServerCertificate] = useState<{
    id: string | null | undefined;
    courseId: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const deleteStudentCourses = async (id: string) => {
    const userCourseRef = doc(db, `userCourses/${course.id}/students`, id);
    const userMyCoursesRef = doc(db, `users/${id}/myCourses`, course.id);

    try {
      setLoading(true);
      await deleteDoc(userMyCoursesRef);
      await deleteDoc(userCourseRef);

      toast.success('deleted');
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error('something went wrong');
    }
  };
  // const deleteCourse = async () => {
  //   if (!course.id) return;

  //   try {
  //     await deleteDoc(doc(db, 'courses', course.id));
  //     toast.success('deleted');
  //     // navigate('/courses');
  //   } catch (err) {
  //     toast.error('something went wrong');
  //   }
  // };

  return (
    <>
      {dataLoading || (loading && <LoadingBlur />)}

      <div className='course-details-header'>
        <div className='cdh-buttons'>
          <button
            // className={`${page === 'details' ? 'active' : ''}`}
            onClick={() => setPage('details')}>
            Course Details
          </button>
          <button className={`active`} onClick={() => setPage('r-students')}>
            Registered Students
          </button>
        </div>

        <div className='header-buttons'>
          <>
            <CSVLink
              data={students}
              className='btn-sub'
              target='_blank'
              filename={`registered-students-${new Date().toLocaleDateString()}`}>
              Download Report
            </CSVLink>

            <AddStudentForm course={course} students={students} />
          </>
        </div>
      </div>

      <ListHeader
        heading='Students'
        subHeading='Manage your students and registration details'
        input={{ placeholder: 'Search by invoice number, name', onSearch }}
      />

      {!matches ? (
        <div className='gap-5 list-grid'>
          {students.map((x) => (
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
                <h3>{x.fullName}</h3>
              </div>
              <div>
                <img className='student-icon' src={calenderIcon} />
                <h3>{formatDate(x.dateRegistered?.toDate())}</h3>
              </div>
              <div>
                <img className='student-icon' src={cashIcon} />
                <h3 style={{ fontWeight: 600 }}>${x.amount}</h3>

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
              {x.certificateId ? (
                <button
                  className='btn-gen-cert'
                  onClick={() =>
                    setServerCertificate({
                      courseId: course.id,
                      id: x.certificateId,
                    })
                  }>
                  View Certificate
                </button>
              ) : (
                <button
                  className='btn-gen-cert'
                  onClick={() =>
                    setCertificateModal({
                      courseName: course.title,
                      courseId: course.id,
                      instructor1: course?.instructor?.name,
                      instructor2: course?.instructor2?.name,
                      studentName: x.fullName,
                      text: 'This is the default text for certificates',
                      dateGenerated: Timestamp.now(),
                      studentId: x.id,
                    })
                  }>
                  Generate Certificate
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className='table-container'>
          <table className=''>
            <thead>
              <tr>
                <th>INVOICE NUMBER</th>
                <th>STUDENT NAME</th>
                <th>REG DATE</th>
                <th>PHONE NO.</th>
                <th>EMAIL</th>
                <th>STATUS</th>
                <th>AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {students.map((x) => (
                <tr key={x.id}>
                  <td>{limitText(x.invoiceNumber, 11)}</td>
                  <td>{limitText(x.fullName, 15)}</td>
                  <td style={{ letterSpacing: '2px' }}>
                    {formatDate(x.dateRegistered?.toDate())}
                  </td>
                  <td style={{ letterSpacing: '2px' }}>
                    {limitText(x.phoneNumber, 21)}
                  </td>
                  <td style={{ letterSpacing: '2px' }}>{x.email}</td>
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
                  <td style={{ fontWeight: 600 }}>${x.amount}</td>
                  <td />
                  <td />
                  <td className=''>
                    <div className='table-buttons-container'>
                      <button
                        type='button'
                        onClick={() => setOpen(x.id)}
                        disabled={x.status === 'Paid'}
                        className='btn-reg-students-pay'>
                        Pay
                      </button>

                      {x.certificateId ? (
                        <button
                          className='btn-gen-cert'
                          onClick={() =>
                            setServerCertificate({
                              courseId: course.id,
                              id: x.certificateId,
                            })
                          }>
                          View Certificate
                        </button>
                      ) : (
                        <button
                          className='btn-gen-cert'
                          onClick={() =>
                            setCertificateModal({
                              courseName: course.title,
                              courseId: course.id,
                              instructor1: course.instructor?.name,
                              instructor2: course.instructor2?.name,
                              studentName: x.fullName,
                              text: `For his/her participation and completion of ${course.title}`,
                              dateGenerated: Timestamp.now(),
                              studentId: x.id,
                            })
                          }>
                          Generate Certificate
                        </button>
                      )}

                      <AlertDialog
                        onConfirm={() => deleteStudentCourses(x.id)}
                        description='This cannot be undone. This will delete this
          student permanently'>
                        <button
                          // onClick={() => deleteEnroll(request.id)}
                          type='button'
                          className='btn-deactivate'>
                          Delete
                        </button>
                        {/* <button className='btn-red'>Delete Course</button> */}
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        next={next}
        nextDisabled={nextDisabled}
        prev={prev}
        prevDisabled={prevDisabled}
      />

      <PayModalCourse open={open} setOpen={setOpen} course={course} />

      <CertificateModal
        open={certificateModal}
        serverCertificate={serverCertificate}
        close={() => {
          certificateModal && setCertificateModal(null);
          serverCertificate && setServerCertificate(null);
        }}
      />
    </>
  );
};

export default CourseRegistered;

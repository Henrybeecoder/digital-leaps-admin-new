import { useNavigate, useParams } from 'react-router-dom';
import { Loading, LoadingBlur } from '../../components/Loading';
import {
  useGetMentor,
  useGetMentorCourses,
  useGetMentorRequest,
} from '../../utils/hooks/useGetMentors';
import ListHeader, { PageHeader } from '../../components/ListHeader';
import emptyStateImg from '../../assets/Frame.svg';
import calenderIcon from '../../assets/icons/uiw_date.svg';
import cashIcon from '../../assets/icons/ph_money-light.svg';
import { formatDate, limitText, removeUndefined } from '../../utils/helper';
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
import { Timestamp, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../../utils/fire';
import toast from 'react-hot-toast';
import { nanoid } from 'nanoid';

const MentorRequest = () => {
  const matches = useMediaQuery('(min-width: 800px)');
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id;

  const [loading, setLoading] = useState(false);

  const [request, loadingRequest] = useGetMentorRequest(id);

  const acceptRequest = async () => {
    try {
      const id = nanoid();
      const payload = removeUndefined({
        // ...request,
        name: request.fullName,
        field: request.courseTitle,
        resume: request.resumeLink,
        imageLink: undefined,
        id,
        status: 'Active',
        dateRegistered: Timestamp.now(),
      });
      await setDoc(doc(db, 'mentors', id), payload);
      await deleteDoc(doc(db, 'mentorRequests', `$${id}`));
      setLoading(false);
      toast.success('added mentor');
      navigate(`/mentors/${id}`);
    } catch (err) {
      toast.error('something went wrong');
      setLoading(false);
    }
  };

  const deleteRequest = async () => {
    setLoading(true);
    await deleteDoc(doc(db, 'mentorRequests', `$${id}`));
    setLoading(false);
  };

  if (loadingRequest) return <Loading />;

  return (
    <>
      {loading && <LoadingBlur />}
      <div>
        <div className='header'>
          <div className='reg-students-header'>
            <div>
              <h3>{request?.fullName}</h3>
            </div>
          </div>
          <AlertDialog
            onConfirm={acceptRequest}
            confirmText='Accept'
            description='This mentor will become active'>
            <button className='btn-main'>Accept</button>
          </AlertDialog>
          <AlertDialog
            onConfirm={deleteRequest}
            confirmText='Delete'
            description='This request will be deleted'>
            <button className='btn-red'>Delete</button>
          </AlertDialog>
        </div>

        <section className='mentor-details'>
          <p>
            <span>
              <img alt='mail-icon' src={mailIcon} />
            </span>
            {request?.email}
          </p>
          <p>
            <span>
              <img alt='phone-icon' src={phoneIcon} />
            </span>
            {request?.phoneNumber}
          </p>
          <p>
            <span>
              <img alt='field-icon' src={fieldIcon} />
            </span>
            {request?.courseTitle}
          </p>

          <a
            href={request?.resumeLink}
            target='_blank'
            rel='noopener noreferrer'>
            <span>
              <img alt='resume-icon' src={resumeIcon} />
            </span>
            Resume
          </a>
        </section>
      </div>
    </>
  );
};

export default MentorRequest;

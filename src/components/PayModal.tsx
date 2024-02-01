import { Content, Overlay, Portal, Root } from '@radix-ui/react-dialog';
import { Timestamp, doc, updateDoc } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { LoadingBlur } from './Loading';
import { CourseType, UserType } from '../../types';
import { db } from '../utils/fire';

interface Props {
  open: string | null;
  setOpen: (state: string | null) => void;
}

export const PayModalCourse = ({
  open,
  setOpen,
  course,
}: Props & { course: CourseType }) => {
  const [loading, setLoading] = useState(false);

  const approveCourse = async () => {
    if (!open) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, `userCourses/${course.id}/students`, open), {
        status: 'Paid',
        invoiceNumber: nanoid(),
      });
      await updateDoc(doc(db, `users/${open}/myCourses`, course.id), {
        status: 'Paid',
        invoiceNumber: nanoid(),
      });
      setLoading(false);
      toast.success('success');
      setOpen(null);
    } catch (err) {
      setLoading(false);
      toast.error('something went wrong');
    }
  };

  return (
    <Root open={!!open} onOpenChange={() => setOpen(null)}>
      <Portal>
        <Overlay className='modal-overlay' />
        {loading && <LoadingBlur />}
        <Content className='reg-students-pay-modal'>
          <p>Are you sure you want to approve student? </p>
          <div className='reg-modal-form-btns'>
            <button type='button' className='red' onClick={() => setOpen(null)}>
              Close
            </button>
            <button className='main' onClick={approveCourse}>
              Approve
            </button>
          </div>
        </Content>
      </Portal>
    </Root>
  );
};

export const PayModalStudent = ({
  open,
  setOpen,
  student,
}: Props & { student: UserType }) => {
  const [loading, setLoading] = useState(false);

  const approveCourse = async () => {
    if (!open) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, `users/${student.id}/myCourses`, open), {
        status: 'Paid',
        invoiceNumber: nanoid(),
      });
      await updateDoc(doc(db, `userCourses/${open}/students`, student.id), {
        status: 'Paid',
        invoiceNumber: nanoid(),
      });
      setLoading(false);
      toast.success('success');
      setOpen(null);
    } catch (err) {
      setLoading(false);
      toast.error('something went wrong');
    }
  };

  return (
    <Root open={!!open} onOpenChange={() => setOpen(null)}>
      <Portal>
        <Overlay className='modal-overlay' />
        {loading && <LoadingBlur />}
        <Content className='reg-students-pay-modal'>
          <p>Are you sure you want to approve the course for this student? </p>
          <div className='reg-modal-form-btns'>
            <button type='button' className='red' onClick={() => setOpen(null)}>
              Close
            </button>
            <button className='main' onClick={approveCourse}>
              Approve
            </button>
          </div>
        </Content>
      </Portal>
    </Root>
  );
};

import { useEffect, useState, useRef } from 'react';
import {
  CertificateType,
  CourseType,
  CourseUserType,
  UserType,
} from '../../../../types';
import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { auth, createUserWithEmailAndPassword, db } from '../../../utils/fire';
import toast from 'react-hot-toast';
import {
  Content,
  Overlay,
  Portal,
  Root,
  Trigger,
} from '@radix-ui/react-dialog';
import { LoadingBlur } from '../../../components/Loading';
import Certificate from '../../../components/Certificate';
import { Controller, useController, useForm } from 'react-hook-form';
import { InputTemp } from '../../../components/Input';
import Select from '../../../components/Select';
import { useGetCollection } from '../../../utils/hooks/useData';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { removeUndefined } from '../../../utils/helper';
import ReactToPrint from 'react-to-print';

interface FormValues {
  fullName: string;
  email: string;
  phoneNumber: string;
  country: string;
  educationLevel: string;
  experienceLevel: string;
}

export const AddStudentForm = ({
  course,
  students,
}: {
  course: CourseType;
  students: CourseUserType[];
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState('new');

  return (
    <Root open={open} onOpenChange={setOpen}>
      <Trigger className='btn-main'>+Add Student</Trigger>
      <Portal>
        <Overlay className='modal-overlay' />
        {loading && <LoadingBlur />}
        <Content className='reg-students-pay-modal'>
          <div className='mb-4 cdh-buttons'>
            <button
              className={`${page === 'new' ? 'active' : ''}`}
              onClick={() => setPage('new')}>
              New Student
            </button>
            <button
              className={`${page === 'existing' ? 'active' : ''}`}
              onClick={() => setPage('existing')}>
              Existing Student
            </button>
          </div>
          {page === 'new' ? (
            <NewStudent
              course={course}
              setLoading={setLoading}
              setOpen={setOpen}
            />
          ) : (
            <ExistingStudent
              students={students}
              course={course}
              setLoading={setLoading}
              setOpen={setOpen}
            />
          )}
        </Content>
      </Portal>
    </Root>
  );
};

const ExistingStudent = ({
  course,
  setLoading,
  setOpen,
  students,
}: {
  course: CourseType;
  setLoading: (state: boolean) => void;
  setOpen: (state: boolean) => void;
  students: CourseUserType[];
}) => {
  const { data, loading } = useGetCollection('users');
  console.log(data);
  console.log(students)
  const options = data
    .filter((x) => !students.some((y) => y.id === x.uid))
    .map((x) => ({ item: x.displayName, value: x.id }));

  const Schema = z.object({
    id: z.string({ required_error: 'Select a user' }),
    experienceLevel: z.string().min(1, 'Enter a Level'),
  });

  type FormValues = z.infer<typeof Schema>;

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {},
    resolver: zodResolver(Schema),
  });

  const {
    field: { value: selected, onChange, ref },
  } = useController({ control, name: 'id' });

  const user = data.find((x) => x.id === selected) as UserType | undefined;

  const save = async (values: FormValues) => {
    if (!user || !values.id) return;

    try {
      setLoading(true);
      await setDoc(doc(db, `userCourses/${course.id}/students`, user.uid), {
        status: 'UnPaid',
        amount: course.price,
        dateRegistered: Timestamp.now(),
        fullName: user.displayName,
        invoiceNumber: nanoid(),
        phoneNumber: user.phoneNumber,
        email: user.email,
      } as CourseUserType);
      await setDoc(doc(db, `users/${user.uid}/myCourses`, course.id), course);
      setLoading(false);
      toast.success('student added');
      setOpen(false);
    } catch (err) {
      toast.error('something went wrong');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(save)}>
      {loading && <LoadingBlur />}

      <Select
        label='Select Student'
        required
        ref={ref}
        triggerStyle={{ width: '100%' }}
        value={selected}
        onValueChange={onChange}
        options={options}
        placeholder='Select Student'
        error={errors.id?.message}
      />

      {/* <h3>Student info</h3> */}

      <InputTemp
        label='Full Name'
        // placeholder='Student Name'
        value={user?.displayName}
        disabled
      />
      <InputTemp
        label='Email'
        // placeholder='Student Email'
        value={user?.email}
        disabled
      />
      <InputTemp
        label='Phone number'
        // placeholder='+1234567890'
        value={user?.phoneNumber}
        disabled
      />
      <InputTemp
        label='Country'
        // placeholder='Syria'
        value={user?.country}
        disabled
      />
      <Controller
        name='experienceLevel'
        control={control}
        render={({ field: { value, onChange } }) => (
          <Select
            label='Experience level'
            placeholder='Select Level'
            triggerStyle={{ width: '100%' }}
            value={value}
            onValueChange={onChange}
            options={[
              { item: 'Beginner', value: 'beginner' },
              { item: 'Intermediate', value: 'intermediate' },
              { item: 'Advanced', value: 'advanced' },
            ]}
          />
        )}
      />
      <InputTemp
        label='Education level'
        // placeholder='Bachelor'
        value={user?.educationLevel}
        disabled
      />

      <div className='reg-modal-form-btns'>
        <button type='button' className='red' onClick={() => setOpen(false)}>
          Cancel
        </button>
        <button className='main' type='submit' disabled={false}>
          Save
        </button>
      </div>
    </form>
  );
};



const NewStudent = ({
  course,
  setLoading,
  setOpen,
}: {
  course: CourseType;
  setLoading: (state: boolean) => void;
  setOpen: (state: boolean) => void;
}) => {
  const {
    handleSubmit,
    register,
    control,
    // reset,
    formState: { isDirty },
  } = useForm<FormValues>({
    defaultValues: {},
  });

  const addStudent = async (values: FormValues) => {
    console.log(values, "rave")
    if (!course) return;

    try {
      setLoading(true);
      const isEmail = !(
        await getDocs(
          query(
            collection(db, `userCourses/${course.id}/students`),
            where('email', '==', values.email)
          )
        )
      ).empty;
      if (isEmail) {
        setLoading(false);
        toast('user with email already registered');
        return;
      }
      const userId = nanoid();
      await setDoc(doc(db, 'users', userId), {
        country: values.country,
        displayName: values.fullName,
        educationLevel: values.educationLevel,
        email: values.email,
        uid: userId,
        phoneNumber: values.phoneNumber,
        dateRegistered: Timestamp.now(),
        status: 'Inactive',
      } as Omit<UserType, 'id'>);
      await setDoc(doc(db, `userCourses/${course.id}/students`, userId), {
        ...values,
        status: 'UnPaid',
        amount: course.price,
        dateRegistered: Timestamp.now(),
        id: userId,
        invoiceNumber: nanoid(),
        fullName: values.fullName,
        phoneNumber: values.phoneNumber,
        email: values.email,
      } as CourseUserType);

      await setDoc(doc(db, `users/${userId}/myCourses`, course.id), course);
      setLoading(false);
      toast.success('student added');
      setOpen(false);
    } catch (err) {
      toast.error('something went wrong');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(addStudent)}>
      <h3>Student info</h3>
      <InputTemp
        label='Full Name'
        placeholder='Eid Hamouda'
        {...register('fullName')}
      />
      <InputTemp
        label='Email'
        placeholder='test@test.com'
        {...register('email')}
      />
      <InputTemp
        label='Phone number'
        placeholder='+1234567890'
        {...register('phoneNumber')}
      />
      <InputTemp label='Country' placeholder='Syria' {...register('country')} />
      <Controller
        name='experienceLevel'
        control={control}
        render={({ field: { value, onChange } }) => (
          <Select
            label='Experience level'
            placeholder='Select Level'
            triggerStyle={{ width: '100%' }}
            value={value}
            onValueChange={onChange}
            options={[
              { item: 'Beginner', value: 'beginner' },
              { item: 'Intermediate', value: 'intermediate' },
              { item: 'Advanced', value: 'advanced' },
            ]}
          />
        )}
      />
      <InputTemp
        label='Education level'
        placeholder='Bachelor'
        {...register('educationLevel')}
      />

      <div className='reg-modal-form-btns'>
        <button type='button' className='red' onClick={() => setOpen(false)}>
          Cancel
        </button>
        <button className='main' type='submit' disabled={!isDirty}>
          Save
        </button>
      </div>
    </form>
  );
};

export const CertificateModal = ({
  open,
  serverCertificate,
  close,
}: {
  open: CertificateType | null;
  close: () => void;
  serverCertificate: {
    id: string | null | undefined;
    courseId: string;
  } | null;
}) => {
  const [loading, setLoading] = useState(false);

  const generateCertificate = async () => {
    if (!open) return;
    try {
      setLoading(true);
      const id = nanoid();
      await setDoc(
        doc(db, `allCertificates/${open.courseId}/certificates/${id}`),
        removeUndefined({ ...open, id })
      );
      await setDoc(
        doc(db, `userCourses/${open.courseId}/students`, open.studentId),
        {
          certificateId: id,
        },
        { merge: true }
      );
      setLoading(false);
      toast.success('receipt generated');
      close();
    } catch (err) {
      setLoading(false);
      toast.error('something went wrong');
    }
  };

  const [data, setData] = useState<CertificateType>();

  useEffect(() => {
    if (!serverCertificate) return;

    (async () => {
      setLoading(true);
      const res = await getDoc(
        doc(
          db,
          `allCertificates/${serverCertificate.courseId}/certificates`,
          `${serverCertificate.id}`
        )
      );
      setData(res.data() as any);
      setLoading(false);
    })();
  }, [serverCertificate]);

  const printRef = useRef(null);

  return (
    <Root
      open={!!(open || serverCertificate)}
      onOpenChange={() => {
        setData(undefined);
        close();
      }}>
      <Portal>
        <Overlay className='modal-overlay' />
        {loading && <LoadingBlur />}
        <Content className='reg-students-cert-modal'>
          {(data || open) && (
            <Certificate
              details={{
                ...((data as any) || open),
              }}
              ref={printRef}
            />
          )}

          {!data && (
            <div className='button'>
              {/* <button className='btn-sub'>Add Instructor</button> */}
              <button onClick={generateCertificate} className='btn-main'>
                Save
              </button>
            </div>
          )}
          {data && (
            <div className='button'>
              <ReactToPrint
                trigger={() => <button className='btn-main'>Download</button>}
                content={() => printRef.current}
              />
            </div>
          )}
        </Content>
      </Portal>
    </Root>
  );
};

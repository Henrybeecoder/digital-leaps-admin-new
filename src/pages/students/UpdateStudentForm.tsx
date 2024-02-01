import { ZodError, ZodIssue, z } from 'zod';
import { InputTemp } from '../../components/Input';
import { UserType } from '../../../types';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../utils/fire';
import toast from 'react-hot-toast';
import { updateEmail, updatePassword } from 'firebase/auth';
import { useState } from 'react';
import { LoadingBlur } from '../../components/Loading';

const emailS = z.string().email().optional();
const passwordS = z.string().min(6, 'password too short');

const UpdateStudentForm = ({ student }: { student: UserType }) => {
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState(student.email);
  // const [password, setPassword] = useState('');

  const [errors, setErrors] = useState<{
    email?: ZodIssue;
    // password?: ZodIssue;
  }>();

  const updateStudent = async () => {
    try {
      setLoading(true);
      if (email !== student.email && !errors?.email) {
        const userDocRef = doc(db, 'users', student.id);
        //   await updateEmail(,email);
        await updateDoc(userDocRef, { email });
        setEmail(student.email);
      }
      // if (password && password.length > 0 && !errors?.password) {
      //   // await updatePassword()
      // }
      toast.success('updated');
      setLoading(false);
    } catch (err) {
      toast.error('something went wrong');
      setLoading(false);
    }
  };

  return (
    <section>
      {loading && <LoadingBlur />}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px' }}>
        <InputTemp
          label='Email'
          value={email}
          onChange={async (e) => {
            setEmail(e.target.value);
            try {
              const valid = await emailS.parseAsync(e.target.value);
              if (valid) setErrors((prev) => ({ ...prev, email: undefined }));
            } catch (err) {
              const error = err as ZodError;
              setErrors((prev) => ({ ...prev, email: error.errors[0] }));
            }
          }}
          error={errors?.email?.message}>
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
        </InputTemp>

        <div>
          <button
            className='btn-check'
            type='submit'
            disabled={student.email === email || !!errors?.email}
            onClick={updateStudent}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='18'
              height='18'
              viewBox='0 0 12 12'
              fill='none'>
              <path
                d='M10 3L4.5 8.5L2 6'
                stroke='white'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </button>
        </div>
      </div>

      {/* <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '20px',
          margin: '10px 0',
        }}>
        <InputTemp
          label='Password'
          type='password'
          value={password}
          onChange={async (e) => {
            setPassword(e.target.value);
            try {
              const valid = await passwordS.parseAsync(e.target.value);
              if (valid)
                setErrors((prev) => ({ ...prev, password: undefined }));
            } catch (err) {
              const error = err as ZodError;
              setErrors((prev) => ({ ...prev, password: error.errors[0] }));
            }
          }}
          error={errors?.password?.message}>
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
        </InputTemp>
        <div>
          <button
            className='btn-check'
            type='submit'
            disabled={!!errors?.password}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='18'
              height='18'
              viewBox='0 0 12 12'
              fill='none'>
              <path
                d='M10 3L4.5 8.5L2 6'
                stroke='white'
                stroke-width='2'
                stroke-linecap='round'
                stroke-linejoin='round'
              />
            </svg>
          </button>
        </div>
      </div> */}
    </section>
  );
};

export default UpdateStudentForm;

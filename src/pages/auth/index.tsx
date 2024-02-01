import { useForm } from 'react-hook-form';
import logo from '../../assets/Logo-sm.png';
import { InputTemp } from '../../components/Input';
import {
  collection,
  getDocsFromServer,
  query,
  where,
} from 'firebase/firestore';
import { auth, db } from '../../utils/fire';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { useState } from 'react';
import { LoadingBlur } from '../../components/Loading';

const loginForm = z.object({
  email: z.string().email().min(1),
  password: z.string().min(6, ''),
});

type LoginValues = z.infer<typeof loginForm>;

const AuthPage = () => {
  const [loading, setLoading] = useState(false);

  const [showPassword, setSP] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginValues>({ resolver: zodResolver(loginForm) });

  const login = async ({ email, password }: LoginValues) => {
    setLoading(true);
    try {
      const isUser = await getDocsFromServer(
        query(collection(db, 'users'), where('email', '==', email))
      );
      if (isUser.empty) {
        toast('Could not find an account with this email');
        setLoading(false);
        return;
      }

      const userdata = isUser.docs[0].data();
      if (userdata?.role !== 'admin') {
        toast.error('Permission denied');
        setLoading(false);
        return;
      }

      const { user } = await signInWithEmailAndPassword(auth, email, password);

      toast.success(`logged in as ${user?.displayName || user.email}`);
      setLoading(false);
    } catch (err) {
      const error = err as FirebaseError;
      toast.error(error.code);
      setLoading(false);
    }
  };

  return (
    <div className='auth-page-container'>
      {loading && <LoadingBlur />}
      <div className='auth-container'>
        <img src={logo} />

        <form onSubmit={handleSubmit(login)} className='login-form'>
          <p className='login-error-text'>
            {errors.email || errors.password ? 'Invalid login details' : ''}
          </p>
          <InputTemp
            label='Email'
            {...register('email')}
            error={errors.email?.message}
          />
          <InputTemp
            label='Password'
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            icon='right'>
            <button
              type='button'
              style={{ display: 'flex' }}
              onClick={() => setSP((x) => !x)}>
              {!showPassword ? (
                <svg
                  width='22px'
                  height='22px'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M2 2L22 22'
                    stroke='#000000'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M6.71277 6.7226C3.66479 8.79527 2 12 2 12C2 12 5.63636 19 12 19C14.0503 19 15.8174 18.2734 17.2711 17.2884M11 5.05822C11.3254 5.02013 11.6588 5 12 5C18.3636 5 22 12 22 12C22 12 21.3082 13.3317 20 14.8335'
                    stroke='#000000'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M14 14.2362C13.4692 14.7112 12.7684 15.0001 12 15.0001C10.3431 15.0001 9 13.657 9 12.0001C9 11.1764 9.33193 10.4303 9.86932 9.88818'
                    stroke='#000000'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              ) : (
                <svg
                  width='22px'
                  height='22px'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'>
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M12.0001 5.25C9.22586 5.25 6.79699 6.91121 5.12801 8.44832C4.28012 9.22922 3.59626 10.0078 3.12442 10.5906C2.88804 10.8825 2.70368 11.1268 2.57736 11.2997C2.51417 11.3862 2.46542 11.4549 2.43187 11.5029C2.41509 11.5269 2.4021 11.5457 2.393 11.559L2.38227 11.5747L2.37911 11.5794L2.10547 12.0132L2.37809 12.4191L2.37911 12.4206L2.38227 12.4253L2.393 12.441C2.4021 12.4543 2.41509 12.4731 2.43187 12.4971C2.46542 12.5451 2.51417 12.6138 2.57736 12.7003C2.70368 12.8732 2.88804 13.1175 3.12442 13.4094C3.59626 13.9922 4.28012 14.7708 5.12801 15.5517C6.79699 17.0888 9.22586 18.75 12.0001 18.75C14.7743 18.75 17.2031 17.0888 18.8721 15.5517C19.72 14.7708 20.4039 13.9922 20.8757 13.4094C21.1121 13.1175 21.2964 12.8732 21.4228 12.7003C21.4859 12.6138 21.5347 12.5451 21.5682 12.4971C21.585 12.4731 21.598 12.4543 21.6071 12.441L21.6178 12.4253L21.621 12.4206L21.6224 12.4186L21.9035 12L21.622 11.5809L21.621 11.5794L21.6178 11.5747L21.6071 11.559C21.598 11.5457 21.585 11.5269 21.5682 11.5029C21.5347 11.4549 21.4859 11.3862 21.4228 11.2997C21.2964 11.1268 21.1121 10.8825 20.8757 10.5906C20.4039 10.0078 19.72 9.22922 18.8721 8.44832C17.2031 6.91121 14.7743 5.25 12.0001 5.25ZM4.29022 12.4656C4.14684 12.2885 4.02478 12.1311 3.92575 12C4.02478 11.8689 4.14684 11.7115 4.29022 11.5344C4.72924 10.9922 5.36339 10.2708 6.14419 9.55168C7.73256 8.08879 9.80369 6.75 12.0001 6.75C14.1964 6.75 16.2676 8.08879 17.8559 9.55168C18.6367 10.2708 19.2709 10.9922 19.7099 11.5344C19.8533 11.7115 19.9753 11.8689 20.0744 12C19.9753 12.1311 19.8533 12.2885 19.7099 12.4656C19.2709 13.0078 18.6367 13.7292 17.8559 14.4483C16.2676 15.9112 14.1964 17.25 12.0001 17.25C9.80369 17.25 7.73256 15.9112 6.14419 14.4483C5.36339 13.7292 4.72924 13.0078 4.29022 12.4656ZM14.25 12C14.25 13.2426 13.2427 14.25 12 14.25C10.7574 14.25 9.75005 13.2426 9.75005 12C9.75005 10.7574 10.7574 9.75 12 9.75C13.2427 9.75 14.25 10.7574 14.25 12ZM15.75 12C15.75 14.0711 14.0711 15.75 12 15.75C9.92898 15.75 8.25005 14.0711 8.25005 12C8.25005 9.92893 9.92898 8.25 12 8.25C14.0711 8.25 15.75 9.92893 15.75 12Z'
                    fill='#080341'
                  />
                </svg>
              )}
            </button>
          </InputTemp>

          <button className='btn-main'>Login</button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;

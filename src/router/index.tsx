import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Header from '../layout/Header';
import Sidebar from '../layout/Sidebar';
import ErrorPage from '../pages/ErrorPage';
import { CoursesRouter } from './courses';
import StudentsRouter from './students';
import CouponsRouter from './coupons';
import BlogRouter from './blog';
import MentorRouter from './mentor';
import MessagesRouter from './messages';
import '../styles/layout.css';
import { ReactNode, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../utils/fire';
import { useStore } from '../store';
import { Loading } from '../components/Loading';
import { FirebaseError } from 'firebase/app';
import AuthPage from '../pages/auth';
import EnrollmentRequests from '../pages/EnrollmentRequests';
import SubscriptionRouter from './subscriptions';

const Auth = ({ children }: { children: ReactNode }) => {
  const { user, loading, error } = useStore((state) => state.auth);
  const setAuthState = useStore((state) => state.setAuthState);

  useEffect(() => {
    setAuthState({ user: null, error: undefined, loading: true });
    const unsub = onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          setAuthState({ user, error: undefined, loading: false });
        } else {
          setAuthState({ user: null, error: undefined, loading: false });
        }
      },
      (err) => {
        const error = err as FirebaseError;
        setAuthState({ user: null, error, loading: false });
      }
    );

    return () => {
      unsub();
    };
  }, []);

  if (error) return <>something went wrong</>;

  if (loading) return <Loading />;

  // if (!user) return <AuthPage />;

  return <>{children}</>;
};

const Root = () => {
  return (
    <Auth>
      <div className='layout-container'>
        <Sidebar />
        <div className='layout-page-container'>
          <Header />
          <Outlet />
        </div>
      </div>
    </Auth>
  );
};

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Root />} errorElement={<ErrorPage />}>
          <Route index element={<Dashboard />} />
          <Route path='/courses/*' element={<CoursesRouter />} />
          <Route path='/students/*' element={<StudentsRouter />} />
          <Route path='/coupons/*' element={<CouponsRouter />} />
          <Route path='/blogs/*' element={<BlogRouter />} />
          <Route path='/mentors/*' element={<MentorRouter />} />
          <Route path='/messages/*' element={<MessagesRouter />} />
          <Route path='/subscriptions/*' element={<SubscriptionRouter />} />
          <Route path='/enrollment-requests' element={<EnrollmentRequests />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;

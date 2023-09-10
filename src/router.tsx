import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import Header from './sect/Header';
import Sidebar from './sect/sidebar';
import ErrorPage from './pages/errorPage';

const Root = () => {
  return (
    <div className='md:flex h-screen'>
      <Sidebar />
      <div className='w-full md:w-[86%] md:overflow-y-auto px-5 md:px-10 py-4'>
        <Header />
        <Outlet />
      </div>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Dashboard />,
      },
    ],
  },
]);

const Router = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default Router;

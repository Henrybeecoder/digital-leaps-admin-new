import { NavLink } from 'react-router-dom';
import logo from '../assets/Logo.png';
import {
  BlogSvg,
  CouponSvg,
  CourseSvg,
  HomeSvg,
  MentorSvg,
  MessageSvg,
  StudentSvg,
} from '../components/Svg';
import { ReactNode } from 'react';
import useMediaQuery from '../utils/hooks/useMediaquery';
import '../styles/layout.css';

const Sidebar = () => {
  const matches = useMediaQuery('(min-width: 800px)');

  return (
    <>
      {matches && (
        <div className='sidebar'>
          <div className='sidebar-logo'>
            <img src={logo} width={120} />
          </div>

          <div className='links-section'>
            <LinkComponent text='Home' href='/'>
              <HomeSvg />
            </LinkComponent>

            <LinkComponent text='Courses' href='/courses'>
              <CourseSvg />
            </LinkComponent>

            <LinkComponent text='Students' href='/students'>
              <StudentSvg />
            </LinkComponent>

            <LinkComponent text='Requests' href='/enrollment-requests'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'>
                <path
                  d='M22 6.00049C22 4.90049 21.1 4.00049 20 4.00049H4.00003C2.90003 4.00049 2.00003 4.90049 2.00003 6.00049V18.0005C2.00003 19.1005 2.90003 20.0005 4.00003 20.0005H20C21.1 20.0005 22 19.1005 22 18.0005V6.00049ZM20 6.00049L12 11.0005L4.00003 6.00049H20ZM20 18.0005H4.00003V8.00049L12 13.0005L20 8.00049V18.0005Z'
                  fill='#22319E'
                />
              </svg>
            </LinkComponent>

            <LinkComponent text='Subsciptions' href='/subscriptions'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-6 h-6'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25'
                />
              </svg>
            </LinkComponent>

            <LinkComponent text='Blog' href='/blogs'>
              <BlogSvg />
            </LinkComponent>
            <LinkComponent text='Coupons' href='/coupons'>
              <CouponSvg />
            </LinkComponent>

            <LinkComponent text='Mentors' href='/mentors'>
              <MentorSvg />
            </LinkComponent>
            <LinkComponent text='Messages' href='/messages'>
              <MessageSvg />
            </LinkComponent>
          </div>
        </div>
      )}
    </>
  );
};

const LinkComponent = ({
  children,
  text,
  href,
}: {
  children: ReactNode;
  text: string;
  href: string;
}) => {
  return (
    <NavLink to={href} className={'relative'}>
      {({ isActive }) => (
        <>
          {isActive && (
            <svg
              className='nav-svg-top'
              width='31'
              height='32'
              viewBox='0 0 31 32'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'>
              <path
                id='Vector 1'
                d='M0.5 30C24.1 30 30 10 30 0H31.5V32H0.5V30Z'
                fill='white'
              />
            </svg>
          )}
          <div
            className={`nav-container ${
              isActive ? 'sm-link-button-active' : 'sm-link-button-inactive'
            }`}>
            {children}
            <span>{text}</span>
          </div>
          {isActive && (
            <svg
              className='nav-svg-buttom'
              width='31'
              height='32'
              viewBox='0 0 31 32'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'>
              <path
                id='Vector 2'
                d='M0.5 2C24.1 2 30 22 30 32H31.5V0H0.5V2Z'
                fill='white'
              />
            </svg>
          )}
        </>
      )}
    </NavLink>
  );
};

export default Sidebar;

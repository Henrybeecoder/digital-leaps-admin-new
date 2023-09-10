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
import useMediaQuery from '../../utils/hooks/useMediaquery';

const Sidebar = () => {
  const matches = useMediaQuery('(min-width: 800px)');

  return (
    <>
      {matches && (
        <div className='bg-mainblue w-[14%] pt-7 h-full'>
          <div className='px-7 mx-auto w-fit'>
            <img src={logo} width={120} className='' />
          </div>

          <div className='flex flex-col gap-2 mt-16 pl-7'>
            <LinkComponent text='Home' href='/'>
              <HomeSvg />
            </LinkComponent>

            <LinkComponent text='Courses' href='/courses'>
              <CourseSvg />
            </LinkComponent>

            <LinkComponent text='Students' href='/students'>
              <StudentSvg />
            </LinkComponent>

            <LinkComponent text='Blog' href='/blog'>
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
              className='absolute -right-[1px] -top-[29px]'
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
            className={`flex items-center gap-2 py-3 px-7 rounded-l-[20px] font-semibold ${
              isActive
                ? 'bg-white text-mainblue fill-white stroke-mainblue'
                : 'stroke-white fill-mainblue'
            }`}>
            {children}
            <span>{text}</span>
          </div>
          {isActive && (
            <svg
              className='absolute -right-[1px] -bottom-[29px]'
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

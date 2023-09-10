import { formatDate } from '../../utils/helper';
import useMediaQuery from '../../utils/hooks/useMediaquery';
import arrowDown from '../assets/icons/icon-park-solid_down-one.svg';
import notificationIcon from '../assets/icons/iconamoon_notification-fill.svg';
import {
  Root,
  Trigger,
  Portal,
  Overlay,
  Content,
} from '@radix-ui/react-dialog';
import { Bars3Icon } from '@heroicons/react/24/solid';
import logo from '../assets/Logo.png';
import logoSm from '../assets/Logo-sm.png';
import {
  BlogSvg,
  CouponSvg,
  CourseSvg,
  HomeSvg,
  MentorSvg,
  MessageSvg,
  StudentSvg,
} from '../components/Svg';
import { ReactNode, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import lockIcon from '../assets/icons/mdi_password-outline.svg';
import logoutIcon from '../assets/icons/material-symbols_logout.svg';

const Header = () => {
  const matches = useMediaQuery('(min-width: 800px)');

  const [open, setOpen] = useState(false);
  const [openS, setOpenS] = useState(false);

  return (
    <div className='flex py-1.5 md:pt-0 md:pb-2 items-center gap-3 md:gap-4 mb-8 border-b pb-3 border-[#c3c3c39d]'>
      {!matches && (
        <Root open={open} onOpenChange={setOpen}>
          <Trigger className=''>
            <Bars3Icon
              width={35}
              strokeWidth={0.8}
              className='fill-boldblue stroke-boldblue'
            />
          </Trigger>
          <Portal>
            <Overlay className='bg-black/50 z-20 inset-0 fixed' />
            <Content
              className={`pointer-events-auto z-30 fixed top-0 bottom-0 left-0 w-[68%] overflow-hidden
         bg-mainblue flex flex-col p-3`}>
              <div className='px-7 py-4 mx-auto w-fit mt-2'>
                <img src={logo} width={140} className='' />
              </div>

              <div className='flex flex-col gap-2 mt-8 px-4'>
                <LinkComponent
                  onClose={() => setOpen(false)}
                  text='Home'
                  href='/'>
                  <HomeSvg />
                </LinkComponent>

                <LinkComponent
                  onClose={() => setOpen(false)}
                  text='Courses'
                  href='/courses'>
                  <CourseSvg />
                </LinkComponent>

                <LinkComponent
                  onClose={() => setOpen(false)}
                  text='Students'
                  href='/students'>
                  <StudentSvg />
                </LinkComponent>

                <LinkComponent
                  onClose={() => setOpen(false)}
                  text='Blog'
                  href='/blog'>
                  <BlogSvg />
                </LinkComponent>
                <LinkComponent
                  onClose={() => setOpen(false)}
                  text='Coupons'
                  href='/coupons'>
                  <CouponSvg />
                </LinkComponent>

                <LinkComponent
                  onClose={() => setOpen(false)}
                  text='Mentors'
                  href='/mentors'>
                  <MentorSvg />
                </LinkComponent>
                <LinkComponent
                  onClose={() => setOpen(false)}
                  text='Messages'
                  href='/messages'>
                  <MessageSvg />
                </LinkComponent>
              </div>
            </Content>
          </Portal>
        </Root>
      )}
      {!matches ? (
        <div className='flex-1'>
          <img alt='logo' src={logoSm} width={80} />
        </div>
      ) : (
        <div className='md:flex-1 font-century_gothic'>
          <p className='text-[#1393C9] text-[20px] md:text-[25px] font-bold leading-6'>
            16:04 PM
          </p>
          <p className='text-textblack text-[17px] md:text-[21px]'>
            {formatDate(new Date())}
          </p>
        </div>
      )}

      <img src={notificationIcon} width={matches ? 26 : 24} />

      <div className='relative'>
        <Root open={openS} onOpenChange={setOpenS}>
          <Trigger className='flex items-center gap-2 bg-boldblue py-1.5 px-5 rounded-[5px] text-xs md:text-[13px]'>
            <span>Eid Hamouda</span>
            <img src={arrowDown} width={20} />
          </Trigger>

          <Content className='absolute top-8 bg-white shadow-md rounded-b-lg w-full py-1'>
            <button
              className='flex gap-1 text-black text-xs md:text-sm p-2 items-center tracking-tighter'
              onClick={() => {
                setOpenS(false);
              }}>
              <img src={lockIcon} width={18} />
              <span>Change Password</span>
            </button>

            <button
              className='flex gap-1 text-[#BC2A2A] text-xs md:text-sm p-2 items-center'
              onClick={() => {
                setOpenS(false);
              }}>
              <img src={logoutIcon} width={18} />
              <span>Logout</span>
            </button>
          </Content>
        </Root>
      </div>
    </div>
  );
};

const LinkComponent = ({
  children,
  text,
  href,
  onClose,
}: {
  children: ReactNode;
  text: string;
  href: string;
  onClose: () => void;
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = location.pathname === href;

  return (
    <button
      className={`flex items-center gap-2 py-4 px-7 rounded-[12px] font-semibold ${
        isActive
          ? 'bg-white text-mainblue fill-white stroke-mainblue'
          : 'stroke-white fill-mainblue'
      }`}
      onClick={() => {
        !isActive && navigate(href);
        onClose();
      }}>
      {children}
      <span className={`${isActive ? 'text-mainblue' : 'text-white'}`}>
        {text}
      </span>
    </button>
  );
};

export default Header;

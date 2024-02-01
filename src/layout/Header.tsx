import { formatDate, limitText } from '../utils/helper';
import useMediaQuery from '../utils/hooks/useMediaquery';
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
import '../styles/layout.css';
import { useStore } from '../store';
import { auth } from '../utils/fire';

const Header = () => {
  const matches = useMediaQuery('(min-width: 800px)');

  const [open, setOpen] = useState(false);
  const [openS, setOpenS] = useState(false);

  const { user } = useStore((s) => s.auth);

  const logout = async () => {
    await auth.signOut();
    setOpenS(false);
  };

  return (
    <div className='header-container'>
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
                <img src={logo} width={90} className='' />
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
                  text='Requests'
                  href='/enrollment-requests'>
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

                <LinkComponent
                  text='Subsciptions'
                  href='/subscriptions'
                  onClose={() => setOpen(false)}>
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

                <LinkComponent
                  onClose={() => setOpen(false)}
                  text='Blog'
                  href='/blogs'>
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
        <div className='header-datetime'>
          <h4>
            {new Date().toLocaleTimeString('en', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </h4>
          <h5>{formatDate(new Date())}</h5>
        </div>
      )}

      <img src={notificationIcon} width={matches ? 26 : 24} />

      <div className='relative'>
        <Root open={openS} onOpenChange={setOpenS}>
          <Trigger className='header-drop-down-trigger'>
            <span>
              {matches
                ? limitText(user?.displayName || user?.email)
                : limitText(user?.displayName || user?.email, 15)}
            </span>
            <img src={arrowDown} width={20} />
          </Trigger>

          <Content className='header-drop-down-container'>
            <button
              className='header-drop-down-btn-cp'
              onClick={() => {
                setOpenS(false);
              }}>
              <img src={lockIcon} width={18} />
              <span>Change Password</span>
            </button>

            <button className='header-drop-down-btn-l' onClick={logout}>
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
      className={`sm-link-button ${
        isActive ? 'sm-link-button-active ' : 'sm-link-button-inactive'
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

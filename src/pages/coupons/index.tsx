import { formatDate, limitText } from '../../utils/helper';
import useMediaQuery from '../../utils/hooks/useMediaquery';
import studentIcon from '../../assets/icons/Student_icon.png';
import calenderIcon from '../../assets/icons/uiw_date.svg';
import cashIcon from '../../assets/icons/ph_money-light.svg';
import emptyStateImg from '../../assets/Frame.svg';
import { LoadingBlur } from '../../components/Loading';
import { CouponType } from '../../../types';
import Pagination from '../../components/Pagination';
import { CouponFormS } from '../../utils/z/course';
import { useState } from 'react';
import { Overlay, Portal, Root } from '@radix-ui/react-dialog';
import CouponForm from './CouponForm';
import ChangeStatus from '../../components/ChangeStatus';
import squareOutlineIcon from '../../assets/icons/Checkbox.svg';
import { useGetCoupons } from '../../utils/hooks/useGetCoupons';
import ListHeader from '../../components/ListHeader';

const Coupons = () => {
  const matches = useMediaQuery('(min-width: 800px)');

  const [filter, setFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const { coupons, loading, onSearch, next, nextDisabled, prev, prevDisabled } =
    useGetCoupons(filter);

  const [open, setOpen] = useState<Partial<CouponFormS> | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(false);

  return (
    <>
      {(loading || loadingStatus) && <LoadingBlur />}
      <Root open={!!open} onOpenChange={() => setOpen(null)}>
        <Portal>
          <Overlay className='modal-overlay' />
          <CouponForm open={open} setOpen={setOpen} />
        </Portal>
      </Root>

      <ListHeader
        heading='Coupons'
        subHeading='Manage your coupons details'
        input={{ onSearch, placeholder: 'Search by coupon id' }}
        button={{ name: 'New Coupon', onClick: () => setOpen({ id: 'new' }) }}>
        <div className=''>
          <button
            className={`${filter === 'All' ? 'active' : ''}`}
            onClick={() => filter !== 'All' && setFilter('All')}>
            All
          </button>
          <button
            className={`${filter === 'Active' ? 'active' : ''}`}
            onClick={() => filter !== 'Active' && setFilter('Active')}>
            Active
          </button>
          <button
            className={`${filter === 'Inactive' ? 'active' : ''}`}
            onClick={() => filter !== 'Inactive' && setFilter('Inactive')}>
            Inactive
          </button>
        </div>
      </ListHeader>

      {coupons.length < 1 ? (
        <div className='empty-screen'>
          <img alt='empty-category' src={emptyStateImg} />
          <p>There are no coupons added</p>
        </div>
      ) : (
        <>
          {!matches ? (
            <div className='list-grid gap-5'>
              {coupons.map((x) => (
                <div key={x.id} className='sm-reg-details'>
                  <div>
                    {/* <input type='checkbox' /> */}
                    <h3>{limitText(x.couponId, 11)}</h3>
                    <div>
                      <h5
                        className={`${
                          x.status === 'Active'
                            ? 'reg-status-paid'
                            : 'reg-status-unpaid'
                        }`}>
                        {x.status}
                      </h5>
                    </div>
                  </div>
                  <div>
                    <img className='student-icon' src={squareOutlineIcon} />
                    <h3>{`${x.redemption.length}/${x.redemptionLimit}`}</h3>
                  </div>
                  <div>
                    <img className='student-icon' src={calenderIcon} />
                    <h3>{formatDate(x.startDate.toDate())}</h3>
                  </div>

                  <div className='table-buttons-container'>
                    <div className='flex-between'>
                      <div style={{ justifyContent: 'flex-start' }}>
                        <img className='student-icon' src={calenderIcon} />
                        <h3>{formatDate(x.endDate.toDate())}</h3>
                      </div>
                      <button
                        type='button'
                        // disabled={x.status === 'Active'}
                        className='btn-primary-outline'
                        onClick={() =>
                          setOpen({
                            id: x.id,
                            startDate: x.startDate.toDate(),
                            endDate: x.endDate.toDate(),
                            value: x.value.toString(),
                            redemptionLimit: x.redemptionLimit.toString(),
                          })
                        }>
                        Edit
                      </button>
                    </div>

                    <div className='flex-between'>
                      <div style={{ justifyContent: 'flex-start' }}>
                        <img className='student-icon' src={cashIcon} />
                        <h3 style={{ fontWeight: 600 }}>${x.value}</h3>
                      </div>
                      <ChangeStatus
                        id={x.id}
                        prevStatus={x.status}
                        field='coupons'
                        setLoadingStatus={setLoadingStatus}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='table-container'>
              <table className=''>
                <thead>
                  <tr>
                    <th>Coupon ID</th>
                    <th>REGISTRATION DATE</th>
                    <th>End Date</th>
                    <th>STATUS</th>
                    <th>VALUE</th>
                    <th>REDEMPTION</th>
                    <th />
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((x) => (
                    <tr key={x.id}>
                      {/* <td>
                    <input type='checkbox' />
                  </td> */}
                      <td>{limitText(x.couponId, 11)}</td>
                      <td style={{ letterSpacing: '2px' }}>
                        {formatDate(x.startDate.toDate())}
                      </td>

                      <td style={{ letterSpacing: '2px' }}>
                        {formatDate(x.endDate.toDate())}
                      </td>
                      <td>
                        <p
                          className={`${
                            x.status === 'Active'
                              ? 'reg-status-paid'
                              : 'reg-status-unpaid'
                          }`}>
                          {x.status}
                        </p>
                      </td>
                      <td style={{ fontWeight: 600 }}>${x.value}</td>
                      <td
                        style={{
                          fontWeight: 600,
                        }}>{`${x.redemption.length}/${x.redemptionLimit}`}</td>
                      <td className=''>
                        <div className='table-buttons-container'>
                          <button
                            type='button'
                            className='btn-primary-outline'
                            onClick={() =>
                              setOpen({
                                id: x.id,
                                startDate: x.startDate.toDate(),
                                endDate: x.endDate.toDate(),
                                value: x.value.toString(),
                                redemptionLimit: x.redemptionLimit.toString(),
                              })
                            }>
                            Edit
                          </button>

                          <ChangeStatus
                            id={x.id}
                            prevStatus={x.status}
                            field='coupons'
                            setLoadingStatus={setLoadingStatus}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
      <Pagination
        prev={prev}
        next={next}
        prevDisabled={prevDisabled}
        nextDisabled={nextDisabled}
      />
    </>
  );
};

export default Coupons;

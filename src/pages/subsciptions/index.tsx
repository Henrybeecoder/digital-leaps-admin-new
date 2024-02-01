import { useNavigate } from 'react-router-dom';
import ListHeader, { PageHeader } from '../../components/ListHeader';
import useMediaQuery from '../../utils/hooks/useMediaquery';
import { useState } from 'react';
import emptyStateImg from '../../assets/Frame.svg';
import Pagination from '../../components/Pagination';
import { formatDate, limitText } from '../../utils/helper';
import calenderIcon from '../../assets/icons/uiw_date.svg';
import studentIcon from '../../assets/icons/Student_icon.png';
import { LoadingBlur } from '../../components/Loading';
import { useGetSubscriptions } from '../../utils/hooks/useGetSubscriptions';

const Subscriptions = () => {
  const navigate = useNavigate();
  const matches = useMediaQuery('(min-width: 800px)');

  const [open, setOpen] = useState<any | null>(null);

  const [loadingStatus, setLoadingStatus] = useState(false);

  const { subscriptions, loading, next, nextDisabled, prev, prevDisabled } =
    useGetSubscriptions();

  return (
    <>
      {loading && <LoadingBlur />}
      {/* <subscription open={open} setOpen={setOpen} /> */}
      <PageHeader
        heading='Email Subscriptions'
        subHeading='Manage your email subscriptions '
      />

      {subscriptions.length < 1 ? (
        <div className='empty-screen'>
          <img alt='empty-category' src={emptyStateImg} />
          <p>There are no subscriptions</p>
        </div>
      ) : (
        <>
          {!matches ? (
            <div className='gap-5 list-grid'>
              {subscriptions.map((subscription) => (
                <div key={subscription.id} className='sm-reg-details'>
                  <div>
                    {/* <img className='subscription-icon' src={subscriptionIcon} /> */}
                    {/* <h3>{subscription.subscriptionId}</h3> */}
                  </div>

                  <div>
                    <img className='subscription-icon' src={studentIcon} />
                    <h3>{subscription.email}</h3>
                  </div>
                  <div className='table-buttons-container'>
                    <div className='flex-between'>
                      <div style={{ justifyContent: 'flex-start' }}>
                        <img className='subscription-icon' src={calenderIcon} />
                        <h3>
                          {formatDate(subscription.dateSubscribed?.toDate())}
                        </h3>
                      </div>

                      {/* <button
                        onClick={() => setOpen(subscription)}
                        type='button'
                        className='btn-activate'>
                        View Details
                      </button> */}
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
                    <th>Email</th>
                    <th>Date Subscibed</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((subscription) => (
                    <tr key={subscription.id}>
                      <td>{subscription.email}</td>
                      <td style={{ letterSpacing: '2px' }}>
                        {formatDate(subscription.dateSubscribed?.toDate())}
                      </td>

                      <td />
                      <td className=''>
                        {/* <div className='table-buttons-container'>
                          <button
                            onClick={() => setOpen(subscription)}
                            type='button'
                            className='btn-activate'>
                            View Details
                          </button>
                        </div> */}
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
        next={next}
        prev={prev}
        prevDisabled={prevDisabled}
        nextDisabled={nextDisabled}
      />
    </>
  );
};

export default Subscriptions;

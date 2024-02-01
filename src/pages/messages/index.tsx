import { useNavigate } from 'react-router-dom';
import ListHeader from '../../components/ListHeader';
import useMediaQuery from '../../utils/hooks/useMediaquery';
import { useGetMessages } from '../../utils/hooks/useGetMessages';
import { useState } from 'react';
import emptyStateImg from '../../assets/Frame.svg';
import Pagination from '../../components/Pagination';
import { formatDate, limitText } from '../../utils/helper';
import calenderIcon from '../../assets/icons/uiw_date.svg';
import studentIcon from '../../assets/icons/Student_icon.png';
import { LoadingBlur } from '../../components/Loading';
import Message from './Message';
import { MessageType } from '../../../types';

const Messages = () => {
  const navigate = useNavigate();
  const matches = useMediaQuery('(min-width: 800px)');

  const [open, setOpen] = useState<MessageType | null>(null);

  const {
    messages,
    loading,
    onSearch,
    next,
    nextDisabled,
    prev,
    prevDisabled,
  } = useGetMessages();

  return (
    <>
      {loading && <LoadingBlur />}
      <Message open={open} setOpen={setOpen} />
      <ListHeader
        heading='Messages'
        subHeading='Manage your contacts '
        input={{ placeholder: 'Search by user name', onSearch }}
      />

      {messages.length < 1 ? (
        <div className='empty-screen'>
          <img alt='empty-category' src={emptyStateImg} />
          <p>There are no messages</p>
        </div>
      ) : (
        <>
          {!matches ? (
            <div className='gap-5 list-grid'>
              {messages.map((message) => (
                <div key={message.id} className='sm-reg-details'>
                  <div>
                    {/* <img className='message-icon' src={messageIcon} /> */}
                    <h3>{message.messageId}</h3>
                  </div>

                  <div>
                    <img className='message-icon' src={studentIcon} />
                    <h3>{message.username}</h3>
                  </div>
                  <div className='table-buttons-container'>
                    <div className='flex-between'>
                      <div style={{ justifyContent: 'flex-start' }}>
                        <img className='message-icon' src={calenderIcon} />
                        <h3>{formatDate(message.dateCreated?.toDate())}</h3>
                      </div>

                      <button
                        onClick={() => setOpen(message)}
                        type='button'
                        className='btn-activate'>
                        View Details
                      </button>
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
                    <th>Message ID</th>
                    <th>User Name</th>
                    <th>Recieve Date</th>

                    <th />
                  </tr>
                </thead>
                <tbody>
                  {messages.map((message) => (
                    <tr key={message.id}>
                      <td>{limitText(message.messageId, 21)}</td>
                      <td>{message.username}</td>
                      <td style={{ letterSpacing: '2px' }}>
                        {formatDate(message.dateCreated?.toDate())}
                      </td>

                      <td />
                      <td className=''>
                        <div className='table-buttons-container'>
                          <button
                            onClick={() => setOpen(message)}
                            type='button'
                            className='btn-activate'>
                            View Details
                          </button>
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
        next={next}
        prev={prev}
        prevDisabled={prevDisabled}
        nextDisabled={nextDisabled}
      />
    </>
  );
};

export default Messages;

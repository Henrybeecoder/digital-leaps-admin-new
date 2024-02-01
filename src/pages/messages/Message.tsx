import { Content, Overlay, Portal, Root } from '@radix-ui/react-dialog';
import { useGetDocument } from '../../utils/hooks/useData';
import { MessageType } from '../../../types';
import { Loading } from '../../components/Loading';
import { InputTemp, TextareaTemp } from '../../components/Input';

interface Props {
  open: MessageType | null;
  setOpen: (id: MessageType | null) => void;
}

const Message = ({ open, setOpen }: Props) => {
  //   const { data, loading } = useGetDocument('messages', open?.id);
  //   const message = data as MessageType;

  //   if (loading) return <Loading />;

  //   if (!data) return <p>Something went wrong</p>;

  return (
    <Root open={!!open} onOpenChange={() => setOpen(null)}>
      <Portal>
        <Overlay className='modal-overlay' />
        {/* {loading && <LoadingBlur />} */}
        <Content className='modal' style={{ gap: '10px' }}>
          <h3>{open?.username}</h3>
          <form>
            <InputTemp disabled label='Email' value={open?.email} />
            <InputTemp disabled label='Subject' value={open?.subject} />
            <TextareaTemp disabled value={open?.message} />
          </form>
        </Content>
      </Portal>
    </Root>
  );
};

export default Message;

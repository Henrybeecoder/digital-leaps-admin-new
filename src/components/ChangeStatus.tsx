import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../utils/fire';
import toast from 'react-hot-toast';
import AlertDialog from './AlertDialog';

const ChangeStatus = ({
  setLoadingStatus,
  id,
  prevStatus,
  field,
}: {
  setLoadingStatus: (state: boolean) => void;
  id: string;
  prevStatus: 'Active' | 'Inactive';
  field: string;
}) => {
  const changeStatus = async () => {
    try {
      setLoadingStatus(true);
      if (prevStatus === 'Active') {
        await updateDoc(doc(db, field, id), {
          status: 'Inactive',
        });
      } else {
        await updateDoc(doc(db, field, id), {
          status: 'Active',
        });
      }
      toast.success('changed status');
      setLoadingStatus(false);
    } catch (err) {
      toast.error('something went wrong');
      setLoadingStatus(false);
    }
  };

  return (
    <AlertDialog
      onConfirm={changeStatus}
      confirmText='Confirm'
      description={`You are making this coupon ${
        prevStatus === 'Active' ? 'Inactive' : 'Active'
      }`}>
      <button
        className={prevStatus === 'Active' ? 'btn-deactivate' : 'btn-activate'}>
        {prevStatus === 'Inactive' ? 'Activate' : 'Deactivate'}
      </button>
    </AlertDialog>
  );
};

export default ChangeStatus;

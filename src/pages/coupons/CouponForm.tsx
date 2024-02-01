import {
  Content,
  Overlay,
  Portal,
  Root,
  Trigger,
} from '@radix-ui/react-dialog';
import { LoadingBlur } from '../../components/Loading';
import { useState } from 'react';
import { InputTemp } from '../../components/Input';
import { Controller, useForm } from 'react-hook-form';
import { CouponFormS, couponFormS } from '../../utils/z/course';
import { DatePicker } from '../../components/DatePicker';
import { zodResolver } from '@hookform/resolvers/zod';
import { nanoid } from 'nanoid';
import { Timestamp, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../utils/fire';
import toast from 'react-hot-toast';
import { CouponType } from '../../../types';

const CouponForm = ({
  open,
  setOpen,
}: {
  open: Partial<CouponFormS> | null;
  setOpen: (payload: Partial<CouponFormS> | null) => void;
}) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<CouponFormS>({
    defaultValues: {
      endDate: open?.endDate,
      startDate: open?.startDate,
      value: open?.value,
      redemptionLimit: open?.redemptionLimit,
    },
    resolver: zodResolver(couponFormS),
  });

  const saveCoupon = async (values: CouponFormS) => {
    if (!open?.id) return;
    setLoading(true);

    try {
      if (open.id === 'new') {
        const id = nanoid();
        const payload: CouponType = {
          id,
          value: Number(values?.value),
          startDate: Timestamp.fromDate(values?.startDate),
          endDate: Timestamp.fromDate(values?.endDate),
          registrationDate: Timestamp.now(),
          couponId: nanoid(5),
          status: 'Inactive',
          redemption: [],
          redemptionLimit: Number(values.redemptionLimit),
        };

        await setDoc(doc(db, 'coupons', id), payload);
        toast.success('added coupon');
      } else {
        const payload = {
          value: Number(values?.value),
          startDate: Timestamp.fromDate(values?.startDate),
          endDate: Timestamp.fromDate(values?.endDate),
          redemptionLimit: Number(values.redemptionLimit),
        } as CouponType;

        await updateDoc(doc(db, 'coupons', open.id), payload as any);
        toast.success('saved coupon');
      }

      setLoading(false);
      setOpen(null);
    } catch (err) {
      toast.error('something went wrong');
      setLoading(false);
    }
  };

  return (
    <Content className='new-coupon-cert-modal'>
      {loading && <LoadingBlur />}
      <form onSubmit={handleSubmit(saveCoupon)}>
        <h3 className='text-blue-heading-sm'>
          {open?.id === 'new' ? 'New' : 'Edit'} Coupon
        </h3>
        <Controller
          control={control}
          name='startDate'
          render={({ field: { value, onChange } }) => (
            <DatePicker
              label='Start Date'
              value={value}
              onChange={onChange}
              error={errors.startDate?.message}
            />
          )}
        />
        <Controller
          control={control}
          name='endDate'
          render={({ field: { value, onChange } }) => (
            <DatePicker
              label='End Date'
              value={value}
              onChange={onChange}
              error={errors.endDate?.message}
            />
          )}
        />
        <InputTemp
          label='Value'
          type='number'
          placeholder='$20.00'
          {...register('value')}
          error={errors.value?.message}
        />
        <InputTemp
          label='Redemption Limit'
          type='number'
          placeholder='How many times should the coupon be used'
          {...register('redemptionLimit')}
          error={errors.redemptionLimit?.message}
        />
        <div className='buttons'>
          <button
            type='button'
            className='btn-red'
            onClick={() => setOpen(null)}>
            Cancel
          </button>
          <button type='submit' className='btn-sub'>
            Confirm
          </button>
        </div>
      </form>
    </Content>
  );
};

export default CouponForm;

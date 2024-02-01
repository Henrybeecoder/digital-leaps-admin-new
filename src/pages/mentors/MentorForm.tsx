import { Controller, useForm } from 'react-hook-form';
import { MentorType } from '../../../types';
import { zodResolver } from '@hookform/resolvers/zod';
import { MentorS, mentorS } from '../../utils/z';
import useMediaQuery from '../../utils/hooks/useMediaquery';
import { InputTemp, TextareaTemp } from '../../components/Input';
import SelectImage from '../../components/SelectImage';
import Select from '../../components/Select';
import { useEffect, useRef, useState } from 'react';
import uploadIcon from '../../assets/icons/material-symbols_upload.svg';
import { limitText, removeUndefined } from '../../utils/helper';
import toast from 'react-hot-toast';
import { Loading, LoadingBlur } from '../../components/Loading';
import { Timestamp, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../utils/fire';
import { uploadFile } from '../../utils/api';
import { nanoid } from 'nanoid';
import { useNavigate, useParams } from 'react-router-dom';

const MentorForm = () => {
  const params = useParams();
  const navigate = useNavigate();

  const mentorId = params?.id || '';
  const edit = params['*']?.split('/').includes('edit');
  const newMentor = params['*'] === 'new';

  const [mentor, setMentor] = useState<MentorType | undefined>();

  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (edit) {
      setFetching(true);
      try {
        (async () => {
          const res = await getDoc(doc(db, 'mentors', mentorId));
          setMentor({ ...(res.data() as any), id: res.id });
          setFetching(false);
        })();
      } catch (err) {
        setFetching(false);
      }
    }
  }, [edit]);

  if (fetching) return <Loading />;

  return <Form newMentor={newMentor} mentor={mentor} />;
};

const Form = ({
  mentor,
  newMentor,
}: {
  mentor?: MentorType;
  newMentor: boolean;
}) => {
  const matches = useMediaQuery('(min-width: 800px)');

  const navigate = useNavigate();

  const resumeRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);

  const { imageLink, resume, schedule, proficiency, role, ...rest } =
    mentor || {};

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isDirty },
  } = useForm<MentorS>({
    defaultValues: {
      schedule: schedule || 'Full-Time',
      role: role || 'Founder',
      proficiency: proficiency || 'Intermediate',
      cover: { serverUrl: imageLink },
      resume: resume || undefined,
      ...rest,
    },
    resolver: zodResolver(mentorS),
  });

  const saveMentor = async (values: MentorS) => {
    setLoading(true);
    try {
      if (newMentor) {
        const { cover, resume, ...rest } = values;
        const id = nanoid();
        const payload = removeUndefined({
          ...rest,
          resume: resume
            ? {
                name: resume?.name,
                link: await uploadFile(
                  resume,
                  'resumes/' +
                    (mentor?.resume
                      ? new URL(mentor?.resume.link).pathname
                          .split('/')[5]
                          .split('%2F')[1]
                      : nanoid())
                ),
              }
            : undefined,
          imageLink: cover?.file
            ? await uploadFile(
                resume,
                'resumes/' +
                  (cover?.serverUrl
                    ? new URL(cover?.serverUrl).pathname
                        .split('/')[5]
                        .split('%2F')[1]
                    : nanoid())
              )
            : undefined,
          id,
          status: 'Active',
          dateRegistered: Timestamp.now(),
        } as MentorType);
        await setDoc(doc(db, 'mentors', id), payload);
        setLoading(false);
        toast.success('added mentor');
        navigate(`/mentors/${id}`);
      } else {
        if (!mentor?.id) return;
        const { cover, resume, ...rest } = values;
        const payload = removeUndefined({
          ...rest,
          resume: resume
            ? {
                name: resume?.name,
                link: await uploadFile(
                  resume,
                  'resumes/' +
                    (mentor?.resume
                      ? new URL(mentor?.resume.link).pathname
                          .split('/')[5]
                          .split('%2F')[1]
                      : nanoid())
                ),
              }
            : undefined,
          imageLink: cover?.file
            ? await uploadFile(
                cover.file,
                'resumes/' +
                  (cover?.serverUrl
                    ? new URL(cover?.serverUrl).pathname
                        .split('/')[5]
                        .split('%2F')[1]
                    : nanoid())
              )
            : undefined,
        } as Partial<MentorType>);

        await updateDoc(doc(db, 'mentors', mentor?.id), payload);
        setLoading(false);
        toast.success('updated');
      }
    } catch (err) {
      setLoading(false);
      toast.error('something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit(saveMentor)}>
      {loading && <LoadingBlur />}
      <div className='header'>
        <h3>Edit Mentor</h3>

        <div className='header-buttons'>
          <button
            className='btn-sub'
            type='button'
            onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button className='btn-main' disabled={!isDirty} type='submit'>
            Save
          </button>
        </div>
      </div>
      <section className='mentor-edit-form'>
        <div className='form-flex' style={{ alignItems: 'flex-start' }}>
          <InputTemp
            label='Mentor Name'
            placeholder='John Doe'
            {...register('name')}
            required
            error={errors?.name?.message}
          />
          <SelectImage label='Cover' control={control} />
        </div>

        <div className='form-flex'>
          <InputTemp
            label=' Email'
            type='email'
            placeholder='@mail.com'
            {...register('email')}
            required
            error={errors.email?.message}
          />
          <InputTemp
            label=' Phone'
            placeholder='+1...'
            {...register('phoneNumber')}
            required
          />
          <InputTemp
            label=' Country'
            placeholder='Syria'
            {...register('country')}
            required
          />
        </div>

        <div className='form-flex'>
          <Controller
            name='role'
            control={control}
            render={({ field: { value, onChange, ref } }) => (
              <Select
                error={errors.role?.message}
                ref={ref}
                required
                label='Role'
                placeholder='Select Mentor Role'
                value={value}
                onValueChange={onChange}
                options={[
                  { item: 'Mentor', value: 'Mentor' },
                  { item: 'Founder', value: 'Founder' },
                  { item: 'Others', value: 'Others' },
                ]}
              />
            )}
          />

          <Controller
            name='schedule'
            control={control}
            render={({ field: { value, onChange, ref } }) => (
              <Select
                error={errors.schedule?.message}
                ref={ref}
                required
                label='Schedule'
                placeholder='Select Course Category'
                value={value}
                onValueChange={onChange}
                options={[
                  { item: 'Part-Time', value: 'Part-Time' },
                  { item: 'Full-Time', value: 'Full-Time' },
                ]}
              />
            )}
          />

          <Controller
            name='proficiency'
            control={control}
            render={({ field: { value, onChange, ref } }) => (
              <Select
                error={errors.schedule?.message}
                ref={ref}
                required
                label='Proficiency'
                placeholder='Select Course Category'
                value={value}
                onValueChange={onChange}
                options={[
                  { item: 'Intermediate', value: 'Intermediate' },
                  { item: 'Expert', value: 'Expert' },
                ]}
              />
            )}
          />
        </div>

        <div className='form-flex'>
          <InputTemp
            label='Degree'
            placeholder='BSC.'
            {...register('degree')}
            required
          />
          <InputTemp
            label='Field'
            placeholder='category'
            {...register('field')}
            required
          />
          <div />
        </div>

        <div className='form-flex'>
          <InputTemp
            label='LinkedIn URL'
            placeholder='.com'
            {...register('linkedInUrl')}
          />
          <InputTemp
            label='Facebook URL'
            placeholder='.com'
            {...register('facebookUrl')}
          />
          <InputTemp
            label='Youtube URL'
            placeholder='.com'
            {...register('youtubeUrl')}
          />
        </div>

        <div className='form-flex'>
          <TextareaTemp
            label='Description'
            {...register('description')}
            error={errors.description?.message}
          />

          <Controller
            control={control}
            name={'resume'}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <div className='form-image-select'>
                <input
                  hidden
                  type='file'
                  ref={resumeRef}
                  accept='application/msword,text/plain, application/pdf'
                  onChange={(e) => {
                    const file = e.target?.files?.[0];
                    onChange(file);
                  }}
                />
                <label>Resume</label>

                <div className='upload-image-group'>
                  <button
                    type='button'
                    onClick={() => resumeRef.current?.click()}
                    style={{ border: error ? '1px solid red' : '' }}>
                    {value
                      ? limitText(value?.name, 37)
                      : 'Upload Resume (pdf,doc...)'}
                    <span>
                      <img alt='upload-icon' src={uploadIcon} />
                    </span>
                  </button>
                </div>
              </div>
            )}
          />

          <InputTemp
            label='Website/Portfolio'
            placeholder='.com'
            {...register('website_portfolio')}
          />
        </div>
      </section>
    </form>
  );
};

export default MentorForm;

import { Controller, useController, useForm } from 'react-hook-form';
import { InputTemp, TextareaTemp } from '../../../components/Input';
import SelectImage from '../../../components/SelectImage';
import Select from '../../../components/Select';
import { useNavigate } from 'react-router-dom';
import { DatePicker, TimePicker } from '../../../components/DatePicker';
import * as RadixRadioGroup from '@radix-ui/react-radio-group';
import { useGetCollection } from '../../../utils/hooks/useData';
import { LoadingBlur } from '../../../components/Loading';
import useMediaQuery from '../../../utils/hooks/useMediaquery';
import { CourseInfoS, courseInfoS } from '../../../utils/z/course';
import { zodResolver } from '@hookform/resolvers/zod';
import { SelectCourseDays } from './SelectCourseDays';

interface Props {
  fillForm: (name: 'courseInfo' | 'curriculum' | 'faqs', payload: any) => void;
  courseInfo: CourseInfoS | undefined;
}

const CourseInfo = ({ fillForm, courseInfo }: Props) => {
  const navigate = useNavigate();

  const matches = useMediaQuery('(min-width: 800px)');

  const { data: categories, loading: loadingCategories } =
    useGetCollection('categories');

  const { data: instructors, loading: loadingInstructors } =
    useGetCollection('mentors');

  const categoryOpts = categories.map((x) => ({
    item: x?.name,
    value: x.id,
  }));

  const instructorOpts = instructors.map((x) => ({
    item: x?.name,
    value: x.id,
  }));

  const courseCertificateOpts = [
    { item: 'Provided Upon Completion', value: 'Provided Upon Completion' },
    // { item: 'Provided Before Completion', value: 'Provided Before Completion' },
  ];

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, touchedFields },
  } = useForm<CourseInfoS>({
    defaultValues: {
      ...courseInfo,
      level: courseInfo?.level || 'all-levels',
      skills: courseInfo?.skills || [],
      requirements: courseInfo?.requirements || [],
      learningObjectives: courseInfo?.learningObjectives || [],
      isFeatured: courseInfo?.isFeatured || false,
    },
    resolver: zodResolver(courseInfoS),
  });

  // console.log(errors);

  const {
    field: {
      value: instructorValue,
      onChange: instructorOnchange,
      ref: instructorRef,
    },
  } = useController({ name: 'instructor', control });

  const {
    field: {
      value: instructor2Value,
      onChange: instructor2Onchange,
      ref: instructor2Ref,
    },
  } = useController({ name: 'instructor2', control });

  return (
    <form onSubmit={handleSubmit((values) => fillForm('courseInfo', values))}>
      {(loadingCategories || loadingInstructors) && <LoadingBlur />}

      <div className='header'>
        <h3>New Course</h3>

        {matches ? (
          <div className='header-buttons'>
            <button
              className='btn-sub'
              type='button'
              onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button type='submit' className='btn-main'>
              Continue
            </button>
          </div>
        ) : (
          <div className='course-bread-crumb-group-sm'>
            <span>1</span>
            <p>Course info</p>
          </div>
        )}
      </div>
      {matches && (
        <div className='flex gap-4'>
          <div className='course-bread-crumb-group'>
            <span>1</span>
            <p>Course info</p>
          </div>
          <div className='blue-divider-inactive' />
          <div className='course-bread-crumb-group-inactive'>
            <span>2</span>
            <p>Curriculum</p>
          </div>
          <div className='blue-divider-inactive' />
          <div className='course-bread-crumb-group-inactive'>
            <span>3</span>
            <p>FAQs</p>
          </div>
        </div>
      )}

      <section className='course-form'>
        <div className='form-flex'>
          <InputTemp
            label='Course Name'
            {...register('title')}
            required
            touched={touchedFields.title}
            error={errors.title?.message}
          />
          <SelectImage label='Course cover' control={control} required />
        </div>

        <div className='form-flex'>
          <Controller
            name='categoryId'
            control={control}
            render={({ field: { value, onChange, ref } }) => (
              <Select
                error={errors.categoryId?.message}
                ref={ref}
                required
                label='Category'
                placeholder='Select Course Category'
                value={value}
                onValueChange={onChange}
                options={categoryOpts}
              />
            )}
          />

          <Controller
            name='isFeatured'
            control={control}
            render={({ field: { value, onChange, ref } }) => (
              <Select
                error={errors.isFeatured?.message}
                ref={ref}
                required
                label='Featured'
                placeholder='Select Course Category'
                value={value ? 'True' : 'False'}
                onValueChange={(value) => onChange(value === 'True')}
                options={[
                  { item: 'True', value: 'True' },
                  { item: 'False', value: 'False' },
                ]}
              />
            )}
          />

          <InputTemp
            label='Price'
            type='number'
            {...register('price')}
            required
            error={errors.price?.message}
          />
        </div>

        <div className='form-flex'>
          <Select
            ref={instructorRef}
            error={errors.instructor?.message}
            label='Instructor'
            required
            placeholder='Select Instructor'
            value={instructorValue?.id}
            onValueChange={(e) =>
              instructorOnchange(
                instructors.find((instructor) => instructor?.id === e)
              )
            }
            options={instructorOpts.filter(
              (x) => x.value !== instructor2Value?.id
            )}
          />

          <Select
            ref={instructor2Ref}
            error={errors.instructor2?.message}
            label='Instructor 2'
            placeholder='Select Instructor 2'
            value={instructor2Value?.id}
            onValueChange={(e) =>
              instructor2Onchange(
                instructors.find((instructor) => instructor?.id === e)
              )
            }
            options={instructorOpts.filter(
              (x) => x.value !== instructorValue?.id
            )}
          />
        </div>

        <div className='form-flex'>
          <Controller
            name='startDate'
            control={control}
            render={({ field: { value, onChange, ref } }) => (
              <DatePicker
                ref={ref}
                label='Start Date'
                onChange={onChange}
                value={value}
                required
                error={errors.startDate?.message}
              />
            )}
          />
          <Controller
            name='endDate'
            control={control}
            render={({ field: { value, onChange, ref } }) => (
              <DatePicker
                ref={ref}
                label='End Date'
                onChange={onChange}
                value={value}
                required
                error={errors.endDate?.message}
              />
            )}
          />

          <Controller
            name='lectureDays'
            control={control}
            render={({
              field: { value, onChange, ref },
              fieldState: { error },
            }) => (
              <SelectCourseDays
                ref={ref}
                value={value}
                onValueChange={onChange}
                label='Lecture Days'
                error={error?.message}
              />
            )}
          />
        </div>

        <div className='form-flex'>
          <Controller
            name='lectureStartTime'
            control={control}
            render={({ field: { value, onChange, ref } }) => (
              <TimePicker
                ref={ref}
                label='Lecture start time'
                onChange={onChange}
                value={value}
                required
                error={errors.startDate?.message}
              />
            )}
          />
          <Controller
            name='lectureEndTime'
            control={control}
            render={({ field: { value, onChange, ref } }) => (
              <TimePicker
                ref={ref}
                label='Lecture end time'
                onChange={onChange}
                value={value}
                required
                error={errors.endDate?.message}
              />
            )}
          />

          <InputTemp
            label='Total number of lectures'
            type='number'
            {...register('totalNumberOfLectures')}
            required
            error={errors.totalNumberOfLectures?.message}
          />
        </div>

        <div className='form-flex'>
          <InputTemp
            style={{ width: 'fit-content' }}
            label='Course Platform'
            placeholder='Enter platform'
            {...register('coursePlatform')}
            required
            touched={touchedFields.coursePlatform}
            error={errors.coursePlatform?.message}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='25'
              viewBox='0 0 24 25'
              fill='none'>
              <path
                d='M2 21.167C1.71667 21.167 1.479 21.071 1.287 20.879C1.095 20.687 0.999337 20.4497 1 20.167C1 19.8837 1.096 19.646 1.288 19.454C1.48 19.262 1.71734 19.1663 2 19.167H22C22.2833 19.167 22.521 19.263 22.713 19.455C22.905 19.647 23.0007 19.8843 23 20.167C23 20.4503 22.904 20.688 22.712 20.88C22.52 21.072 22.2827 21.1677 22 21.167H2ZM4 18.167C3.45 18.167 2.979 17.971 2.587 17.579C2.195 17.187 1.99934 16.7163 2 16.167V5.16699C2 4.61699 2.196 4.14599 2.588 3.75399C2.98 3.36199 3.45067 3.16633 4 3.16699H20C20.55 3.16699 21.021 3.36299 21.413 3.75499C21.805 4.14699 22.0007 4.61766 22 5.16699V16.167C22 16.717 21.804 17.188 21.412 17.58C21.02 17.972 20.5493 18.1677 20 18.167H4ZM4 16.167H20V5.16699H4V16.167Z'
                fill='#5E6366'
              />
            </svg>
          </InputTemp>

          <InputTemp
            style={{ width: 'fit-content' }}
            label='Course language'
            placeholder='Enter Language'
            {...register('courseLanguage')}
            required
            error={errors.courseLanguage?.message}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='25'
              viewBox='0 0 24 25'
              fill='none'>
              <path
                d='M12 22.167C10.6333 22.167 9.34167 21.9043 8.125 21.379C6.90833 20.8537 5.84567 20.137 4.937 19.229C4.029 18.321 3.31233 17.2587 2.787 16.042C2.26167 14.8253 1.99933 13.5337 2 12.167C2 10.7837 2.26267 9.48766 2.788 8.27899C3.31333 7.07033 4.03 6.01233 4.938 5.10499C5.846 4.19633 6.908 3.47966 8.124 2.95499C9.34 2.43033 10.632 2.16766 12 2.16699C13.3833 2.16699 14.6793 2.42966 15.888 2.95499C17.0967 3.48033 18.1547 4.19699 19.062 5.10499C19.9707 6.01299 20.6873 7.07133 21.212 8.27999C21.7367 9.48866 21.9993 10.7843 22 12.167C22 13.5337 21.7373 14.8253 21.212 16.042C20.6867 17.2587 19.97 18.3213 19.062 19.23C18.154 20.138 17.0957 20.8547 15.887 21.38C14.6783 21.9053 13.3827 22.1677 12 22.167ZM12 20.117C12.4333 19.517 12.8083 18.892 13.125 18.242C13.4417 17.592 13.7 16.9003 13.9 16.167H10.1C10.3 16.9003 10.5583 17.592 10.875 18.242C11.1917 18.892 11.5667 19.517 12 20.117ZM9.4 19.717C9.1 19.167 8.83734 18.596 8.612 18.004C8.38667 17.412 8.19934 16.7997 8.05 16.167H5.1C5.58333 17.0003 6.18767 17.7253 6.913 18.342C7.63833 18.9587 8.46733 19.417 9.4 19.717ZM14.6 19.717C15.5333 19.417 16.3627 18.9587 17.088 18.342C17.8133 17.7253 18.4173 17.0003 18.9 16.167H15.95C15.8 16.8003 15.6127 17.413 15.388 18.005C15.1633 18.597 14.9007 19.1677 14.6 19.717ZM4.25 14.167H7.65C7.6 13.8337 7.56234 13.5043 7.537 13.179C7.51167 12.8537 7.49933 12.5163 7.5 12.167C7.5 11.817 7.51267 11.4797 7.538 11.155C7.56333 10.8303 7.60067 10.501 7.65 10.167H4.25C4.16667 10.5003 4.104 10.8297 4.062 11.155C4.02 11.4803 3.99933 11.8177 4 12.167C4 12.517 4.021 12.8543 4.063 13.179C4.105 13.5037 4.16733 13.833 4.25 14.167ZM9.65 14.167H14.35C14.4 13.8337 14.4377 13.5043 14.463 13.179C14.4883 12.8537 14.5007 12.5163 14.5 12.167C14.5 11.817 14.4873 11.4797 14.462 11.155C14.4367 10.8303 14.3993 10.501 14.35 10.167H9.65C9.6 10.5003 9.56233 10.8297 9.537 11.155C9.51167 11.4803 9.49933 11.8177 9.5 12.167C9.5 12.517 9.51267 12.8543 9.538 13.179C9.56333 13.5037 9.60067 13.833 9.65 14.167ZM16.35 14.167H19.75C19.8333 13.8337 19.896 13.5043 19.938 13.179C19.98 12.8537 20.0007 12.5163 20 12.167C20 11.817 19.979 11.4797 19.937 11.155C19.895 10.8303 19.8327 10.501 19.75 10.167H16.35C16.4 10.5003 16.4377 10.8297 16.463 11.155C16.4883 11.4803 16.5007 11.8177 16.5 12.167C16.5 12.517 16.4873 12.8543 16.462 13.179C16.4367 13.5037 16.3993 13.833 16.35 14.167ZM15.95 8.16699H18.9C18.4167 7.33366 17.8127 6.60866 17.088 5.99199C16.3633 5.37533 15.534 4.91699 14.6 4.61699C14.9 5.16699 15.1627 5.73799 15.388 6.32999C15.6133 6.92199 15.8007 7.53433 15.95 8.16699ZM10.1 8.16699H13.9C13.7 7.43366 13.4417 6.74199 13.125 6.09199C12.8083 5.44199 12.4333 4.81699 12 4.21699C11.5667 4.81699 11.1917 5.44199 10.875 6.09199C10.5583 6.74199 10.3 7.43366 10.1 8.16699ZM5.1 8.16699H8.05C8.2 7.53366 8.38767 6.92099 8.613 6.32899C8.83833 5.73699 9.10067 5.16633 9.4 4.61699C8.46667 4.91699 7.63733 5.37533 6.912 5.99199C6.18667 6.60866 5.58267 7.33366 5.1 8.16699Z'
                fill='#5E6366'
              />
            </svg>
          </InputTemp>

          <Controller
            name='courseCertificate'
            control={control}
            render={({
              field: { value, onChange, ref },
              fieldState: { error },
            }) => (
              <Select
                error={error?.message}
                ref={ref}
                required
                label='Course certificate'
                placeholder='Select Certificate'
                value={value}
                onValueChange={onChange}
                options={courseCertificateOpts}
              />
            )}
          />
        </div>

        <Controller
          name='level'
          control={control}
          render={({ field: { value, onChange } }) => (
            <RadioGroup
              value={value}
              onValueChange={onChange}
              options={[
                { item: 'All Levels', value: 'all-levels' },
                { item: 'Beginner', value: 'beginner' },
                { item: 'Intermediate', value: 'intermediate' },
                { item: 'Advanced', value: 'advanced' },
              ]}
            />
          )}
        />

        <div className='form-flex'>
          <TextareaTemp
            label='Short description'
            required
            {...register('description')}
            error={errors.description?.message}
          />
          <TextareaTemp
            label='About this course'
          
            {...register('about')}
            error={errors.about?.message}
          />
        </div>

        <Controller
          name='learningObjectives'
          control={control}
          render={({
            field: { value, onChange, ref },
            fieldState: { error },
          }) => (
            <div>
              <TextareaTemp
                label='What will students learn'
                placeholder='Add field then press enter'
                rows={2}
                ref={ref}
                required
                onKeyDown={(e: any) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (!e.target.value) return;
                    onChange([
                      ...value.filter((x) => x !== e.target.value),
                      e.target.value,
                    ]);
                    e.target.value = '';
                  }
                }}
              />
              {error && value.length < 1 ? (
                <p className='form-error-text'>{error.message}</p>
              ) : (
                <div className='' style={{ overflowX: 'auto', width: '100%' }}>
                  <div className='form-requirements-container'>
                    {value.map((x) => (
                      <div key={x}>
                        <span>{x}</span>
                        <button
                          onClick={() =>
                            onChange(value.filter((skill) => skill !== x))
                          }>
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        />

        <Controller
          name='skills'
          control={control}
          render={({
            field: { value, onChange, ref },
            fieldState: { error },
          }) => (
            <div>
              <InputTemp
                ref={ref}
                label='Skills'
                required
                placeholder='Add field then press enter'
                onKeyDown={(e: any) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (!e.target.value) return;
                    onChange([
                      ...value.filter((x) => x !== e.target.value),
                      e.target.value,
                    ]);
                    e.target.value = '';
                  }
                }}
              />
              {error && value.length < 1 ? (
                <p className='form-error-text'>{error.message}</p>
              ) : (
                <div className='form-skills-container'>
                  {value.map((x) => (
                    <div key={x}>
                      <span>{x}</span>
                      <button
                        onClick={() =>
                          onChange(value.filter((skill) => skill !== x))
                        }>
                        X
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        />

        <Controller
          name='requirements'
          control={control}
          render={({
            field: { value, onChange, ref },
            fieldState: { error },
          }) => (
            <div>
              <TextareaTemp
                ref={ref}
                label='Requirements'
                placeholder='Add field then press enter'
                rows={2}
                required
                onKeyDown={(e: any) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (!e.target.value) return;
                    onChange([
                      ...value.filter((x) => x !== e.target.value),
                      e.target.value,
                    ]);
                    e.target.value = '';
                  }
                }}
              />
              {error && value.length < 1 ? (
                <p className='form-error-text'>{error.message}</p>
              ) : (
                <div className='' style={{ overflowX: 'auto', width: '100%' }}>
                  <div className='form-requirements-container'>
                    {value.map((x) => (
                      <div key={x}>
                        <span>{x}</span>
                        <button
                          onClick={() =>
                            onChange(value.filter((skill) => skill !== x))
                          }>
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        />
      </section>
      {!matches && (
        <div className='btns-container-bottom'>
          <button
            className='btn-sub'
            type='button'
            onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button className='btn-main' type='submit'>
            Continue
          </button>
        </div>
      )}
    </form>
  );
};

interface RGProps {
  value: string;
  options: { item: string; value: string }[];
  onValueChange: (value: string) => void;
}

const RadioGroup = ({ value, options, onValueChange }: RGProps) => {
  return (
    <div className='form-radiogroup'>
      <label>
        Level <span>*</span>{' '}
      </label>
      <RadixRadioGroup.Root
        className='form-radiogroup-container'
        value={value}
        onValueChange={onValueChange}
        aria-label='select'>
        {options.map(({ item, value }) => (
          <div key={value} className='form-radio-container'>
            <RadixRadioGroup.Item value={value} id={value}>
              <RadixRadioGroup.Indicator className='' />
            </RadixRadioGroup.Item>
            <label htmlFor={value} style={{ cursor: 'pointer' }}>
              {item}
            </label>
          </div>
        ))}
      </RadixRadioGroup.Root>
    </div>
  );
};

export default CourseInfo;

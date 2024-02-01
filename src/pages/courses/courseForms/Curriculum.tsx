// import { useNavigate } from 'react-router-dom';
import {
  Control,
  FieldErrors,
  UseFormRegister,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { InputTemp } from '../../../components/Input';
import { nanoid } from 'nanoid';
import useMediaQuery from '../../../utils/hooks/useMediaquery';
import { SetStateAction } from 'react';
import { CurriculumS, curriculumS } from '../../../utils/z/course';
import { zodResolver } from '@hookform/resolvers/zod';

interface Props {
  fillForm: (name: 'courseInfo' | 'curriculum' | 'faqs', payload: any) => void;
  curriculum: CurriculumS | undefined;
  setPageKey: (value: SetStateAction<1 | 2 | 3>) => void;
}

const Curriculum = ({ fillForm, curriculum, setPageKey }: Props) => {
  //   const navigate = useNavigate();

  const matches = useMediaQuery('(min-width: 800px)');

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<CurriculumS>({
    defaultValues:
      curriculum && curriculum?.chapters?.length > 0
        ? curriculum
        : {
            chapters: [{ title: '', lessons: [''] }],
          },
    resolver: zodResolver(curriculumS),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'chapters',
  });

  return (
    <form onSubmit={handleSubmit((values) => fillForm('curriculum', values))}>
      <div className='header'>
        {matches && (
          <div className='flex gap-4'>
            <div className='course-bread-crumb-group'>
              <span>1</span>
              <p>Course info</p>
            </div>
            <div className='blue-divider' />
            <div className='course-bread-crumb-group'>
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

        <div className='header-buttons'>
          <button
            type='button'
            onClick={() => setPageKey(1)}
            className='btn-sub'>
            Back
          </button>
          <button
            type='button'
            className='btn-main'
            onClick={() => append({ id: nanoid(), title: '', lessons: [''] })}>
            +New Section
          </button>
        </div>
        {!matches && (
          <div className='course-bread-crumb-group-sm'>
            <span>2</span>
            <p>Curriculum</p>
          </div>
        )}
      </div>

      <section className='course-form'>
        {fields.map((field, index) => (
          <div key={field.id}>
            <div className='flex-between'>
              <h4>Chapter {index + 1}</h4>

              {index > 0 && (
                <button
                  className='form-append-btn'
                  onClick={() => remove(index)}>
                  X
                </button>
              )}
            </div>
            <InputTemp
              label='Chapter Title'
              {...register(`chapters.${index}.title`)}
              error={errors.chapters?.[index]?.title?.message}
            />
            <LessonForm
              index={index}
              register={register}
              control={control}
              errors={errors}
            />
          </div>
        ))}
        <div className='flex gap-3 justify-end'>
          <button type='submit' className='btn-main'>
            Continue
          </button>
        </div>
      </section>
    </form>
  );
};

interface FormProps {
  index: number;
  register: UseFormRegister<CurriculumS>;
  control: Control<CurriculumS, any>;
  errors: FieldErrors<{
    chapters: {
      title: string;
      lessons: string[];
      id?: string | undefined;
    }[];
  }>;
}

const LessonForm = ({
  index: chapterIndex,
  register,
  control,
  errors,
}: FormProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `chapters.${chapterIndex}.lessons` as any,
  });

  return (
    <>
      {fields.map((x, index) => (
        <div key={x.id} className='course-form-lesson-form'>
          <InputTemp
            label='Lesson Title'
            {...register(`chapters.${chapterIndex}.lessons.${index}`)}
            error={errors.chapters?.[chapterIndex]?.lessons?.[index]?.message}
          />
          {index > 0 && (
            <button className='form-append-btn' onClick={() => remove(index)}>
              X
            </button>
          )}
        </div>
      ))}
      <span>{errors.chapters?.[chapterIndex]?.lessons?.message}</span>
      <button
        type='button'
        className='course-form-lesson-form-button'
        onClick={() => append('')}>
        +New lesson
      </button>
    </>
  );
};

export default Curriculum;

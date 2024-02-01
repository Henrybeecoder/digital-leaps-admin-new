// import { useNavigate } from 'react-router-dom';
import { useController, useFieldArray, useForm } from 'react-hook-form';
import { InputTemp, TextareaTemp } from '../../../components/Input';
import useMediaQuery from '../../../utils/hooks/useMediaquery';
import { SetStateAction } from 'react';
import { FaqS, faqS } from '../../../utils/z/course';
import { zodResolver } from '@hookform/resolvers/zod';

interface Props {
  fillForm: (name: 'courseInfo' | 'curriculum' | 'faqs', payload: any) => void;
  faqs: FaqS | undefined;
  setPageKey: (value: SetStateAction<1 | 2 | 3>) => void;
  saveAsDraft: (faqs: FaqS) => void;
}

const Faqs = ({ fillForm, faqs, setPageKey, saveAsDraft }: Props) => {
  //   const navigate = useNavigate();

  const matches = useMediaQuery('(min-width: 800px)');

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<FaqS>({
    defaultValues:
      faqs && faqs?.questions?.length > 0
        ? faqs
        : { questions: [{ question: '', answer: '' }] },
    resolver: zodResolver(faqS),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const {
    field: { value },
  } = useController({ name: 'questions', control });

  return (
    <form onSubmit={handleSubmit((values) => fillForm('faqs', values))}>
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
            <div className='blue-divider' />
            <div className='course-bread-crumb-group'>
              <span>3</span>
              <p>FAQs</p>
            </div>
          </div>
        )}

        <div className='header-buttons'>
          <button
            type='button'
            onClick={() => setPageKey(2)}
            className='btn-sub'>
            Back
          </button>
          <button
            type='button'
            onClick={() => append({ question: '', answer: '' })}
            className='btn-main'>
            +New Question
          </button>
        </div>
        {!matches && (
          <div className='course-bread-crumb-group-sm'>
            <span>3</span>
            <p>FAQs</p>
          </div>
        )}
      </div>

      <section className='course-form'>
        {fields.map((field, index) => (
          <div className='faq-form-question-container' key={field.id}>
            <div className='heading'>
              <h4>Question {index + 1}</h4>

              {index > 0 && (
                <button
                  type='button'
                  className='form-append-btn'
                  onClick={() => remove(index)}>
                  X
                </button>
              )}
            </div>

            <InputTemp
              label='Question'
              {...register(`questions.${index}.question`)}
              error={errors.questions?.[index]?.question?.message}
            />
            <TextareaTemp
              label='Answer'
              {...register(`questions.${index}.answer`)}
              error={errors.questions?.[index]?.answer?.message}
            />
          </div>
        ))}
        <div className='flex justify-end gap-3'>
          <button
            type='button'
            className='btn-sub'
            onClick={() => saveAsDraft({ questions: value })}>
            Save as Draft
          </button>
          <button type='submit' className='btn-main'>
            Save and Publish
          </button>
        </div>
      </section>
    </form>
  );
};

export default Faqs;

import {
  Control,
  Controller,
  UseFormRegister,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import useMediaQuery from '../../utils/hooks/useMediaquery';
import { BlogArticleFormS, blogArticleFormS } from '../../utils/z/blog';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputTemp, TextareaTemp } from '../../components/Input';
import SelectImage from '../../components/SelectImage';
import Switch from '../../components/Switch';
import Select from '../../components/Select';
import { useGetCollection } from '../../utils/hooks/useData';
import { Loading, LoadingBlur } from '../../components/Loading';
import { removeUndefined } from '../../utils/helper';
import { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import { BlogArticle } from '../../../types';
import { uploadFile } from '../../utils/api';
import { Timestamp, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../utils/fire';
import toast from 'react-hot-toast';
import RTE from '../../components/RTE';
// import parse from 'html-react-parser';
// import DOMPurify from 'dompurify';

const BlogArticleForm = () => {
  const params = useParams();

  const articleId = params?.id;
  const edit = params['*']?.split('/').includes('edit');

  const [fetching, setFetching] = useState(false);
  const [data, setData] = useState<BlogArticle>();

  useEffect(() => {
    if (!articleId || !edit) return;
    setFetching(true);

    (async () => {
      try {
        const res = await getDoc(doc(db, 'blogPosts', articleId));
        setData(res.data() as BlogArticle);
        setFetching(false);
      } catch (err) {
        setFetching(false);
        toast.error('failed to fetch data');
      }
    })();
  }, [articleId]);

  if (fetching) return <Loading />;

  return <FormComponent data={data} edit={edit} />;
};

const FormComponent = ({
  data,
  edit,
}: {
  data: BlogArticle | undefined;
  edit: boolean | undefined;
}) => {
  const navigate = useNavigate();

  const matches = useMediaQuery('(min-width: 800px)');

  const [loading, setLoading] = useState(false);

  const { data: categories, loading: loadingCategories } =
    useGetCollection('blogCategories');

  const categoryOpts = categories.map((x) => ({
    item: x?.name,
    value: x.id,
  }));

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, touchedFields, isDirty },
  } = useForm<BlogArticleFormS>({
    defaultValues: {
      title: data?.title,
      categoryId: data?.categoryId,
      introduction: data?.introduction,
      author: data?.author,
      cover: { file: null, serverUrl: data?.thumbnail },
      articleDetails: data?.content.map(
        ({ subtitle, imageLink, text, paragraph }) => ({
          title: subtitle,
          cover: { file: null, serverUrl: imageLink },
          paragraph: text || paragraph,
        })
      ) || [{ title: '', paragraph: '' }],
      isFeatured: false,
      categories: data?.categories || [],
    },
    resolver: zodResolver(blogArticleFormS),
  });

  const saveArticle = async (values: BlogArticleFormS) => {
    console.log(values, "my values")
    const articleContent = async () => {
      const store: BlogArticle['content'] = [];

      for await (const detail of values.articleDetails) {
        const imageLink = detail?.cover?.file
          ? await uploadFile(detail.cover.file, 'blog-images/' + nanoid())
          : detail.cover?.serverUrl || undefined;
        store.push(
          removeUndefined({
            imageLink,
            text: detail.paragraph,
            subtitle: detail.title,
          })
        );
      }

      return store;
    };

    try {
      setLoading(true);

      if (edit && data?.id) {
        const payload = removeUndefined({
          thumbnail: values?.cover?.file
            ? await uploadFile(values.cover.file, 'blog-images/' + nanoid())
            : values?.cover?.serverUrl || undefined,
          content: await articleContent(),
          categoryId: values.categoryId,
          categoryName: categoryOpts.find((x) => x.value === values.categoryId)
            ?.item,

          introduction: values.introduction,
          author: values.author,
          isFeatured: values.isFeatured,
          title: values.title,
          categories: values.categories,
        } as Partial<BlogArticle>);


      

        const docRef = doc(db, 'blogPosts', data.id);

        await updateDoc(docRef, payload);
        setLoading(false);
        toast.success('updated article');
        // navigate(`/blogs/blog-details/${data.id}`);
      } else {
        const id = nanoid();
        const payload = removeUndefined({
          id,
          thumbnail: values?.cover?.file
            ? await uploadFile(values.cover.file, 'blog-images/' + nanoid())
            : undefined,
          content: await articleContent(),
          categoryId: values.categoryId,
          categoryName: categoryOpts.find((x) => x.value === values.categoryId)
            ?.item,

          introduction: values.introduction,
          isFeatured: values.isFeatured,
          title: values.title,
          author: values.author,
          date: Timestamp.now(),
          categories: values.categories,
        } as BlogArticle);

        const docRef = doc(db, 'blogPosts', id);

        await setDoc(docRef, payload);
        setLoading(false);
        toast.success('saved article');
        navigate(`/blogs/blog-details/${id}`);
      }
    } catch (err) {
      setLoading(false);
      toast.error('something went wrong');
    }
  };

  // const renderHtmlFromString = (htmlString: string) => {
  //   const cleanHtmlString = DOMPurify.sanitize(htmlString, {
  //     USE_PROFILES: { html: true },
  //   });
  //   const html = parse(cleanHtmlString);
  //   return html;
  // };
  

  if (loadingCategories) return <Loading />;

  return (
    <form onSubmit={handleSubmit(saveArticle)}>
      {loading && <LoadingBlur />}

      {/* <div>{renderHtmlFromString(data?.content?.[0]?.text || '')}</div> */}

      <div className='header'>
        <h3>{edit ? 'Edit' : 'New'} Article</h3>

        {matches && (
          <div className='header-buttons hidden-mobile'>
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
        )}
      </div>

      <div className='blog-article-form-container'>
        <InputTemp
          label='Article Title'
          {...register('title')}
          touched={touchedFields.title}
          error={errors.title?.message}
        />
        <SelectImage label='Article cover' control={control} name='' />

        <Controller
          name='categoryId'
          control={control}
          render={({ field: { value, onChange, ref } }) => (
            <Select
              error={errors.categoryId?.message}
              ref={ref}
              label='Category'
              placeholder='Select Article Category'
              value={value}
              onValueChange={onChange}
              options={categoryOpts}
            />
          )}
        />

        <TextareaTemp
          label='Short description'
          {...register('introduction')}
          error={errors.introduction?.message}
        />

<InputTemp
          label='Article Author'
          {...register('author')}
          touched={touchedFields.author}
          error={errors.title?.message}
        />

        <Controller
          name='isFeatured'
          control={control}
          render={({ field: { value, onChange, ref } }) => (
            <Switch
              ref={ref}
              id='isFeatured'
              checked={value}
              toggle={onChange}
              label='Display in featured banner in category'
            />
          )}
        />

        {/* 
        <Switch
          id='main-screen'
          label='Off Display in featured banner in blog main screen'
        /> */}

        <Controller
          name='categories'
          control={control}
          render={({
            field: { value, onChange, ref },
            fieldState: { error },
          }) => (
            <div>
              <InputTemp
                ref={ref}
                label='Categories'
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

        <ArticleDetails control={control} register={register} />

        {!matches && (
          <div className='btns-container-bottom'>
            <button
              className='btn-sub'
              type='button'
              onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button className='btn-main' type='submit'>
              Save
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

const ArticleDetails = ({
  control,
  register,
}: {
  control: Control<BlogArticleFormS>;
  register: UseFormRegister<BlogArticleFormS>;
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'articleDetails',
  });

  return (
    <div className='article-details-container'>
      <h3 className='text-blue-heading-sm'>Article Details</h3>

      {fields.map((field, index) => (
        <div key={field.id} className='article-details-section'>
          {index > 0 && (
            <button
              className='text-descr'
              style={{ color: 'red' }}
              type='button'
              onClick={() => remove(index)}>
              Remove
            </button>
          )}
          <InputTemp
            label='Title'
            {...register(`articleDetails.${index}.title`)}
          />
          <SelectImage
            label='Section Image'
            control={control}
            name={`articleDetails.${index}.cover`}
          />
          <Controller
            name={`articleDetails.${index}.paragraph`}
            control={control}
            render={({
              field: { value, onBlur, onChange, ref },
              fieldState: { error },
            }) => (
              <RTE
                label='Paragraph'
                ref={ref}
                onBlur={onBlur}
                value={value}
                onChange={onChange}
                error={error?.message}
              />
            )}
          />
        </div>
      ))}

      <button
        className='text-blue-heading-sm'
        type='button'
        onClick={() => append({ title: '', paragraph: '', cover: {} })}>
        +New Section
      </button>
    </div>
  );
};

export default BlogArticleForm;

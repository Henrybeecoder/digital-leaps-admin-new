import { useForm } from 'react-hook-form';
import '../../styles/courses.css';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  DocumentData,
  Timestamp,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../../utils/fire';
import { Loading, LoadingBlur } from '../../components/Loading';
import SelectImage from '../../components/SelectImage';
import { InputTemp, TextareaTemp } from '../../components/Input';
import useMediaQuery from '../../utils/hooks/useMediaquery';
import { toast } from 'react-hot-toast';
import { updatedDiff } from 'deep-object-diff';
import { categoryType } from '../../../types';
import { uploadFile } from '../../utils/api';
import { nanoid } from 'nanoid';
import { removeUndefined } from '../../utils/helper';
import { categoryS } from '../../utils/z/course';
import { zodResolver } from '@hookform/resolvers/zod';
import { BlogCategoryFormS, blogCategoryFormS } from '../../utils/z/blog';

const BlogCategoryForm = () => {
  const params = useParams();
  const categoryId = params?.category;
  const edit = params['*']?.split('/').includes('edit');

  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<DocumentData>();

  useEffect(() => {
    if (!edit || !categoryId) return;
    (async () => {
      setLoading(true);
      const data = await getDoc(doc(db, 'blogCategories', categoryId));
      setCategory({ ...data.data(), id: data.id });
      setLoading(false);
    })();
  }, [categoryId, edit]);

  if (loading) return <Loading />;

  return <Form category={category as any} />;
};

const Form = ({ category }: { category?: categoryType }) => {
  const navigate = useNavigate();
  const matches = useMediaQuery('(min-width: 800px)');

  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { isDirty, errors },
  } = useForm<BlogCategoryFormS>({
    defaultValues: {
      name: category?.name,
      cover: { serverUrl: category?.imageLink, file: null },
      description: category?.description,
    },
    resolver: zodResolver(blogCategoryFormS),
  });

  const saveCategory = async (values: BlogCategoryFormS) => {
    setLoading(true);
    try {
      if (!category) {
        const payload = {
          name: values?.name,
          description: values?.description,
          imageLink: values.cover.file
            ? await uploadFile(
                values.cover.file,
                'category-images/' + nanoid(15)
              )
            : '',
          date: Timestamp.now(),
        };

        const id = nanoid();

        await setDoc(doc(db, 'blogCategories', id), {
          ...payload,
          id: id,
        });
        toast.success('saved category');
        setLoading(false);
        navigate('/blogs');
      } else {
        const originalObj = {
          name: category?.name,
          description: category?.description,
        };

        const updatedObj = {
          name: values?.name,
          description: values?.description,
        };

        const uploadedLink = values.cover.file
          ? await uploadFile(
              values.cover.file,
              'blogCategory-images/' +
                new URL(category?.imageLink || '').pathname
                  .split('/')[5]
                  .split('%2F')[1]
            )
          : undefined;

        const payload = removeUndefined({
          ...updatedDiff(originalObj, updatedObj),
          imageLink: uploadedLink,
        });

        await updateDoc(doc(db, 'blogCategories', category.id), payload);
        toast.success('updated');
        setLoading(false);
        uploadedLink && reset({ cover: { serverUrl: uploadedLink } });
      }
    } catch (err) {
      setLoading(false);
      toast.error('something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit(saveCategory)}>
      {loading && <LoadingBlur />}
      <div className='header'>
        <h3>{category ? 'Edit' : 'New'} Blog Category</h3>

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

      <section className='course-category-form'>
        <InputTemp
          label='Category Name'
          {...register('name')}
          required
          error={errors?.name?.message}
        />

        <SelectImage required label='Category cover' control={control} />

        <TextareaTemp
          required
          label='Short description'
          {...register('description')}
          rows={3}
          error={errors.description?.message}
        />

        {!matches && (
          <div className='btns-container-bottom'>
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
      </section>
    </form>
  );
};

export default BlogCategoryForm;

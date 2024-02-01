import { deleteDoc, doc, where } from 'firebase/firestore';
import { Loading } from '../../components/Loading';
import Course from './Course';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetCollection, useGetDocument } from '../../utils/hooks/useData';
import AlertDialog from '../../components/AlertDialog';
import { db } from '../../utils/fire';
import toast from 'react-hot-toast';
import emptyStateImg from '../../assets/Frame.svg';

const Category = () => {
  const navigate = useNavigate();
  const categoryId = useParams()?.category;

  const { data: courses, loading } = useGetCollection(
    'courses',
    where('categoryId', '==', `${categoryId}`)
  );

  const { data: category, loading: loadingC } = useGetDocument(
    'categories',
    categoryId
  );

  const deleteCategory = async () => {
    if (!category.id) return;

    try {
      await deleteDoc(doc(db, 'categories', category.id));
      toast.success('deleted');
      navigate('/courses');
    } catch (err) {
      toast.error('something went wrong');
    }
  };

  if (loading || loadingC) return <Loading />;

  return (
    <>
      <div className='header'>
        <h3 className=''>{category?.name}</h3>

        <div className='header-buttons'>
          <button
            className='btn-sub'
            onClick={() => navigate(`/courses/category/${categoryId}/edit`)}>
            Edit Category
          </button>
          <AlertDialog
            onConfirm={deleteCategory}
            description='This cannot be undone. This will delete this
          category permanently'>
            <button className='btn-red'>Delete Category</button>
          </AlertDialog>
          <button
            className='btn-main'
            onClick={() => navigate(`/courses/new-course`)}>
            +New Course
          </button>
        </div>
      </div>

      {courses.length > 0 ? (
        <div className='list-grid'>
          {courses?.map((course) => (
            <Course
              key={course.createdAt}
              data={course as any}
              category={category as any}
            />
          ))}
        </div>
      ) : (
        <div className='empty-screen'>
          <img alt='empty-category' src={emptyStateImg} />
          <p>No course under this category</p>
        </div>
      )}
    </>
  );
};

export default Category;

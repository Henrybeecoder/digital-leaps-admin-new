import { deleteDoc, doc, where } from 'firebase/firestore';
import { Loading } from '../../components/Loading';
import Blog from './BlogCard';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetCollection, useGetDocument } from '../../utils/hooks/useData';
import AlertDialog from '../../components/AlertDialog';
import { db } from '../../utils/fire';
import toast from 'react-hot-toast';
import emptyStateImg from '../../assets/Frame.svg';
import { useGetBlogPosts } from '../../utils/hooks/useGetBlogs';
import Pagination from '../../components/Pagination';

const BlogCategory = () => {
  const navigate = useNavigate();
  const categoryId = useParams()?.category;

  const { articles, loading, ...rest } = useGetBlogPosts(categoryId);

  const { data: category, loading: loadingC } = useGetDocument(
    'blogCategories',
    categoryId
  );

  const deleteCategory = async () => {
    if (!category.id) return;

    try {
      await deleteDoc(doc(db, 'blogCategories', category.id));
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
            onClick={() => navigate(`/blogs/category/${categoryId}/edit`)}>
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
            onClick={() => navigate(`/blogs/new-article`)}>
            +New Article
          </button>
        </div>
      </div>

      {articles.length > 0 ? (
        <div className='list-grid'>
          {articles?.map((article) => (
            <Blog
              key={article.id}
              data={article as any}
              category={category as any}
            />
          ))}
        </div>
      ) : (
        <div className='empty-screen'>
          <img alt='empty-category' src={emptyStateImg} />
          <p>No article under this category</p>
        </div>
      )}

      <Pagination {...rest} />
    </>
  );
};

export default BlogCategory;

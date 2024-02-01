import { useNavigate } from 'react-router-dom';
import BlogCard from './BlogCategoryCard';
import Pagination from '../../components/Pagination';
import { useGetCategories } from '../../utils/hooks/useGetBlogs';
import { LoadingBlur } from '../../components/Loading';

const Blogs = () => {
  const navigate = useNavigate();

  const { categories, loading, prev, next, prevDisabled, nextDisabled } =
    useGetCategories();

  return (
    <>
      {loading && <LoadingBlur />}
      <div className='header'>
        <h3 className=''>Blog Categories</h3>

        <div className='header-buttons'>
          <button
            className='btn-main'
            onClick={() => navigate(`/blogs/new-category`)}>
            +New Category
          </button>
        </div>
      </div>

      <div className='list-grid'>
        {categories.map((category) => (
          <BlogCard key={category.id} category={category} />
        ))}
      </div>

      <Pagination
        prev={prev}
        next={next}
        prevDisabled={prevDisabled}
        nextDisabled={nextDisabled}
      />
    </>
  );
};

export default Blogs;

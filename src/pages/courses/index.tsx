import courseimg from '../..//assets/mock/999af86c2265c937933820ab7a07d63d.jpeg';
import Pagination from '../../components/Pagination';
import { useNavigate } from 'react-router-dom';
import { useGetCollection } from '../../utils/hooks/useData';
import { Loading } from '../../components/Loading';
import { limitText } from '../../utils/helper';
import { useGetCategories } from '../../utils/hooks/useGetCourses';

const Categories = () => {
  const navigate = useNavigate();

  const {
    categories,
    loading: loadingCategories,
    prev,
    prevDisabled,
    next,
    nextDisabled,
  } = useGetCategories();

  if (loadingCategories) return <Loading />;

  return (
    <>
      <div className='header'>
        <h3 className=''>Course Categories</h3>

        <button
          className='btn-main'
          onClick={() => navigate('/courses/new-category')}>
          +New Category
        </button>
      </div>

      <div className='list-grid'>
        {categories.map((category, index) => (
          <div
            key={index}
            className='course-category'
            onClick={() => navigate(`/courses/category/${category.id}`)}>
            <img alt='course-img' src={category.imageLink || courseimg} />
            <article>
              <h4>{category?.name}</h4>
              <p>{limitText(category.description, 180)}</p>
            </article>
          </div>
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

export default Categories;

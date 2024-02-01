import { useNavigate } from 'react-router-dom';
import { BlogCategoryS } from '../../utils/z/blog';
import blogTemplateImg from '../../assets/mock/63450c58fe599c40a68f1bf74c09b3de.jpeg';

const BlogCategoryCard = ({ category }: { category: BlogCategoryS }) => {
  const navigate = useNavigate();
  return (
    <div
      className='blog-category-card'
      onClick={() => navigate(`/blogs/category/${category.id}`)}>
      <img
        alt='blog-category-image'
        src={category.imageLink || blogTemplateImg}
      />
      <h3 className='text-blue-heading'>{category?.name}</h3>
      <p className='text-descr'>{category.description}</p>
    </div>
  );
};

export default BlogCategoryCard;

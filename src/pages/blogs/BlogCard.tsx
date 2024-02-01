import courseImg from '../../assets/course-placeholder.png';
import user from '../../assets/user.png';
import { BlogArticle, CourseType, categoryType } from '../../../types';
import {
  dateLocale,
  firstUpperCase,
  formatDate,
  limitText,
} from '../../utils/helper';
import { useNavigate } from 'react-router-dom';

const BlogCard = ({
  data,
  category,
}: {
  data?: BlogArticle;
  category: categoryType;
}) => {
  const navigate = useNavigate();

  return (
    <article
      className='blog-card-container'
      onClick={() => navigate(`/blogs/blog-details/${data?.id}`)}>
      <img src={data?.thumbnail} alt='' width='' height={250} className='' />
      <div className='blog-article-text-section'>
        <span className='text-'>
          {dateLocale(data?.date?.toDate() || new Date())}
        </span>
        <p className='text-heading'>{limitText(data?.title, 180)}</p>

        <p className='text-descr'>{limitText(data?.introduction, 180)}</p>

        <div className='blog-article-tags'>
          {data?.categories?.map((x) => (
            <p key={x}>{firstUpperCase(x)}</p>
          ))}
        </div>
      </div>
    </article>
  );
};

export default BlogCard;

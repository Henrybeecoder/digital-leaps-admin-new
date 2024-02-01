import { useNavigate, useParams } from 'react-router-dom';
import AlertDialog from '../../components/AlertDialog';
import { useGetDocument } from '../../utils/hooks/useData';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../utils/fire';
import toast from 'react-hot-toast';
import { Loading } from '../../components/Loading';
import { dateLocale, firstUpperCase } from '../../utils/helper';
import { BlogArticle } from '../../../types';

const BlogDetails = () => {
  const navigate = useNavigate();
  const articleId = useParams()?.id;

  const { data, loading } = useGetDocument('blogPosts', articleId);

  const blog = data as BlogArticle;

  const deleteArticle = async () => {
    if (!blog.id) return;

    try {
      await deleteDoc(doc(db, 'blogPosts', blog.id));
      toast.success('deleted');
      navigate(-1);
    } catch (err) {
      toast.error('something went wrong');
    }
  };

  console.log(blog);

  if (loading) return <Loading />;
  if (!blog)
    return (
      <div>
        <h3>No blog</h3>
      </div>
    );

  return (
    <>
      <div className='header'>
        <h3>{blog.title || 'Blog Article'}</h3>

        <div className='header-buttons'>
          <AlertDialog
            onConfirm={deleteArticle}
            description='This cannot be undone. This will delete this
          blog permanently'>
            <button className='btn-red'>Delete Article</button>
          </AlertDialog>
          <button
            className='btn-main'
            onClick={() => navigate(`/blogs/blog-details/${blog.id}/edit`)}>
            Edit Article
          </button>
        </div>
      </div>

      <div className='blg-details'>
        <div className='blg-details-hero'>
          <article>
            <h3>{blog.title}</h3>
            <p>{dateLocale(blog.date?.toDate() || new Date())}</p>
            <div>
              {blog.categories?.map((x) => (
                <span key={x}>{firstUpperCase(x)}</span>
              ))}
            </div>
          </article>
          <div className='blg-details-hero-img'>
            <img
              alt='blog-thumbnail'
              src={blog?.thumbnail}
              width={500}
              height={436}
            />
          </div>
        </div>

        <div className='post-container'>
          <aside className='blg-writing'>
            <p className='blg-writing-intro'>{blog.introduction}</p>
            {blog.content?.map((x: any, index: number) => (
              <div className='blg-writing-content' key={index}>
                <h4>{x.subtitle}</h4>
                <img alt='blog-content-image' src={x.imageLink} />
                <p>{x.text}</p>
              </div>
            ))}

            {/* <div className='adverts'>
              <p className='advert-text'>Advertisement</p>
              <p className='adverts-place'>You can place ads</p>
              <p className='adverts-size'>750x275</p>
            </div> */}
          </aside>
          {/* <aside className='blg-details-featured'>
            <h3 className='blg-details-featured-h3'>Featured Articles</h3>
            <div className='details-articles-section-slider-wrapper'>
              {blog.categories.map((article, index) => (
                <BlogCard featured post={article} key={index} />
              ))}
            </div>
          </aside> */}
        </div>
      </div>
    </>
  );
};

export default BlogDetails;

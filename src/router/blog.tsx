import { Route, Routes } from 'react-router-dom';
import Blogs from '../pages/blogs';
import BlogCategoryForm from '../pages/blogs/CategoryForm';
import BlogCategory from '../pages/blogs/BlogCategory';
import BlogArticleForm from '../pages/blogs/ArticleForm';
import BlogDetails from '../pages/blogs/BlogDetails';

const BlogRouter = () => {
  return (
    <Routes>
      <Route index element={<Blogs />} />
      <Route path='/category/:category' element={<BlogCategory />} />
      <Route path='/category/:category/edit' element={<BlogCategoryForm />} />
      <Route path='/new-category' element={<BlogCategoryForm />} />
      <Route path='/new-article' element={<BlogArticleForm />} />
      <Route path='/blog-details/:id/edit' element={<BlogArticleForm />} />
      <Route path='/blog-details/:id' element={<BlogDetails />} />
    </Routes>
  );
};

export default BlogRouter;

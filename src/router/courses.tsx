import { Route, Routes } from 'react-router-dom';
import Categories from '../pages/courses';
import Category from '../pages/courses/Category';
import CategoryForm from '../pages/courses/CategoryForm';
import CourseDetails from '../pages/courses/courseDetails';
import CourseForm from '../pages/courses/courseForms';

export const CoursesRouter = () => {
  return (
    <Routes>
      <Route index element={<Categories />} />
      <Route path='/category/:category' element={<Category />} />
      <Route path='/category/:category/edit' element={<CategoryForm />} />
      <Route path='/new-category' element={<CategoryForm />} />
      <Route path='/course-details/:courseId' element={<CourseDetails />} />
      <Route path='/course-details/:courseId/edit' element={<CourseForm />} />
      <Route path='/new-course' element={<CourseForm />} />
    </Routes>
  );
};

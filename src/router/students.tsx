import { Route, Routes } from 'react-router-dom';
import Students from '../pages/students';
import Student from '../pages/students/Student';

const StudentsRouter = () => {
  return (
    <Routes>
      <Route index element={<Students />} />
      <Route path=':id' element={<Student />} />
    </Routes>
  );
};

export default StudentsRouter;

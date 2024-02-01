import { Route, Routes } from 'react-router-dom';
import Mentors from '../pages/mentors';
import Mentor from '../pages/mentors/Mentor';
import MentorForm from '../pages/mentors/MentorForm';
import MentorRequests from '../pages/mentors/MentorRequests';
import MentorRequest from '../pages/mentors/MentorRequest';

const MentorRouter = () => {
  return (
    <Routes>
      <Route index element={<Mentors />} />
      <Route path=':id' element={<Mentor />} />
      <Route path=':id/edit' element={<MentorForm />} />
      <Route path='/new' element={<MentorForm />} />
      <Route path='/requests' element={<MentorRequests />} />
      <Route path='/requests/:id' element={<MentorRequest />} />
    </Routes>
  );
};

export default MentorRouter;

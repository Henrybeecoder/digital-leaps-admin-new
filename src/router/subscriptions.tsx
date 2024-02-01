import { Route, Routes } from 'react-router-dom';
import Subscriptions from '../pages/subsciptions';

const SubsciptionRouter = () => {
  return (
    <Routes>
      <Route index element={<Subscriptions />} />
    </Routes>
  );
};

export default SubsciptionRouter;

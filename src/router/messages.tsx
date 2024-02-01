import { Route, Routes } from 'react-router-dom';
import Messages from '../pages/messages';

const MessagesRouter = () => {
  return (
    <Routes>
      <Route index element={<Messages />} />
    </Routes>
  );
};

export default MessagesRouter;

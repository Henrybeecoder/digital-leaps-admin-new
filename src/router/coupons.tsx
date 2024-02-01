import { Route, Routes } from 'react-router-dom';
import Coupons from '../pages/coupons';

const CouponsRouter = () => {
  return (
    <Routes>
      <Route index element={<Coupons />} />
    </Routes>
  );
};

export default CouponsRouter;

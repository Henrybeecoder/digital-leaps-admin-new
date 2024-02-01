import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import './styles/courses.css';
import './styles/layout.css';
import './styles/student.css';
import './styles/home.css';
import './styles/blog.css';
import './styles/coupon.css';
import './styles/mentor.css';
import Router from './router/index.tsx';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Toaster />
    <Router />
  </React.StrictMode>
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CourseSlice, UserSlice } from './type';
import { courseSlice } from './courseSlice';
import { userSlice } from './userSlice';

export const useStore = create<CourseSlice & UserSlice>()(
  persist(
    (...args) => ({
      ...courseSlice(...args),
      ...userSlice(...args),
      // ...subSlice(...args),
    }),
    {
      name: 'course-details',
      partialize: (state) => ({ details: state.details }),
    }
  )
);

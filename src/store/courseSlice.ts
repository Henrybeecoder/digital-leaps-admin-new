import type { StateCreator } from 'zustand';
import type { CourseSlice } from './type';

export const courseSlice: StateCreator<CourseSlice> = (set, get) => ({
  details: {},
  setDetails: (details) => set({ details }),
  reset: () => set({ details: {} }),
});

import { Auth, User } from 'firebase/auth';
import { CourseForms } from '../../types/index';
import { FirebaseError } from 'firebase/app';

export interface CourseSlice {
  details: Partial<CourseForms>;
  setDetails: (details: Partial<CourseForms>) => void;
  reset: () => void;
}

type AuthState = {
  loading: boolean;
  user: User | null;
  error: FirebaseError | undefined;
};

export interface UserSlice {
  auth: AuthState;
  setAuthState: (state: AuthState) => void;
}

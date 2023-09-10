import { Timestamp } from 'firebase/firestore';

export interface CourseType {
  title: string;
  author: {
    name: string;
    photourl: string;
  };
  createdAt: Timestamp;
  expertise: 'intermediate';
  price: number;
  duration: string;
  about: string;
  category: string;
}

import { Timestamp } from 'firebase/firestore';
import { CourseInfoS, CurriculumS, FaqS } from '../src/utils/z/course';
import { FirebaseError } from 'firebase/app';

export type Status = 'Active' | 'Inactive';

export interface CourseForms {
  curriculum: CurriculumS;
  courseInfo: CourseInfoS;
  faqs: FaqS;
}

interface CourseInstructor {
  description: string;
  imageLink: string;
  name: string;
  rating: number;
}

export interface CourseType {
  id: string;
  title: string;
  instructor: CourseInstructor;
  instructor2?: CourseInstructor;
  instructorId: string;
  instructor2Id: string;
  isHidden: boolean;
  description: string;
  createdAt: Timestamp;
  level: string;
  price: number;
  durationInWeeks: number;
  startDate: Timestamp;
  endDate: Timestamp;
  about: string;
  categoryId: string;
  chapters: { id: string; lessons: string[]; title: string }[];
  faq: { question: string; answer: string }[];
  links: { facebook: string; linkedin: string; youtube: string };
  rating: number;
  skills: string[];
  requirements: string[];
  learningObjectives: string[];
  imageLink: string;
  lectureStartTime: string;
  lectureEndTime: string;
  lectureDays: string;
  totalNumberOfLectures: number;
  coursePlatform: string;
  courseLanguage: string;
  courseCertificate: string;
  isFeatured: boolean;
}

export interface categoryType {
  id: string;
  name: string;
  description: string;
  imageLink: string;
}

export interface InstructorType {
  id: string;
  name: string;
  photourl: string;
  description: string;
  rating: string;
}

export interface CertificateType {
  instructor1: string;
  instructor2?: string;
  studentName: string;
  studentId: string;
  courseName: string;
  text: string;
  courseId: string;
  id?: string;
  dateGenerated: Timestamp;
}

export interface CourseUserType {
  id: string;
  fullName: string;
  dateRegistered: Timestamp;
  amount: number;
  invoiceNumber: string;
  status: string;
  certificateId?: string | null;
  phoneNumber: string;
  email: string;
}

export interface UserType {
  id: string;
  displayName: string;
  email: string;
  uid: string;
  phoneNumber: string;
  country: string;
  educationLevel: string;
  dateRegistered: Timestamp;
  status: Status;
  amount?: number;
}

export interface BlogArticle {
  id: string;
  title: string;
  thumbnail: string;
  introduction: string;
  author: string;
  isFeatured: boolean;
  categoryId: string;
  categoryName: string;
  content: {
    subtitle: string;
    text: string;
    paragraph?: string;
    imageLink?: string;
  }[];
  date: Timestamp;
  categories: string[];
}

export interface CouponType {
  id: string;
  startDate: Timestamp;
  endDate: Timestamp;
  registrationDate: Timestamp;
  value: number;
  couponId: string;
  status: Status;
  redemption: [];
  redemptionLimit: number;
}

export interface MentorType {
  id: string;
  name: string;
  description: string;
  imageLink: string;
  role: string;
  dateRegistered: Timestamp;
  status: Status;
  email: string;
  phoneNumber: string;
  degree: string;
  country: string;
  proficiency: string;
  schedule: string;
  resume: { name: string; link: string };
  linkedInUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  website_portfolio: string;
  field: string;
  numberOfCourses: number;
}

export interface MessageType {
  id: string;
  messageId: string;
  username: string;
  dateReceived: Timestamp | null;
  dateCreated: Timestamp;
  email: string;
  subject: string;
  message: string;
}

export interface DataReturnType {
  loading: boolean;
  error: FirebaseError | undefined;
  onSearch: (keyword: string) => void;
  prev: () => void;
  next: () => void;
  prevDisabled: boolean;
  nextDisabled: boolean;
}

export interface EnrollRequest {
  id: string;
  email: string;
  name: string;
  courseName: string;
  courseId: string;
  price: string;
  dateEnrolled: Timestamp;
}

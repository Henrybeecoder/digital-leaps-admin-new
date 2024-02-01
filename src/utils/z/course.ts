import { z } from 'zod';

export const courseInfoS = z.object({
  title: z.string({ required_error: 'required' }).min(2, 'Required'),
  isFeatured: z.boolean(),
  lectureStartTime: z.date(),
  lectureEndTime: z.date(),
  totalNumberOfLectures: z.string().min(1, 'Required'),
  lectureDays: z.string().min(1, 'Required'),
  coursePlatform: z.string().min(1, 'Required'),
  courseLanguage: z.string().min(1, 'Required'),
  courseCertificate: z.string().min(1, 'Required'),
  cover: z
    .object({
      serverUrl: z.string().nullish(),
      file: z.any().nullish(),
      previewUrl: z.string().nullish(),
    })
    .refine((schema) => (schema.file || schema.serverUrl ? true : false), {
      message: 'Select an image',
    }),
  categoryId: z.string().min(1, 'select a category'),
  instructor: z.object({
    id: z.string().min(1, 'select an instructor'),
    description: z.string().optional(),
    imageLink: z.string().optional(),
    name: z.string().optional(),
    rating: z.string().or(z.number()).optional(),
  }),
  instructor2: z
    .object({
      id: z.string().min(1, 'select an instructor'),
      description: z.string().optional(),
      imageLink: z.string().optional(),
      name: z.string().optional(),
      rating: z.string().or(z.number()).optional(),
    })
    .optional(),
  price: z.string().min(1, 'Enter a valid price'),
  skills: z.array(z.string()).min(1, 'At least one required'),
  requirements: z.array(z.string()).min(1, 'At least one required'),
  startDate: z.date(),
  endDate: z.date(),
  level: z.string(),
  description: z.string().min(1, 'Required'),
  about: z.string().min(1, 'Required'),
  learningObjectives: z.array(z.string()).min(1, 'At least one required'),
});

export type CourseInfoS = z.infer<typeof courseInfoS>;
//  & {
//   cover: { serverUrl?: string; file: File | null; previewUrl?: string };
// };

export const curriculumS = z.object({
  chapters: z
    .array(
      z.object({
        id: z.string().optional(),
        title: z.string().min(1, 'Enter a title'),
        lessons: z.array(z.string()),
      })
    )
    .min(1, 'You must fill at least one chapter'),
});

export type CurriculumS = z.infer<typeof curriculumS>;

export const faqS = z.object({
  questions: z
    .array(
      z.object({
        question: z.string().min(1, 'Required'),
        answer: z.string().min(1, 'Required'),
      })
    )
    .min(1, 'You must fill at least one faq'),
});

export type FaqS = z.infer<typeof faqS>;

export const categoryS = z.object({
  categoryName: z.string().min(1, 'Required'),
  cover: z
    .object({
      serverUrl: z.string().nullish(),
      file: z.any().nullish(),
      previewUrl: z.string().nullish(),
    })
    .refine((schema) => (schema.file || schema.serverUrl ? true : false), {
      message: 'Select an image',
    }),
  description: z.string().min(1, 'Required'),
});

export type CategoryS = z.infer<typeof categoryS>;

export const couponFormS = z.object({
  value: z.string().min(1, 'Required'),
  startDate: z.date(),
  endDate: z.date(),
  redemptionLimit: z.string().min(1, 'Required'),
});

export type CouponFormS = z.infer<typeof couponFormS> & { id: string };

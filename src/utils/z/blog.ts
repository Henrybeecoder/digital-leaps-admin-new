import { z } from 'zod';
import { coverSchema, coverSchemaOpt } from '.';

export const blogCategoryFormS = z.object({
  name: z.string().min(1, 'Required'),
  description: z.string().min(1, 'Required'),
  cover: z
    .object({
      serverUrl: z.string().nullish(),
      file: z.any().nullish(),
      previewUrl: z.string().nullish(),
    })
    .refine((schema) => (schema.file || schema.serverUrl ? true : false), {
      message: 'Select an image',
    }),
});

export type BlogCategoryFormS = z.infer<typeof blogCategoryFormS>;
export type BlogCategoryS = Omit<z.infer<typeof blogCategoryFormS>, 'cover'> & {
  id: string;
  imageLink: string;
  date: string;
};

export const blogArticleFormS = z.object({
  title: z.string(),
  introduction: z.string(),
  author: z.string(),
  cover: coverSchemaOpt,
  articleDetails: z.array(
    z.object({
      title: z.string(),
      cover: coverSchemaOpt,
      paragraph: z.string(),
    })
  ),
  isFeatured: z.boolean(),
  categoryId: z.string(),
  categories: z.array(z.string()),
});

export type BlogArticleFormS = z.infer<typeof blogArticleFormS>;

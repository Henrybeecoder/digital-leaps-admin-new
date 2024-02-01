import { z } from 'zod';

export const coverSchema = z
  .object({
    serverUrl: z.string().nullish(),
    file: z.any().nullish(),
    previewUrl: z.string().nullish(),
  })
  .refine((schema) => (schema.file || schema.serverUrl ? true : false), {
    message: 'Select an image',
  });

export const coverSchemaOpt = z
  .object({
    serverUrl: z.string().nullish(),
    file: z.any().nullish(),
    previewUrl: z.string().nullish(),
  })
  .optional();

export const mentorS = z.object({
  name: z.string().min(1, 'required'),
  description: z.string().min(1, 'required'),
  cover: coverSchemaOpt,
  role: z.string(),
  // dateRegistered: z.date(),
  // status: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  degree: z.string(),
  country: z.string(),
  proficiency: z.string(),
  schedule: z.string(),
  resume: z.any().nullish(),
  linkedInUrl: z.string(),
  facebookUrl: z.string(),
  youtubeUrl: z.string(),
  website_portfolio: z.string(),
  field: z.string(),
});

export type MentorS = z.infer<typeof mentorS>;

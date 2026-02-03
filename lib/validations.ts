import { z } from 'zod';

export const CreateProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  skills: z.array(z.string()).optional(),
  teamSize: z.union([z.string(), z.number()]).transform((val) => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
        if (val.includes('-')) {
            const parts = val.split('-');
            return parseInt(parts[1]) || 5;
        }
        return parseInt(val) || 5;
    }
    return 5;
  }),
  dueDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  files: z.array(z.object({
    name: z.string(),
    dataUrl: z.string(),
    size: z.number(),
    type: z.string()
  })).optional()
});

export const ProfileUpdateSchema = z.object({
  fullName: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  websiteUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  linkedinUrl: z.string().optional(),
  twitterUrl: z.string().optional(),
  currentStatus: z.string().optional(),
  yearsOfExperience: z.union([z.string(), z.number()]).optional().transform(val => val ? Number(val) : 0),
  education: z.array(z.object({
    institutionName: z.string().optional(),
    institution: z.string().optional(),
    degree: z.string().optional(),
    fieldOfStudy: z.string().optional(),
    startDate: z.string().optional(), // Date string
    endDate: z.string().optional(),
    isCurrent: z.boolean().optional(),
    description: z.string().optional(),
  })).optional(),
  experience: z.array(z.object({
    companyName: z.string().optional(),
    company: z.string().optional(),
    position: z.string().optional(),
    title: z.string().optional(), // Alternative field name
    employmentType: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    isCurrent: z.boolean().optional(),
    description: z.string().optional(),
  })).optional(),
  skills: z.array(z.string()).optional()
});

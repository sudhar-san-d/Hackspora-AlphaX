import { z } from 'zod';
import { complaintCategories, departmentCodes, priorities, complaintStatuses } from '../types.js';

const booleanish = z.preprocess((value) => {
  if (value === 'true' || value === '1') return true;
  if (value === 'false' || value === '0' || value === '' || value === undefined) return false;
  return value;
}, z.boolean());

const numberish = (schema: z.ZodNumber) => z.preprocess((value) => value === '' ? undefined : value, z.coerce.number().pipe(schema));

export const createComplaintSchema = z.object({
  title: z.string().trim().min(3).max(120).optional(),
  description: z.string().trim().min(10).max(3000),
  latitude: numberish(z.number().min(-90).max(90)),
  longitude: numberish(z.number().min(-180).max(180)),
  address: z.string().trim().min(3).max(300),
  categoryHint: z.enum(complaintCategories).optional(),
  nearSchool: booleanish.default(false),
  nearHospital: booleanish.default(false),
  nearTransit: booleanish.default(false),
  trafficImpact: booleanish.default(false),
  peopleAtRisk: numberish(z.number().int().min(0).max(100000)).default(0),
  ageHours: numberish(z.number().min(0).max(8760)).default(0),
  imageDataUrl: z.string().max(11_000_000).refine((v) => /^data:image\/(jpeg|png|webp);base64,/i.test(v), 'Unsupported image data URL').optional(),
}).strict();

export const analysisSchema = z.object({
  category: z.enum(complaintCategories),
  secondaryCategories: z.array(z.enum(complaintCategories)).max(4).default([]),
  severity: z.number().int().min(0).max(100),
  confidence: z.number().min(0).max(1),
  observedFacts: z.array(z.string().min(1).max(240)).max(12),
  hazards: z.array(z.string().min(1).max(240)).max(12),
  imageQuality: z.enum(['clear', 'limited', 'unclear']),
  requiresHumanReview: z.boolean(),
}).strict();

export const analyzeImageSchema = z.object({
  description: z.string().trim().max(3000).default(''),
  categoryHint: z.enum(complaintCategories).optional(),
  imageDataUrl: z.string().max(11_000_000).refine((v) => /^data:image\/(jpeg|png|webp);base64,/i.test(v), 'Unsupported image data URL').optional(),
}).strict();

export const decideSchema = z.object({
  description: z.string().trim().min(10).max(3000),
  analysis: analysisSchema.extend({ source: z.enum(['openrouter', 'deterministic_fallback']).optional() }),
  nearSchool: z.boolean().default(false),
  nearHospital: z.boolean().default(false),
  nearTransit: z.boolean().default(false),
  trafficImpact: z.boolean().default(false),
  peopleAtRisk: z.number().int().min(0).max(100000).default(0),
  ageHours: z.number().min(0).max(8760).default(0),
}).strict();

export const complaintListSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(complaintStatuses).optional(),
  priority: z.enum(priorities).optional(),
  category: z.enum(complaintCategories).optional(),
  department: z.enum(departmentCodes).optional(),
  search: z.string().trim().max(120).optional(),
}).strict();

export const assignSchema = z.object({
  department: z.enum(departmentCodes),
  assigneeId: z.string().trim().min(1).max(120),
}).strict();

export const actionSchema = z.object({
  note: z.string().trim().min(2).max(1000).default('Status updated'),
}).strict();

export const resolveSchema = z.object({
  note: z.string().trim().min(3).max(1000),
  latitude: numberish(z.number().min(-90).max(90)),
  longitude: numberish(z.number().min(-180).max(180)),
  imageDataUrl: z.string().max(11_000_000).refine((v) => /^data:image\/(jpeg|png|webp);base64,/i.test(v)).optional(),
}).strict();

export const verifySchema = z.object({
  forceReview: z.boolean().default(false),
}).strict();

import { z } from 'zod';

export const visionAnalysisSchema = z.object({
  detected_issue: z.string().trim().min(1).max(120),
  infrastructure: z.string().trim().min(1).max(120),
  visual_description: z.string().trim().min(1).max(800),
  damage_indicators: z.array(z.string().trim().min(1).max(160)).max(12),
  safety_indicators: z.array(z.string().trim().min(1).max(160)).max(12),
  estimated_visual_severity: z.number().int().min(0).max(10),
  confidence: z.number().min(0).max(1),
}).strict().superRefine((value, context) => {
  if ((value.detected_issue === 'Unknown' || value.infrastructure === 'Unknown') && value.estimated_visual_severity !== 0) {
    context.addIssue({ code: 'custom', path: ['estimated_visual_severity'], message: 'Unknown images must use severity 0' });
  }
});

export const member1RequestSchema = z.object({
  complaint_id: z.string().trim().min(1).max(120),
  image_url: z.string().trim().min(1).max(11_000_000).optional(),
  citizen_description: z.string().trim().max(3000).optional(),
}).strict();

export const member1ResponseSchema = z.object({
  complaint_id: z.string(),
  image_analysis: visionAnalysisSchema,
}).strict();

export const member2RequestSchema = z.object({
  complaint_id: z.string().trim().min(1).max(120),
  citizen: z.object({ description: z.string().trim().min(10).max(3000) }).strict(),
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    ward: z.string().trim().max(120).default('Unassigned'),
    zone: z.string().trim().max(120).default('Unassigned'),
    nearby_landmark: z.string().trim().max(240).optional(),
    nearby_sensitive_places: z.array(z.string().trim().min(1).max(120)).max(12).default([]),
    road_type: z.string().trim().max(120).optional(),
    traffic_level: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  }).strict(),
  image_analysis: visionAnalysisSchema,
}).strict();

export const decisionFactorsSchema = z.object({
  category: z.string().trim().min(1).max(120),
  subcategory: z.string().trim().min(1).max(120),
  issue: z.string().trim().min(1).max(120),
  severity: z.number().int().min(0).max(10),
  urgency: z.number().int().min(0).max(10),
  public_risk: z.number().int().min(0).max(10),
  population_impact: z.number().int().min(0).max(10),
  location_risk: z.number().int().min(0).max(10),
  sla_risk: z.number().int().min(0).max(10),
  reason: z.string().trim().min(1).max(600),
  confidence: z.number().min(0).max(1),
}).strict();

export const member2ResponseSchema = z.object({
  complaint_id: z.string(),
  classification: z.object({ category: z.string(), subcategory: z.string(), issue: z.string() }).strict(),
  responsibility: z.object({
    primary_department: z.string(),
    secondary_departments: z.array(z.string()),
    multi_agency: z.boolean(),
  }).strict(),
  priority: z.object({
    severity: z.number().int().min(0).max(10),
    urgency: z.number().int().min(0).max(10),
    public_risk: z.number().int().min(0).max(10),
    population_impact: z.number().int().min(0).max(10),
    location_risk: z.number().int().min(0).max(10),
    sla_risk: z.number().int().min(0).max(10),
    priority_score: z.number().int().min(0).max(100),
    priority_level: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  }).strict(),
  sla: z.object({ target_hours: z.union([z.literal(6), z.literal(12), z.literal(48), z.literal(120)]) }).strict(),
  location: z.object({ latitude: z.number(), longitude: z.number(), ward: z.string(), zone: z.string() }).strict(),
  incident: z.object({ possible_duplicate: z.boolean(), duplicate_confidence: z.number().min(0).max(1) }).strict(),
  ai: z.object({ confidence: z.number().min(0).max(1), reason: z.string() }).strict(),
}).strict();

export type VisionAnalysisContract = z.infer<typeof visionAnalysisSchema>;
export type Member2Request = z.infer<typeof member2RequestSchema>;
export type Member2Response = z.infer<typeof member2ResponseSchema>;
export type DecisionFactors = z.infer<typeof decisionFactorsSchema>;

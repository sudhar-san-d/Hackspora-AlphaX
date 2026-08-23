import { randomUUID } from 'node:crypto';
import express, { type Request } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { AppConfig } from './config.js';
import { loadConfig } from './config.js';
import type { Complaint, Evidence } from './types.js';
import { OpenRouterClient } from './ai/openrouter.js';
import { GroqClient } from './ai/groq.js';
import { ImageAnalyzer } from './ai/imageAnalyzer.js';
import { DecisionEngine } from './ai/decisionEngine.js';
import { VerificationEngine } from './ai/verificationEngine.js';
import type { ComplaintFilters, Repository } from './repositories/repository.js';
import { MemoryRepository } from './repositories/memoryRepository.js';
import { SupabaseRepository } from './repositories/supabaseRepository.js';
import type { StorageAdapter, StoredObject } from './storage/storage.js';
import { MemoryStorage } from './storage/memoryStorage.js';
import { SupabaseStorage } from './storage/supabaseStorage.js';
import { findDuplicate } from './services/duplicateDetection.js';
import { createAuth, requireRoles } from './http/auth.js';
import { AppError, errorHandler, notFound } from './http/errors.js';
import { requestLogger } from './http/requestLogger.js';
import { createUpload, storeRequestImage } from './http/upload.js';
import { actionSchema, assignSchema, complaintListSchema, createComplaintSchema, resolveSchema, verifySchema } from './http/schemas.js';
import { member1RequestSchema, member1ResponseSchema, member2RequestSchema, member2ResponseSchema } from './schemas/aiContracts.js';

export interface AppDependencies {
  config?: AppConfig;
  repository?: Repository;
  storage?: StorageAdapter;
  supabase?: SupabaseClient;
  logRequests?: boolean;
}

const ok = (response: express.Response, data: unknown, status = 200) => response.status(status).json({ success: true, data });

function bodyOf(request: Request): Record<string, unknown> {
  return request.body && typeof request.body === 'object' ? request.body as Record<string, unknown> : {};
}

function createSupabase(config: AppConfig): SupabaseClient | undefined {
  return config.SUPABASE_URL && config.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } })
    : undefined;
}

function nextReference(complaints: Complaint[]): string {
  const max = complaints.reduce((current, item) => Math.max(current, Number(item.reference.match(/^CT-(\d+)$/)?.[1] ?? 1000)), 1000);
  return `CT-${max + 1}`;
}

function evidenceFromStored(stored: StoredObject, kind: Evidence['kind'], latitude: number, longitude: number, createdAt: string): Evidence {
  return { id: randomUUID(), kind, url: stored.url, mimeType: stored.mimeType, sizeBytes: stored.sizeBytes, latitude, longitude, createdAt };
}

function routeId(request: Request): string {
  const value = request.params.id;
  if (typeof value !== 'string' || !value) throw new AppError(400, 'INVALID_REQUEST', 'A complaint ID is required');
  return value;
}

export function createApp(dependencies: AppDependencies = {}) {
  const config = dependencies.config ?? loadConfig();
  const supabase = dependencies.supabase ?? createSupabase(config);
  const repository: Repository = dependencies.repository ?? (supabase ? new SupabaseRepository(supabase) : new MemoryRepository());
  const storage: StorageAdapter = dependencies.storage ?? (supabase ? new SupabaseStorage(supabase) : new MemoryStorage());
  const openrouter = new OpenRouterClient(config);
  const groq = new GroqClient(config);
  const imageAnalyzer = new ImageAnalyzer(openrouter);
  const decisionEngine = new DecisionEngine(groq);
  const verificationEngine = new VerificationEngine(openrouter);
  const upload = createUpload(config.MAX_UPLOAD_BYTES);
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(cors({ origin: config.CORS_ORIGIN === '*' ? true : config.CORS_ORIGIN.split(',').map((item) => item.trim()), credentials: config.CORS_ORIGIN !== '*' }));
  app.use(express.json({ limit: '11mb', strict: true }));
  app.use(express.urlencoded({ extended: false, limit: '1mb' }));
  if (dependencies.logRequests !== false) app.use(requestLogger);
  app.use(rateLimit({ windowMs: 15 * 60_000, limit: config.NODE_ENV === 'test' ? 1000 : 200, standardHeaders: 'draft-8', legacyHeaders: false }));
  app.use(createAuth(config.demoAuth ?? config.demoMode, supabase));

  app.get('/api/health', (_request, response) => ok(response, {
    status: 'ok', mode: config.demoMode ? 'demo' : 'supabase', timestamp: new Date().toISOString(),
    providers: { openrouter: openrouter.available, groq: groq.available },
  }));

  app.get('/api/demo', async (_request, response) => ok(response, {
    enabled: config.demoMode, authentication: { headers: ['x-demo-role', 'x-demo-user'], roles: ['citizen', 'dispatcher', 'field_worker', 'supervisor', 'admin'] },
    featuredComplaint: await repository.getComplaint('CT-1001'),
  }));

  app.post('/api/demo/reset', requireRoles('admin'), async (_request, response) => {
    if (!config.demoMode || !repository.reset) throw new AppError(409, 'DEMO_UNAVAILABLE', 'Demo reset is available only with the in-memory repository');
    await repository.reset();
    return ok(response, { reset: true });
  });

  app.post('/api/ai/analyze-image', upload, async (request, response) => {
    const input = member1RequestSchema.parse(bodyOf(request));
    const stored = await storeRequestImage(request, input.image_url?.startsWith('data:') ? input.image_url : undefined, storage, 'initial', config.MAX_UPLOAD_BYTES);
    const imageUrl = stored?.url ?? input.image_url;
    if (!imageUrl) throw new AppError(400, 'IMAGE_REQUIRED', 'An image URL or image file is required');
    const imageAnalysis = await imageAnalyzer.analyzeVision({
      imageUrl,
      ...(input.citizen_description ? { description: input.citizen_description } : {}),
    });
    return ok(response, member1ResponseSchema.parse({ complaint_id: input.complaint_id, image_analysis: imageAnalysis }));
  });

  app.post('/api/ai/decide', async (request, response) => {
    const input = member2RequestSchema.parse(bodyOf(request));
    const decision = await decisionEngine.decideMember2(input);
    return ok(response, member2ResponseSchema.parse(decision));
  });

  app.post('/api/complaints', upload, async (request, response) => {
    const input = createComplaintSchema.parse(bodyOf(request));
    const now = new Date();
    const createdAt = now.toISOString();
    const stored = await storeRequestImage(request, input.imageDataUrl, storage, 'initial', config.MAX_UPLOAD_BYTES);
    const analysis = await imageAnalyzer.analyze({
      ...(stored ? { imageUrl: stored.url } : {}),
      description: input.description,
      ...(input.categoryHint ? { categoryHint: input.categoryHint } : {}),
    });
    const decision = await decisionEngine.decide({
      description: input.description, analysis, nearSchool: input.nearSchool, nearHospital: input.nearHospital,
      nearTransit: input.nearTransit, trafficImpact: input.trafficImpact, peopleAtRisk: input.peopleAtRisk, ageHours: input.ageHours,
    }, now);
    const all = await repository.getAllComplaints();
    const duplicate = findDuplicate(all, input, [analysis.category, ...analysis.secondaryCategories]);
    const id = randomUUID();
    const evidence = stored ? [evidenceFromStored(stored, 'initial', input.latitude, input.longitude, createdAt)] : [];
    const complaint: Complaint = {
      id, reference: nextReference(all), title: input.title ?? `${analysis.category.replace('_', ' ')} report`,
      description: input.description, category: analysis.category, secondaryCategories: analysis.secondaryCategories,
      status: 'triaged', priority: decision.priority, priorityScore: decision.priorityScore, priorityBreakdown: decision.priorityBreakdown,
      latitude: input.latitude, longitude: input.longitude, address: input.address, reporterId: request.actor.id,
      analysis, decision, ...(duplicate ? { duplicateOf: duplicate.id } : {}), createdAt, updatedAt: createdAt,
      statusHistory: [
        { id: randomUUID(), status: 'submitted', note: 'Complaint submitted', actorId: request.actor.id, createdAt },
        { id: randomUUID(), status: 'triaged', note: 'Automated triage completed', actorId: 'ai-triage', createdAt },
      ], assignments: [], evidence,
    };
    const saved = await repository.createComplaint(complaint);
    await repository.addNotification({ id: randomUUID(), userId: request.actor.id, complaintId: id, title: `${saved.reference} received`, message: `Your complaint was triaged as ${saved.priority}.`, read: false, createdAt });
    return ok(response, saved, 201);
  });

  app.get('/api/complaints', async (request, response) => ok(response, await repository.listComplaints(complaintListSchema.parse(request.query) as ComplaintFilters)));

  app.get('/api/complaints/:id', async (request, response) => {
    const item = await repository.getComplaint(routeId(request));
    if (!item) throw new AppError(404, 'COMPLAINT_NOT_FOUND', 'Complaint not found');
    return ok(response, item);
  });

  app.post('/api/complaints/:id/assign', requireRoles('field_worker', 'dispatcher', 'supervisor', 'admin'), async (request, response) => {
    const input = assignSchema.parse(bodyOf(request));
    const item = await repository.getComplaint(routeId(request));
    if (!item) throw new AppError(404, 'COMPLAINT_NOT_FOUND', 'Complaint not found');
    if (['resolved', 'rejected'].includes(item.status)) throw new AppError(409, 'INVALID_STATUS', `Cannot assign a ${item.status} complaint`);
    const updated = await repository.addAssignment(item.id, { id: randomUUID(), department: input.department, assigneeId: input.assigneeId, assignedBy: request.actor.id, createdAt: new Date().toISOString() });
    return ok(response, updated);
  });

  app.post('/api/complaints/:id/start', requireRoles('field_worker', 'supervisor', 'admin'), async (request, response) => {
    const input = actionSchema.parse(bodyOf(request));
    const item = await repository.getComplaint(routeId(request));
    if (!item) throw new AppError(404, 'COMPLAINT_NOT_FOUND', 'Complaint not found');
    if (!['assigned', 'reopened'].includes(item.status)) throw new AppError(409, 'INVALID_STATUS', 'Only assigned or reopened complaints can be started');
    const now = new Date().toISOString();
    return ok(response, await repository.addStatus(item.id, { id: randomUUID(), status: 'in_progress', note: input.note, actorId: request.actor.id, createdAt: now }, 'in_progress'));
  });

  app.post('/api/complaints/:id/resolve', requireRoles('field_worker', 'supervisor', 'admin'), upload, async (request, response) => {
    const input = resolveSchema.parse(bodyOf(request));
    const item = await repository.getComplaint(routeId(request));
    if (!item) throw new AppError(404, 'COMPLAINT_NOT_FOUND', 'Complaint not found');
    if (item.status !== 'in_progress') throw new AppError(409, 'INVALID_STATUS', 'Only in-progress complaints can be resolved');
    const stored = await storeRequestImage(request, input.imageDataUrl, storage, 'resolution', config.MAX_UPLOAD_BYTES);
    if (!stored) throw new AppError(400, 'EVIDENCE_REQUIRED', 'Resolution image evidence is required');
    const now = new Date().toISOString();
    await repository.addEvidence(item.id, evidenceFromStored(stored, 'resolution', input.latitude, input.longitude, now));
    return ok(response, await repository.addStatus(item.id, { id: randomUUID(), status: 'resolved_pending_verification', note: input.note, actorId: request.actor.id, createdAt: now }, 'resolved_pending_verification'));
  });

  app.post('/api/complaints/:id/verify-resolution', requireRoles('field_worker', 'dispatcher', 'supervisor', 'admin'), async (request, response) => {
    const input = verifySchema.parse(bodyOf(request));
    const item = await repository.getComplaint(routeId(request));
    if (!item) throw new AppError(404, 'COMPLAINT_NOT_FOUND', 'Complaint not found');
    if (item.status !== 'resolved_pending_verification') throw new AppError(409, 'INVALID_STATUS', 'Complaint is not awaiting verification');
    const verification = await verificationEngine.verify(item, input.forceReview);
    const status = verification.passed ? 'resolved' as const : 'reopened' as const;
    await repository.setVerification(item.id, verification, status);
    await repository.addNotification({ id: randomUUID(), userId: item.reporterId, complaintId: item.id, title: `${item.reference} ${status}`, message: verification.passed ? 'Resolution evidence passed visual and GPS verification.' : 'Resolution requires further work or human review.', read: false, createdAt: verification.createdAt });
    const reviewRequired = !verification.passed && verification.confidence >= 0.5;
    return ok(response, {
      visual_match: verification.visualScore / 100,
      location_match: verification.gpsDistanceMeters <= 100,
      distance_meters: verification.gpsDistanceMeters,
      scene_changed: verification.visualScore >= 60,
      issue_resolved: verification.passed,
      confidence: verification.confidence,
      verdict: verification.passed ? 'VERIFIED' : reviewRequired ? 'REVIEW REQUIRED' : 'VERIFICATION FAILED',
    });
  });

  app.get('/api/dashboard', async (_request, response) => ok(response, await repository.dashboard()));
  app.get('/api/departments', async (_request, response) => ok(response, await repository.getDepartments()));
  app.get('/api/notifications', async (request, response) => {
    const privileged = ['dispatcher', 'supervisor', 'admin'].includes(request.actor.role);
    return ok(response, await repository.getNotifications(privileged ? undefined : request.actor.id));
  });

  app.use(notFound);
  app.use(errorHandler);
  return app;
}

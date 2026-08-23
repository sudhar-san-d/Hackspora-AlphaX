import { beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { MemoryRepository } from '../src/repositories/memoryRepository.js';
import type { AppConfig } from '../src/config.js';

const config: AppConfig = { NODE_ENV: 'test', PORT: 4000, CORS_ORIGIN: '*', OPENROUTER_MODEL: 'test', GROQ_MODEL: 'test', MAX_UPLOAD_BYTES: 8_000_000, demoMode: true };
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', 'base64');
let repository: MemoryRepository;
let app: ReturnType<typeof createApp>;

beforeEach(() => {
  repository = new MemoryRepository();
  app = createApp({ config, repository, logRequests: false });
});

describe('API routes', () => {
  it('returns health and exact seeded priority distribution', async () => {
    const health = await request(app).get('/api/health').expect(200);
    expect(health.body).toMatchObject({ success: true, data: { status: 'ok', mode: 'demo' } });
    const list = await request(app).get('/api/complaints?pageSize=100').expect(200);
    const counts = list.body.data.items.reduce((out: Record<string, number>, item: { priority: string }) => ({ ...out, [item.priority]: (out[item.priority] ?? 0) + 1 }), {});
    expect(counts).toEqual({ critical: 3, high: 5, medium: 7, low: 5 });
    const featured = await request(app).get('/api/complaints/CT-1001').expect(200);
    expect(featured.body.data).toMatchObject({ priorityScore: 85, verification: { visualScore: 91, gpsDistanceMeters: 8, confidence: 0.93 } });
  });

  it.each([
    ['pothole', 'A deep pothole is breaking the road beside homes', ['roads']],
    ['garbage', 'Garbage and trash are piled beside the public market', ['sanitation']],
    ['open_drain', 'An open drain has no cover beside the walkway', ['drainage', 'public_safety']],
    ['broken_streetlight', 'The broken streetlight leaves this road dark', ['electrical']],
    ['water_leakage', 'A burst water leak damaged the road and blocks a traffic lane', ['water', 'roads', 'traffic']],
  ] as const)('creates and routes a %s complaint', async (categoryHint, description, departments) => {
    const response = await request(app).post('/api/complaints').set('x-demo-user', 'route-test').send({
      description, categoryHint, latitude: 13.08, longitude: 80.27, address: 'Route Test Address', trafficImpact: categoryHint === 'water_leakage',
    }).expect(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.category).toBe(categoryHint);
    expect(response.body.data.decision.departments).toEqual(expect.arrayContaining(departments));
    expect(response.body.data.analysis.observedFacts).toEqual([]);
  });

  it('enforces RBAC and runs assign/start/resolve/verify lifecycle', async () => {
    await request(app).post('/api/complaints/CT-1002/assign').send({ department: 'drainage', assigneeId: 'worker-9' }).expect(403);
    await request(app).post('/api/complaints/CT-1002/assign').set('x-demo-role', 'dispatcher').send({ department: 'drainage', assigneeId: 'worker-9' }).expect(200);
    await request(app).post('/api/complaints/CT-1002/start').set('x-demo-role', 'field_worker').send({ note: 'Crew arrived' }).expect(200);
    const resolved = await request(app).post('/api/complaints/CT-1002/resolve').set('x-demo-role', 'field_worker')
      .field('note', 'Drain cover installed').field('latitude', '13.08710').field('longitude', '80.27810').attach('evidence', png, { filename: 'after.png', contentType: 'image/png' }).expect(200);
    expect(resolved.body.data.status).toBe('resolved_pending_verification');
    const verified = await request(app).post('/api/complaints/CT-1002/verify-resolution').set('x-demo-role', 'supervisor').send({}).expect(200);
    expect(verified.body.data).toMatchObject({ visual_match: 0.91, location_match: true, issue_resolved: true, confidence: 0.93, verdict: 'VERIFIED' });
    const updated = await request(app).get('/api/complaints/CT-1002').expect(200);
    expect(updated.body.data.status).toBe('resolved');
  });

  it('rejects spoofed MIME content and uses consistent errors', async () => {
    const response = await request(app).post('/api/ai/analyze-image').field('complaint_id', 'CT-TEST').attach('image', Buffer.from('not an image'), { filename: 'fake.png', contentType: 'image/png' }).expect(400);
    expect(response.body).toMatchObject({ success: false, error: { code: 'INVALID_IMAGE' } });
  });

  it('preserves the strict Member 1 and Member 2 contracts', async () => {
    const image = await request(app).post('/api/ai/analyze-image').send({ complaint_id: 'CT-AI-1', image_url: 'https://example.com/pothole.jpg', citizen_description: 'Huge pothole near school and bus stop.' }).expect(200);
    expect(image.body.data).toMatchObject({ complaint_id: 'CT-AI-1', image_analysis: { detected_issue: 'Pothole', infrastructure: 'Road', estimated_visual_severity: 8 } });
    const decision = await request(app).post('/api/ai/decide').send({
      complaint_id: 'CT-AI-1',
      citizen: { description: 'Huge pothole near school and bus stop causing danger to vehicles.' },
      location: { latitude: 11.0168, longitude: 76.9558, ward: 'Ward 14', zone: 'Central', nearby_landmark: 'Bus Stand', nearby_sensitive_places: ['School'], traffic_level: 'HIGH' },
      image_analysis: image.body.data.image_analysis,
    }).expect(200);
    expect(decision.body.data).toMatchObject({
      complaint_id: 'CT-AI-1', classification: { category: 'Road Infrastructure', issue: 'Pothole' },
      responsibility: { primary_department: 'Roads Department', secondary_departments: [], multi_agency: false },
      priority: { severity: 8, urgency: 9, public_risk: 9, priority_level: 'CRITICAL' },
      sla: { target_hours: 6 }, incident: { possible_duplicate: false },
    });
  });

  it('returns dashboard, departments, notifications, and demo metadata', async () => {
    await request(app).get('/api/dashboard').expect(200).expect(({ body }) => expect(body.data.totals.all).toBe(20));
    await request(app).get('/api/departments').expect(200).expect(({ body }) => expect(body.data).toHaveLength(7));
    await request(app).get('/api/notifications').set('x-demo-user', 'demo-citizen-1').expect(200).expect(({ body }) => expect(body.success).toBe(true));
    await request(app).get('/api/demo').expect(200).expect(({ body }) => expect(body.data.featuredComplaint.reference).toBe('CT-1001'));
  });
});

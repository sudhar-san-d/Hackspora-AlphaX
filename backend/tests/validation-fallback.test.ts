import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { createComplaintSchema } from '../src/http/schemas.js';
import { parseModelJson } from '../src/utils/json.js';
import { ImageAnalyzer } from '../src/ai/imageAnalyzer.js';
import { OpenRouterClient } from '../src/ai/openrouter.js';
import type { AppConfig } from '../src/config.js';

const config: AppConfig = { NODE_ENV: 'test', PORT: 4000, CORS_ORIGIN: '*', OPENROUTER_MODEL: 'test', GROQ_MODEL: 'test', MAX_UPLOAD_BYTES: 8_000_000, demoMode: true };

describe('validation and AI fallback', () => {
  it('strictly rejects unknown complaint fields', () => {
    expect(() => createComplaintSchema.parse({ description: 'A valid issue description', latitude: 10, longitude: 20, address: 'Main Street', unexpected: true })).toThrow();
  });

  it('coerces valid multipart scalar fields', () => {
    const parsed = createComplaintSchema.parse({ description: 'A valid issue description', latitude: '10.2', longitude: '20.3', address: 'Main Street', nearSchool: 'true', peopleAtRisk: '4' });
    expect(parsed).toMatchObject({ latitude: 10.2, longitude: 20.3, nearSchool: true, peopleAtRisk: 4 });
  });

  it('repairs model JSON once and rejects unrecoverable output', () => {
    const schema = z.object({ value: z.number() }).strict();
    expect(parseModelJson("```json\n{'value': 4,}\n```", schema)).toEqual({ value: 4 });
    expect(parseModelJson('not json at all', schema)).toBeNull();
  });

  it('never invents visual observations when providers are unavailable', async () => {
    const analyzer = new ImageAnalyzer(new OpenRouterClient(config));
    const result = await analyzer.analyze({ description: 'Broken streetlight on Main Street' });
    expect(result).toMatchObject({ category: 'broken_streetlight', observedFacts: [], imageQuality: 'unclear', requiresHumanReview: true, source: 'deterministic_fallback' });
    expect(result.confidence).toBeLessThan(0.5);
  });
});

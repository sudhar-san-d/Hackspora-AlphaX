import { z } from 'zod';
import type { AppConfig } from '../config.js';
import type { DecisionInput, DepartmentCode, Priority } from '../types.js';
import { departmentCodes } from '../types.js';
import { parseModelJson } from '../utils/json.js';
import { decisionFactorsSchema, type DecisionFactors, type Member2Request } from '../schemas/aiContracts.js';

const reasoningSchema = z.object({
  reasoning: z.array(z.string().min(1).max(240)).min(1).max(5),
  departments: z.array(z.enum(departmentCodes)).min(1).max(5),
}).strict();

export interface GroqReasoning { reasoning: string[]; departments: DepartmentCode[] }

export class GroqClient {
  constructor(private readonly config: AppConfig) {}

  get available(): boolean { return Boolean(this.config.GROQ_API_KEY); }

  async decideFactors(input: Member2Request, fallback: DecisionFactors): Promise<DecisionFactors | null> {
    if (!this.config.GROQ_API_KEY) return null;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${this.config.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.config.GROQ_MODEL,
          temperature: 0,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: 'You are CivicTrack AI Decision Engine. Return JSON only with category, subcategory, issue, severity, urgency, public_risk, population_impact, location_risk, sla_risk, reason, confidence. Each factor must be an integer 0-10. Use only supplied evidence. Do not calculate priority score, level, SLA, duplicate confidence, or final department; application code owns those decisions.' },
            { role: 'user', content: JSON.stringify({ input, deterministic_baseline: fallback }) },
          ],
        }),
        signal: controller.signal,
      });
      if (!response.ok) return null;
      const body = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
      const raw = body.choices?.[0]?.message?.content;
      return raw ? parseModelJson(raw, decisionFactorsSchema) : null;
    } catch {
      return null;
    } finally {
      clearTimeout(timeout);
    }
  }

  async reason(input: DecisionInput, deterministic: { score: number; priority: Priority; departments: DepartmentCode[] }): Promise<GroqReasoning | null> {
    if (!this.config.GROQ_API_KEY) return null;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${this.config.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.config.GROQ_MODEL,
          temperature: 0,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: 'You explain deterministic civic triage decisions. Return JSON only: reasoning (1-5 short factual strings) and departments. Do not alter the supplied score or priority and do not invent image facts.' },
            { role: 'user', content: JSON.stringify({ input, deterministic }) },
          ],
        }),
        signal: controller.signal,
      });
      if (!response.ok) return null;
      const body = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
      const raw = body.choices?.[0]?.message?.content;
      return raw ? parseModelJson(raw, reasoningSchema) : null;
    } catch {
      return null;
    } finally {
      clearTimeout(timeout);
    }
  }
}

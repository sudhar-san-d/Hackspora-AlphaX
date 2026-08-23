import type { Decision, DecisionInput } from '../types.js';
import { routeDepartments } from '../services/departmentRouter.js';
import { calculatePriority } from '../services/priorityEngine.js';
import { calculateSla } from '../services/slaEngine.js';
import type { GroqClient } from './groq.js';
import type { Member2Request, Member2Response } from '../schemas/aiContracts.js';
import { buildMember2Response, deterministicDecisionFactors } from '../services/publicDecisionEngine.js';

export class DecisionEngine {
  constructor(private readonly groq: GroqClient) {}

  async decideMember2(input: Member2Request, duplicateConfidence = 0.12): Promise<Member2Response> {
    const fallback = deterministicDecisionFactors(input);
    const providerFactors = await this.groq.decideFactors(input, fallback);
    return buildMember2Response(input, providerFactors ?? fallback, duplicateConfidence);
  }

  async decide(input: DecisionInput, now = new Date()): Promise<Decision> {
    const priority = calculatePriority(input);
    const deterministicDepartments = routeDepartments(input.description, input.analysis, input.trafficImpact);
    const sla = calculateSla(priority.priority, now);
    const groqResult = await this.groq.reason(input, { score: priority.score, priority: priority.priority, departments: deterministicDepartments });
    const departments = groqResult
      ? [...new Set([...deterministicDepartments, ...groqResult.departments])]
      : deterministicDepartments;
    const reasoning = groqResult?.reasoning ?? [
      `Deterministic priority score ${priority.score}/100 maps to ${priority.priority}.`,
      input.analysis.requiresHumanReview ? 'Image evidence is unclear or model confidence is limited; human review is required.' : 'Image evidence passed structured confidence checks.',
      `Routing matched: ${departments.join(', ')}.`,
    ];
    return {
      category: input.analysis.category,
      priority: priority.priority,
      priorityScore: priority.score,
      priorityBreakdown: priority.breakdown,
      departments,
      ...sla,
      reasoning,
      requiresHumanReview: input.analysis.requiresHumanReview,
      source: groqResult ? 'groq' : 'deterministic_fallback',
    };
  }
}

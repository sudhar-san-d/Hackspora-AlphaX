import type { ComplaintCategory, ImageAnalysis } from '../types.js';
import { inferCategories } from '../services/fuzzyRules.js';
import { parseModelJson } from '../utils/json.js';
import { visionAnalysisSchema, type VisionAnalysisContract } from '../schemas/aiContracts.js';
import type { OpenRouterClient } from './openrouter.js';

const severeTerms = /collapsed|electrocution|exposed wire|deep|major|burst|school|hospital|injury|blocked|sinkhole/i;

const issueNames: Record<ComplaintCategory, { issue: string; infrastructure: string }> = {
  pothole: { issue: 'Pothole', infrastructure: 'Road' },
  garbage: { issue: 'Garbage Accumulation', infrastructure: 'Public Space' },
  open_drain: { issue: 'Open Drain', infrastructure: 'Drainage' },
  broken_streetlight: { issue: 'Broken Streetlight', infrastructure: 'Street Lighting' },
  water_leakage: { issue: 'Water Leakage', infrastructure: 'Water Distribution' },
  road_damage: { issue: 'Road Damage', infrastructure: 'Road' },
  traffic_signal: { issue: 'Traffic Signal', infrastructure: 'Traffic Control' },
  flooding: { issue: 'Flooding', infrastructure: 'Drainage' },
  sewage: { issue: 'Sewage Overflow', infrastructure: 'Sewerage' },
  other: { issue: 'Unknown', infrastructure: 'Unknown' },
};

const issueToCategory = (analysis: VisionAnalysisContract, description = ''): ComplaintCategory => {
  const inferred = inferCategories(`${analysis.detected_issue} ${analysis.infrastructure} ${description}`);
  return inferred[0] ?? 'other';
};

export class ImageAnalyzer {
  constructor(private readonly openrouter: OpenRouterClient) {}

  async analyzeVision(input: { imageUrl?: string; description?: string; categoryHint?: ComplaintCategory }): Promise<VisionAnalysisContract> {
    if (input.imageUrl) {
      const raw = await this.openrouter.analyzeImage(input.imageUrl, input.description ?? 'No context supplied');
      if (raw) {
        const parsed = parseModelJson(raw, visionAnalysisSchema);
        if (parsed) return parsed;
      }
    }
    const inferred = input.categoryHint ?? inferCategories(input.description ?? '')[0] ?? 'other';
    if (inferred === 'other') {
      return {
        detected_issue: 'Unknown',
        infrastructure: 'Unknown',
        visual_description: 'Image is too unclear to reliably identify the reported civic issue.',
        damage_indicators: [],
        safety_indicators: [],
        estimated_visual_severity: 0,
        confidence: 0.31,
      };
    }
    const labels = issueNames[inferred];
    const severe = severeTerms.test(input.description ?? '');
    return {
      detected_issue: labels.issue,
      infrastructure: labels.infrastructure,
      visual_description: `Demo mode identified evidence consistent with ${labels.issue.toLowerCase()}. Live visual analysis is unavailable, so this result must be reviewed with the submitted image.`,
      damage_indicators: inferred === 'pothole' || inferred === 'road_damage' ? ['broken asphalt', 'road surface depression'] : [],
      safety_indicators: severe ? ['reported public safety hazard'] : [],
      estimated_visual_severity: severe ? 8 : 5,
      confidence: 0.72,
    };
  }

  async analyze(input: { imageUrl?: string; description?: string; categoryHint?: ComplaintCategory }): Promise<ImageAnalysis> {
    if (!input.imageUrl) return this.fallback(input.description ?? '', input.categoryHint);
    const vision = await this.analyzeVision(input);
    const category = input.categoryHint ?? issueToCategory(vision, input.description);
    const inferred = inferCategories(input.description ?? '');
    return {
      category,
      secondaryCategories: inferred.filter((item) => item !== category).slice(0, 4),
      severity: vision.estimated_visual_severity * 10,
      confidence: vision.confidence,
      observedFacts: vision.detected_issue === 'Unknown' ? [] : [vision.visual_description, ...vision.damage_indicators],
      hazards: vision.safety_indicators,
      imageQuality: vision.confidence >= 0.75 ? 'clear' : vision.confidence >= 0.45 ? 'limited' : 'unclear',
      requiresHumanReview: vision.confidence < 0.6,
      source: this.openrouter.available && input.imageUrl ? 'openrouter' : 'deterministic_fallback',
    };
  }

  fallback(description: string, categoryHint?: ComplaintCategory): ImageAnalysis {
    const inferred = inferCategories(description);
    const category = categoryHint ?? inferred[0] ?? 'other';
    const hasTextClassification = category !== 'other';
    return {
      category,
      secondaryCategories: inferred.filter((item) => item !== category).slice(0, 4),
      severity: hasTextClassification ? (severeTerms.test(description) ? 80 : 50) : 0,
      confidence: hasTextClassification ? 0.35 : 0,
      observedFacts: [],
      hazards: severeTerms.test(description) ? ['Potential safety risk stated by reporter; not visually confirmed'] : [],
      imageQuality: 'unclear',
      requiresHumanReview: true,
      source: 'deterministic_fallback',
    };
  }
}

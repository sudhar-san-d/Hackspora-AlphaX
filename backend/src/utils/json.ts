import type { ZodType } from 'zod';

function extractCandidate(raw: string): string {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1];
  if (fenced) return fenced.trim();
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  return start >= 0 && end > start ? raw.slice(start, end + 1) : raw.trim();
}

function repairJsonOnce(candidate: string): string {
  return candidate
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/,\s*([}\]])/g, '$1')
    .replace(/([{,]\s*)'([^']+)'\s*:/g, '$1"$2":')
    .replace(/:\s*'([^']*)'\s*([,}])/g, ':"$1"$2');
}

export function parseModelJson<T>(raw: string, schema: ZodType<T>): T | null {
  const candidate = extractCandidate(raw);
  try {
    return schema.parse(JSON.parse(candidate));
  } catch {
    try {
      return schema.parse(JSON.parse(repairJsonOnce(candidate)));
    } catch {
      return null;
    }
  }
}

// ─── Data model ───────────────────────────────────────────────────────────────

export type QuadrantKey = 'strengths' | 'weaknesses' | 'opportunities' | 'threats';

export interface SwotItem {
  id: string;
  text: string;
}

export interface SwotData {
  strengths: SwotItem[];
  weaknesses: SwotItem[];
  opportunities: SwotItem[];
  threats: SwotItem[];
}

export interface ISwotMatrixProps {
  swotData: string;
  onDataChanged: (newData: string) => void;
  disabled?: boolean;
}

// ─── Constants ─────────────────────────────────────────────────────────────────

export const QUADRANT_CONFIG: Record<QuadrantKey, { label: string; headerColor: string; bgColor: string }> = {
  strengths:     { label: 'Strengths',     headerColor: '#107c10', bgColor: '#dff6dd' },
  weaknesses:    { label: 'Weaknesses',    headerColor: '#a80000', bgColor: '#fde7e9' },
  opportunities: { label: 'Opportunities', headerColor: '#0078d4', bgColor: '#deecf9' },
  threats:       { label: 'Threats',       headerColor: '#c7530f', bgColor: '#fed9cc' },
};

export const EMPTY_DATA: SwotData = { strengths: [], weaknesses: [], opportunities: [], threats: [] };

export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function parseSwotData(json: string | null | undefined): SwotData {
  if (!json) return EMPTY_DATA;
  try {
    const parsed = JSON.parse(json) as Partial<Record<QuadrantKey, SwotItem[]>>;
    return {
      strengths:     Array.isArray(parsed.strengths)     ? parsed.strengths     : [],
      weaknesses:    Array.isArray(parsed.weaknesses)    ? parsed.weaknesses    : [],
      opportunities: Array.isArray(parsed.opportunities) ? parsed.opportunities : [],
      threats:       Array.isArray(parsed.threats)       ? parsed.threats       : [],
    };
  } catch {
    return EMPTY_DATA;
  }
}

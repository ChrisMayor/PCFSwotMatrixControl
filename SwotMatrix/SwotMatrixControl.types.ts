export type QuadrantKey = 'strengths' | 'weaknesses' | 'opportunities' | 'threats';

export interface SwotItem {
  id: string;
  text: string;
}

export class SwotData {
  constructor(
    public strengths: SwotItem[] = [],
    public weaknesses: SwotItem[] = [],
    public opportunities: SwotItem[] = [],
    public threats: SwotItem[] = [],
  ) {}

  static readonly empty: SwotData = new SwotData();

  static parse(json: string | null | undefined): SwotData {
    if (!json) return SwotData.empty;
    try {
      const parsed = JSON.parse(json) as Partial<Record<QuadrantKey, SwotItem[]>>;
      return new SwotData(
        Array.isArray(parsed.strengths) ? parsed.strengths : [],
        Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
        Array.isArray(parsed.opportunities) ? parsed.opportunities : [],
        Array.isArray(parsed.threats) ? parsed.threats : [],
      );
    } catch {
      return SwotData.empty;
    }
  }
}

export interface ISwotMatrixProps {
  swotData: string;
  onDataChanged: (newData: string) => void;
  disabled?: boolean;
}

export const QUADRANT_CONFIG: Record<
  QuadrantKey,
  { label: string; headerColor: string; bgColor: string }
> = {
  strengths: { label: 'Strengths', headerColor: '#107c10', bgColor: '#dff6dd' },
  weaknesses: { label: 'Weaknesses', headerColor: '#a80000', bgColor: '#fde7e9' },
  opportunities: { label: 'Opportunities', headerColor: '#0078d4', bgColor: '#deecf9' },
  threats: { label: 'Threats', headerColor: '#c7530f', bgColor: '#fed9cc' },
};

export type DragState = {
  itemId: string;
  fromQuadrant: QuadrantKey;
} | null;

export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

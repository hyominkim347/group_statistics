export interface GroupStats {
  id: string;
  rank: number;
  name: string;
  totalMembers: number;
  activeMembers: number;
  requests: number;
  credits: number;
  avgCredits: number;
  llmCalls: number; // New field: LLM Call Count
  isOthers?: boolean;
}

export interface SummaryMetric {
  label: string;
  value: string | number;
  subText?: string;
  trend?: 'up' | 'down' | 'neutral';
}
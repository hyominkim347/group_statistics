export interface GroupStats {
  id: string;
  rank: number;
  name: string;
  totalMembers: number;
  activeMembers: number;
  requests: number;
  credits: number;
}

export interface SummaryMetric {
  label: string;
  value: string | number;
  subText?: string;
  trend?: 'up' | 'down' | 'neutral';
}
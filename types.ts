export interface GroupStats {
  id: string;
  rank: number;
  name: string;
  totalMembers: number;
  activeMembers: number;
  requests: number;
  credits: number;
  isOthers?: boolean; // New: To identify the "Others" category
}

export interface Member {
  id: string;
  rank: number;
  name: string;
  email: string;
  groupIds: string[]; // New: Array for multi-group support
  requestCount: number;
  credits: number;
  lastActive: string;
}

export interface SummaryMetric {
  label: string;
  value: string | number;
  subText?: string;
  trend?: 'up' | 'down' | 'neutral';
}
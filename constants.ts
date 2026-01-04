import { GroupStats } from './types';

export const MOCK_GROUP_DATA: GroupStats[] = [
  { id: 'g1', rank: 1, name: 'Marketing Team', totalMembers: 45, activeMembers: 38, requests: 12450, credits: 15200 },
  { id: 'g2', rank: 2, name: 'R&D Division', totalMembers: 120, activeMembers: 85, requests: 8900, credits: 11500 },
  { id: 'g3', rank: 3, name: 'Sales Force', totalMembers: 60, activeMembers: 42, requests: 5600, credits: 7200 },
  { id: 'g4', rank: 4, name: 'Customer Support', totalMembers: 30, activeMembers: 28, requests: 4100, credits: 4800 },
  { id: 'g5', rank: 5, name: 'Product Design', totalMembers: 15, activeMembers: 12, requests: 2200, credits: 3100 },
  { id: 'g6', rank: 6, name: 'HR Department', totalMembers: 8, activeMembers: 4, requests: 800, credits: 1200 },
  { id: 'g7', rank: 7, name: 'Operations', totalMembers: 22, activeMembers: 18, requests: 750, credits: 950 },
  { id: 'g8', rank: 8, name: 'Legal Team', totalMembers: 5, activeMembers: 2, requests: 300, credits: 450 },
  { id: 'g9', rank: 9, name: 'Finance', totalMembers: 12, activeMembers: 10, requests: 250, credits: 380 },
  { id: 'g10', rank: 10, name: 'Executive', totalMembers: 6, activeMembers: 6, requests: 150, credits: 200 },
];

export const GROUP_OPTIONS = MOCK_GROUP_DATA.map(g => ({ id: g.id, name: g.name }));

export const MOCK_MEMBER_RANKING = [
  { id: 'm1', rank: 1, name: 'Alice Kim', email: 'alice@company.com', group: 'Marketing Team', requestCount: 2450, credits: 15420 },
  { id: 'm2', rank: 2, name: 'Bob Smith', email: 'bob@company.com', group: 'R&D Division', requestCount: 2120, credits: 12500 },
  { id: 'm3', rank: 3, name: 'Charlie Lee', email: 'charlie@company.com', group: 'Sales Force', requestCount: 1850, credits: 9800 },
  { id: 'm4', rank: 4, name: 'David Park', email: 'david@company.com', group: 'Customer Support', requestCount: 1600, credits: 8200 },
  { id: 'm5', rank: 5, name: 'Eva Chen', email: 'eva@company.com', group: 'Product Design', requestCount: 1200, credits: 7500 },
  { id: 'm6', rank: 6, name: 'Frank White', email: 'frank@company.com', group: 'Marketing Team', requestCount: 950, credits: 5400 },
  { id: 'm7', rank: 7, name: 'Grace Choi', email: 'grace@company.com', group: 'R&D Division', requestCount: 800, credits: 4200 },
  { id: 'm8', rank: 8, name: 'Henry Jones', email: 'henry@company.com', group: 'Operations', requestCount: 650, credits: 3100 },
  { id: 'm9', rank: 9, name: 'Ivy Wilson', email: 'ivy@company.com', group: 'Finance', requestCount: 400, credits: 1800 },
  { id: 'm10', rank: 10, name: 'Jack Brown', email: 'jack@company.com', group: 'Legal Team', requestCount: 150, credits: 950 },
];
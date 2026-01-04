import { GroupStats, Member } from './types';

// Base Group Definitions (Stats will be calculated dynamically)
export const GROUP_DEFINITIONS = [
  { id: 'g1', name: '영업팀 (Sales)' },
  { id: 'g2', name: 'CS팀 (Customer Support)' },
  { id: 'g3', name: '개발팀 (R&D)' },
  { id: 'g4', name: '마케팅팀 (Marketing)' },
  { id: 'g5', name: '제품 디자인 (Product Design)' },
  { id: 'g6', name: '인사팀 (HR)' },
  { id: 'g7', name: '재무팀 (Finance)' },
  { id: 'g8', name: '법무팀 (Legal)' },
  { id: 'g9', name: '경영지원 (Operations)' },
  { id: 'others', name: 'Others (미지정)' },
];

export const GROUP_OPTIONS = GROUP_DEFINITIONS.filter(g => g.id !== 'others');

// Mock Member Data with Multi-group assignments
export const MOCK_MEMBERS: Member[] = [
  // High Usage Users (Multi-group examples)
  { id: 'm1', rank: 1, name: 'Alice Kim', email: 'alice@company.com', groupIds: ['g1', 'g4'], requestCount: 2450, credits: 15420, lastActive: '2023-11-30' }, // Sales & Marketing
  { id: 'm2', rank: 2, name: 'Bob Smith', email: 'bob@company.com', groupIds: ['g3'], requestCount: 2120, credits: 12500, lastActive: '2023-11-29' }, // R&D
  { id: 'm3', rank: 3, name: 'Charlie Lee', email: 'charlie@company.com', groupIds: ['g1'], requestCount: 1850, credits: 9800, lastActive: '2023-11-30' }, // Sales
  { id: 'm4', rank: 4, name: 'David Park', email: 'david@company.com', groupIds: ['g2'], requestCount: 4100, credits: 8200, lastActive: '2023-11-28' }, // CS (High requests, low credits/req)
  { id: 'm5', rank: 5, name: 'Eva Chen', email: 'eva@company.com', groupIds: ['g3', 'g5'], requestCount: 1200, credits: 7500, lastActive: '2023-11-25' }, // R&D & Design
  
  // Mid Usage
  { id: 'm6', rank: 6, name: 'Frank White', email: 'frank@company.com', groupIds: ['g4'], requestCount: 950, credits: 5400, lastActive: '2023-11-20' },
  { id: 'm7', rank: 7, name: 'Grace Choi', email: 'grace@company.com', groupIds: ['g3'], requestCount: 800, credits: 4200, lastActive: '2023-11-15' },
  { id: 'm8', rank: 8, name: 'Henry Jones', email: 'henry@company.com', groupIds: ['g9'], requestCount: 650, credits: 3100, lastActive: '2023-11-10' },
  { id: 'm9', rank: 9, name: 'Ivy Wilson', email: 'ivy@company.com', groupIds: ['g7', 'g8'], requestCount: 400, credits: 1800, lastActive: '2023-11-05' }, // Finance & Legal
  { id: 'm10', rank: 10, name: 'Jack Brown', email: 'jack@company.com', groupIds: [], requestCount: 150, credits: 950, lastActive: '2023-11-01' }, // Unassigned -> Others

  // ... Generate more filler data for realism
  ...Array.from({ length: 40 }, (_, i) => ({
    id: `mx_${i}`,
    rank: 11 + i,
    name: `User ${i + 11}`,
    email: `user${i+11}@company.com`,
    groupIds: i % 5 === 0 ? [] : [GROUP_DEFINITIONS[i % (GROUP_DEFINITIONS.length - 1)].id], // Some unassigned
    requestCount: Math.floor(Math.random() * 500) + 50,
    credits: Math.floor(Math.random() * 1000) + 100,
    lastActive: '2023-11-15'
  }))
];

// Re-export MOCK_GROUP_DATA for backward compatibility with other files if needed,
// though GroupAnalytics will now calculate this dynamically.
// We initialize it with basic structure.
export const MOCK_GROUP_DATA: GroupStats[] = GROUP_DEFINITIONS.map((def, idx) => ({
    id: def.id,
    rank: idx + 1,
    name: def.name,
    totalMembers: 0,
    activeMembers: 0,
    requests: 0,
    credits: 0,
    isOthers: def.id === 'others'
}));

// Backward compatibility for MemberRankingTable (using first group as display)
export const MOCK_MEMBER_RANKING = MOCK_MEMBERS.map(m => ({
    ...m,
    group: m.groupIds.length > 0 ? GROUP_DEFINITIONS.find(g => g.id === m.groupIds[0])?.name || 'Unknown' : 'Others'
}));
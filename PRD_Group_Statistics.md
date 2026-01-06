# PRD: 그룹 통계 대시보드 (Group Statistics Dashboard)

**Version:** 1.0
**Last Updated:** 2026-01-06
**Status:** Draft

---

## 1. 개요 (Overview)

### 1.1 제품 설명
그룹 통계 대시보드는 조직 내 그룹별 LLM 사용량을 추적, 분석, 시각화하는 관리 도구입니다. 관리자가 각 그룹의 리소스 사용 현황을 파악하고, 비용 분배 및 최적화 의사결정을 내릴 수 있도록 지원합니다.

### 1.2 목표
- 그룹별 LLM 리소스 사용량의 투명한 가시성 제공
- 데이터 기반 비용 관리 및 예산 수립 지원
- 사용 패턴 분석을 통한 최적화 기회 식별

---

## 2. 핵심 기능 요구사항 (Functional Requirements)

### 2.1 대시보드 구성

#### 2.1.1 통계 탭 네비게이션
| 탭 | 설명 | 주요 지표 |
|----|------|----------|
| 사용량 (Usage) | 전체 사용량 메트릭 | 멤버 요청 횟수, LLM 크레딧, LLM 호출 횟수 |
| 멤버 수 (Member Count) | 활성 멤버 추이 | 일별 활성 멤버 수, 멤버 랭킹 |
| 그룹 통계 (Group) | 그룹별 상세 분석 | 그룹 순위, 크레딧, 요청 수, LLM 호출 수 |

#### 2.1.2 그룹 통계 페이지 구성요소

**A. 요약 카드 (Summary Cards)**
- Total Project Credits: 전체 크레딧 사용량
- Total Project Requests: 전체 쿼리 발생 수
- Total Active Members: 기간 내 활성 멤버 수

**B. 시각화 차트 (Visual Insights)**
4개의 수평 막대 차트로 구성:
| 차트 | 메트릭 | 정렬 기준 |
|------|--------|----------|
| Top Groups by Credit Usage | credits | 크레딧 내림차순 |
| Top Groups by Member Requests | requests | 요청 수 내림차순 |
| Top Groups by LLM Calls | llmCalls | LLM 호출 수 내림차순 |
| Top Groups by Active Members | activeMembers | 활성 멤버 내림차순 |

- 각 차트는 **상위 7개 그룹**만 표시
- 1위 그룹은 강조 색상으로 표시

**C. 상세 테이블 (Data Table)**
- 컬럼: Rank, Group Name, Total Members, Active Members, Request Count, Avg Credit/Member, Credit Usage
- 정렬 기능: 모든 컬럼에 대해 오름차순/내림차순 정렬 가능
- 페이지네이션: 페이지당 10개 항목

### 2.2 필터 및 조회 조건

#### 2.2.1 그룹 필터
- 드롭다운 선택기로 특정 그룹 필터링
- 검색 기능 지원 (그룹명 부분 일치)
- 선택 해제 시 전체 그룹 표시

#### 2.2.2 기간 필터
| 항목 | 사양 |
|------|------|
| 기본값 | 최근 30일 |
| 최소 기간 | 1일 |
| 최대 기간 | **12개월 (365일)** |
| 입력 방식 | Date Picker (시작일 - 종료일) |

**기간 유효성 검증:**
- 종료일 < 시작일: `"End date must be after start date."` 에러 표시
- 기간 > 365일: `"Maximum query period is 12 months."` 에러 표시

### 2.3 데이터 내보내기

#### 2.3.1 CSV Export
- 파일명 형식: `GroupStatistics_{시작일}_{종료일}.csv`
- 인코딩: UTF-8 with BOM (Excel 호환)
- 포함 컬럼: Rank, Group Name, Total Members, Active Members, Total Queries, LLM Calls, LLM Credit Usage

---

## 3. 데이터 집계 정책 (Data Aggregation Policies)

### 3.1 핵심 집계 원칙

#### 3.1.1 현재 멤버 구성 기준 집계
> **정책:** 통계는 **현재 시점의 멤버-그룹 매핑**을 기준으로 집계됩니다.

- 과거 기간 조회 시에도 현재 그룹 배치 기준으로 계산
- 멤버의 그룹 이동 이력은 반영되지 않음

#### 3.1.2 다중 그룹 소속 멤버 처리 (Full Attribution)
> **정책:** 다중 그룹 소속 멤버의 사용량은 **소속된 모든 그룹에 100% 중복 집계**됩니다.

```
예시:
- 멤버 A: Marketing Team, R&D Division 소속
- 사용량: 100 크레딧
- 결과:
  - Marketing Team: +100 크레딧
  - R&D Division: +100 크레딧
```

**이 정책의 의미:**
- 그룹별 통계 합계 ≠ 전체 프로젝트 통계 (중복 발생)
- 그룹 간 비교 시 공정한 사용량 비교 가능
- 1/N 분할 방식 대비 그룹 기여도 명확화

#### 3.1.3 그룹 미지정 멤버 처리
> **정책:** 그룹에 배정되지 않은 멤버는 **'Others (Unassigned)'** 그룹으로 분류됩니다.

- Others 그룹은 랭킹에서 제외 (rank = 999)
- 테이블에서 필터링되어 표시되지 않음
- 요약 통계에는 포함

### 3.2 메트릭 정의

| 메트릭 | 정의 | 계산 방식 |
|--------|------|----------|
| **Total Members** | 그룹에 소속된 전체 멤버 수 | 다중 소속 시 각 그룹에 +1 |
| **Active Members** | 조회 기간 내 활동한 멤버 수 | lastActive가 기간 내인 멤버 카운트 |
| **Requests** | 총 요청 횟수 | 활성 멤버의 requestCount 합계 |
| **Credits** | 총 크레딧 사용량 | 활성 멤버의 credits 합계 |
| **Avg Credits** | 멤버당 평균 크레딧 | credits ÷ totalMembers |
| **LLM Calls** | LLM API 호출 횟수 | 요청 × 배율 (1.2~2.5) |

### 3.3 랭킹 정책

#### 3.3.1 기본 랭킹 기준
- **정렬 기준:** Credit Usage (크레딧 사용량) 내림차순
- **동점 처리:** 안정 정렬 (stable sort) - 기존 순서 유지

#### 3.3.2 랭킹 표시
| 순위 | 표시 |
|------|------|
| 1위 | 금색 트로피 아이콘 |
| 2위 | 은색 트로피 아이콘 |
| 3위 | 동색 트로피 아이콘 |
| 4위~ | 숫자 표시 |

### 3.4 활성 멤버 판정 기준
> **정의:** 조회 기간 내 최소 1회 이상 요청을 수행한 멤버

```
활성 판정 조건:
startDate ≤ member.lastActive ≤ endDate
```

---

## 4. 비기능 요구사항 (Non-Functional Requirements)

### 4.1 성능
| 항목 | 목표 |
|------|------|
| 초기 로딩 | 2초 이내 |
| 필터 적용 | 500ms 이내 |
| CSV 내보내기 | 1000개 그룹 기준 3초 이내 |

### 4.2 반응형 디자인
- 데스크톱: 1280px 이상 (최적화)
- 태블릿: 768px ~ 1279px (2컬럼 그리드)
- 모바일: 768px 미만 (단일 컬럼)

### 4.3 접근성
- 키보드 네비게이션 지원
- 스크린 리더 호환
- WCAG 2.1 AA 준수

---

## 5. 데이터 모델 (Data Model)

### 5.1 GroupStats 인터페이스
```typescript
interface GroupStats {
  id: string;          // 그룹 고유 식별자
  rank: number;        // 크레딧 기준 순위 (Others: 999)
  name: string;        // 그룹 표시명
  totalMembers: number;    // 전체 멤버 수
  activeMembers: number;   // 활성 멤버 수
  requests: number;        // 총 요청 횟수
  credits: number;         // 총 크레딧 사용량
  avgCredits: number;      // 멤버당 평균 크레딧
  llmCalls: number;        // LLM 호출 횟수
  isOthers?: boolean;      // Others 그룹 여부
}
```

### 5.2 Member 인터페이스
```typescript
interface Member {
  id: string;
  groupIds: string[];      // 소속 그룹 ID 배열 (다중 가능)
  lastActive: string;      // 마지막 활동일 (ISO 8601)
  requestCount: number;
  credits: number;
}
```

---

## 6. UI/UX 가이드라인

### 6.1 색상 시스템
| 용도 | 색상 |
|------|------|
| Primary | #7420FF |
| Credit Chart | #7420FF (보라) |
| Request Chart | #3B82F6 (파랑) |
| LLM Calls Chart | #10B981 (초록) |
| Active Members Chart | #F59E0B (주황) |

### 6.2 안내 메시지
대시보드 상단에 다음 안내 표시:
- "현재 멤버 구성을 기준으로 집계된 데이터입니다."
- "다중 소속 멤버의 사용량은 소속된 모든 그룹에 중복 집계됩니다."
- "그룹 미지정 멤버는 'Others'에 포함됩니다."

---

## 7. 향후 고려사항 (Future Considerations)

### 7.1 잠재적 개선 사항
- [ ] 이력 기반 집계 (Historical Attribution) 옵션
- [ ] 1/N 분할 집계 모드 선택 기능
- [ ] 트렌드 비교 (전월 대비, 전년 동기 대비)
- [ ] 그룹 간 비용 분담 리포트
- [ ] 사용량 알림 임계치 설정
- [ ] 그룹 계층 구조 지원 (부서 > 팀)

### 7.2 기술적 고려사항
- 대용량 데이터 처리를 위한 서버 사이드 집계
- 실시간 업데이트 (WebSocket)
- 데이터 캐싱 전략

---

## 8. 부록

### 8.1 용어 정의
| 용어 | 정의 |
|------|------|
| Credit | LLM API 사용에 따른 비용 단위 |
| Request | 사용자가 시스템에 보낸 쿼리 1건 |
| LLM Call | 백엔드에서 LLM API를 호출한 횟수 (1 Request = N LLM Calls) |
| Active Member | 조회 기간 내 최소 1회 이상 요청한 멤버 |

### 8.2 관련 문서
- 시스템 아키텍처 문서
- API 명세서
- 디자인 시스템 가이드

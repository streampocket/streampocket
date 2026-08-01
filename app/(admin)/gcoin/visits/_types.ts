export type VisitSite = 'gcoin' | 'ottall'

export type DailyVisit = {
  date: string
  count: number
}

export type SourceCount = {
  source: string
  count: number
}

export type OtherHost = {
  host: string
  count: number
}

export type VisitStats = {
  site: VisitSite
  range: { from: string; to: string }
  totalVisits: number
  todayVisits: number
  daily: DailyVisit[]
  sources: SourceCount[]
  otherHosts: OtherHost[]
}

export type VisitStatsParams = {
  site: VisitSite
  from?: string
  to?: string
}

/** 조회 기간 파라미터 — 파티 신청 시간대·가입자 수가 함께 쓴다 (방문 필터를 그대로 따라간다) */
export type RangeParams = {
  from: string
  to: string
}

export type HourlyApplication = {
  /** 0~23 (KST) */
  hour: number
  count: number
}

/** 이용자가 신청한 시각의 시간대 분포 — 관리자 승인 시각이 아니다 */
export type ApplicationHourStats = {
  range: { from: string; to: string }
  total: number
  /** 신청이 0건이면 null */
  peakHour: number | null
  /** 항상 24개 (0~23시) */
  hourly: HourlyApplication[]
}

export type SignupStats = {
  range: { from: string; to: string }
  /** KST 오늘 가입 수 (조회 기간과 무관) */
  today: number
  rangeTotal: number
}

export const SITE_TABS: { value: VisitSite; label: string }[] = [
  { value: 'ottall', label: 'OTTALL' },
  { value: 'gcoin', label: '지코인' },
]

// 기본 조회 기간(일) — 초기 로드와 필터 "초기화" 버튼이 공유
export const DEFAULT_RANGE_DAYS = 30

// BE utils/referrerSource.ts 분류값 → 표시 라벨 (미지값·utm: 접두는 sourceLabel에서 처리)
export const SOURCE_LABELS: Record<string, string> = {
  direct: '직접 유입',
  google: '구글',
  naver_search: '네이버 검색',
  naver_blog: '네이버 블로그',
  naver_cafe: '네이버 카페',
  naver_other: '네이버 기타',
  daum: '다음',
  kakao: '카카오',
  threads: '스레드',
  instagram: '인스타그램',
  youtube: '유튜브',
  tistory: '티스토리',
  x: 'X(트위터)',
  facebook: '페이스북',
  bing: '빙',
  other: '기타',
}

export function sourceLabel(source: string): string {
  if (source.startsWith('utm:')) return `UTM: ${source.slice(4)}`
  return SOURCE_LABELS[source] ?? source
}

import { clsx, type ClassValue } from 'clsx'

/** Tailwind 조건부 클래스 병합 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

/** 날짜를 'YYYY-MM-DD HH:mm' 형식으로 포맷 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Seoul',
  })
    .format(new Date(date))
    .replace(/\. /g, '-')
    .replace('.', '')
}

/** KST 기준 'YYYY-MM-DD' 문자열 반환 */
export function formatDateOnly(date: string | Date): string {
  const d = new Date(date)
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Seoul',
  })
    .format(d)
    .replace(/\. /g, '-')
    .replace('.', '')
}

/** KST 기준 'MM-DD' 문자열 반환 (테이블 간결 표시용) */
export function formatMonthDay(date: string | Date): string {
  const d = new Date(date)
  return new Intl.DateTimeFormat('ko-KR', {
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Seoul',
  })
    .format(d)
    .replace(/\. /g, '-')
    .replace('.', '')
}

/** KST 기준 오늘 날짜 'YYYY-MM-DD' 문자열 */
export function getTodayStringKST(): string {
  return formatDateOnly(new Date())
}

const MS_PER_DAY = 24 * 60 * 60 * 1000

/** from부터 to까지의 일수 (올림 — "오늘까지"가 0일로 보이지 않게, 음수는 0) */
export function getDaysBetween(from: string | Date, to: string | Date): number {
  const ms = new Date(to).getTime() - new Date(from).getTime()
  return Math.max(0, Math.ceil(ms / MS_PER_DAY))
}

/**
 * 신청자가 실제로 받는 이용 일수 표시.
 *
 * 기간 차감형은 늦게 승인될수록 파티 종료일에 잘려 durationDays보다 짧아진다 — 줄었으면 원래
 * 파티 기간을 병기한다. 차감형 종료가 "첫 승인 시각"에 고정돼 생기는 시간 단위 오차로
 * 올림 결과가 durationDays를 넘지 않게 상한을 둔다.
 */
export function formatUsageDays(actualDays: number, durationDays: number): string {
  const days = Math.min(actualDays, durationDays)
  return days < durationDays ? `${days}일 (파티 ${durationDays}일)` : `${durationDays}일`
}

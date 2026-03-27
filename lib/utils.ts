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

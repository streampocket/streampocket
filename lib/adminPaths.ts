import { NAV_SECTIONS } from '@/constants/navigation'

// 관리자 경로 프리픽스 — 네비게이션 정의(단일 소스)에서 파생.
// 유저 사이트 전용 장치(방문 집계, 리뷰 유도 모달)가 관리자 화면에서 동작하지 않게 거른다.
const ADMIN_PATH_PREFIXES = [
  ...NAV_SECTIONS.flatMap((section) => section.items.map((item) => item.href)),
  '/login',
]

export function isAdminPath(pathname: string): boolean {
  return ADMIN_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}

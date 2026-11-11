import { hasAccess, type AdminMe, type PageAccess } from '@/constants/adminPermissions'
import { NAV_SECTIONS, type NavSection } from '@/constants/navigation'

const NAV_ITEMS = NAV_SECTIONS.flatMap((section) => section.items)

function matchesPath(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`)
}

// 경로의 접근 조건 — 메뉴에 없는 관리자 경로는 안전하게 사장 전용으로 본다
export function getPageAccess(pathname: string): PageAccess {
  const item = NAV_ITEMS.filter((nav) => matchesPath(pathname, nav.href)).sort(
    (a, b) => b.href.length - a.href.length,
  )[0]
  return item?.access ?? 'owner'
}

export function canAccessPath(me: AdminMe, pathname: string): boolean {
  return hasAccess(me, getPageAccess(pathname))
}

// 권한 있는 메뉴만 남긴다 (빈 섹션 제거)
export function filterNavSections(me: AdminMe): NavSection[] {
  return NAV_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter((item) => hasAccess(me, item.access)),
  })).filter((section) => section.items.length > 0)
}

// 접근 가능한 첫 페이지 — 권한이 하나도 없으면 null
export function getFirstAccessiblePath(me: AdminMe): string | null {
  return NAV_ITEMS.find((item) => hasAccess(me, item.access))?.href ?? null
}

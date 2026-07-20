'use client'

import { useEffect } from 'react'
import { userApi } from '@/lib/userApi'
import { NAV_SECTIONS } from '@/constants/navigation'

const VISITOR_ID_KEY = 'ottall_visitor_id'
const LAST_VISIT_KEY = 'ottall_last_visit_date'

// 관리자 화면은 방문 집계 제외 — 관리자 경로 프리픽스는 네비게이션 정의(단일 소스)에서 파생
const ADMIN_PATH_PREFIXES = [
  ...NAV_SECTIONS.flatMap((section) => section.items.map((item) => item.href)),
  '/login',
]

function isAdminPath(pathname: string): boolean {
  return ADMIN_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}

// KST 오늘 'YYYY-MM-DD' — en-CA 로케일은 ISO 형식으로 포맷된다
function kstToday(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' }).format(new Date())
}

// OTTALL 유저 사이트 일별 고유 방문 기록 — 하루 1회만 POST (localStorage 플래그).
// 서버가 (site, visitorId, 날짜) 기준으로 멱등 처리하므로 실패 시 다음 로드에서 재시도해도 안전.
export function VisitTracker() {
  useEffect(() => {
    try {
      if (isAdminPath(window.location.pathname)) return

      let visitorId = window.localStorage.getItem(VISITOR_ID_KEY)
      if (!visitorId) {
        visitorId = crypto.randomUUID()
        window.localStorage.setItem(VISITOR_ID_KEY, visitorId)
      }

      const today = kstToday()
      if (window.localStorage.getItem(LAST_VISIT_KEY) === today) return

      const utmSource = new URLSearchParams(window.location.search).get('utm_source')
      userApi
        .post('/own/visits', {
          visitorId,
          referrer: document.referrer ? document.referrer.slice(0, 500) : null,
          utmSource,
          landingPath: `${window.location.pathname}${window.location.search}`.slice(0, 500),
        })
        .then(() => window.localStorage.setItem(LAST_VISIT_KEY, today))
        .catch(() => {})
    } catch {
      // localStorage 접근 불가(시크릿 모드 일부 브라우저 등) — 집계만 포기
    }
  }, [])

  return null
}

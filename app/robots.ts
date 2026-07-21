import type { MetadataRoute } from 'next'
import { USER_SITE_URL } from '@/constants/app'

// 색인 차단 경로 — 관리자(constants/app.ts ADMIN_PATH_PREFIXES와 동기 유지) + 로그인 필요·개인 페이지
const DISALLOW_PATHS = [
  '/login',
  '/dashboard',
  '/products',
  '/orders',
  '/codes',
  '/revenue',
  '/settings',
  '/alimtalk',
  '/review-codes',
  '/ottall',
  '/gcoin',
  '/community-admin',
  '/mypage',
  '/community/new',
  '/community/*/edit',
  '/reviews/new',
  '/reviews/*/edit',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: DISALLOW_PATHS,
      },
      // 네이버봇은 명시적 allow 규칙 유지 (차단 경로는 동일 적용)
      {
        userAgent: 'Yeti',
        allow: '/',
        disallow: DISALLOW_PATHS,
      },
    ],
    sitemap: `${USER_SITE_URL}/sitemap.xml`,
  }
}

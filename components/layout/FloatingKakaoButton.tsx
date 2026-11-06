'use client'

import { usePathname } from 'next/navigation'
import { ADMIN_PATH_PREFIXES, GUIDE_PATH, KAKAO_CHAT_URL, TRACK_PATH } from '@/constants/app'
import { KakaoTalkIcon } from '@/components/icons/KakaoTalkIcon'

// 스마트스토어 구매자용 페이지 — OTTALL 상담 채널과 무관해 버튼을 숨긴다
const HIDDEN_PATHS = [TRACK_PATH, GUIDE_PATH]

function matchesPath(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`)
}

function isHiddenPath(pathname: string | null): boolean {
  if (!pathname) return false
  return [...ADMIN_PATH_PREFIXES, ...HIDDEN_PATHS].some((prefix) => matchesPath(pathname, prefix))
}

export function FloatingKakaoButton() {
  const pathname = usePathname()

  if (isHiddenPath(pathname)) return null

  return (
    <a
      href={KAKAO_CHAT_URL}
      target="_blank"
      rel="noopener noreferrer nofollow"
      aria-label="카카오톡 문의하기"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#FEE500] shadow-lg transition-transform hover:scale-105 active:scale-95 motion-reduce:transition-none motion-reduce:hover:scale-100 sm:bottom-8 sm:right-8"
    >
      <KakaoTalkIcon className="h-7 w-7" />
    </a>
  )
}

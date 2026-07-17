'use client'

import { usePathname } from 'next/navigation'
import { ADMIN_PATH_PREFIXES, KAKAO_CHAT_URL, TRACK_PATH } from '@/constants/app'
import { KakaoTalkIcon } from '@/components/icons/KakaoTalkIcon'

function isAdminPath(pathname: string | null): boolean {
  if (!pathname) return false
  return ADMIN_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}

export function FloatingKakaoButton() {
  const pathname = usePathname()

  if (isAdminPath(pathname)) return null
  if (pathname === TRACK_PATH || pathname?.startsWith(`${TRACK_PATH}/`)) return null

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

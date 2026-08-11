'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { isUserAuthenticated, clearUserAuthSession, getUserInfo } from '@/lib/userAuth'
import { USER_LOGIN_PATH, USER_MYPAGE_PATH, API_BASE_URL, KAKAO_CHAT_URL } from '@/constants/app'
import { useUserProfile } from '@/hooks/useUserProfile'
import { formatPoint } from '@/lib/points'

export function HeaderAuthButton() {
  const router = useRouter()
  const [loggedIn, setLoggedIn] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // 드롭다운을 열 때만 조회한다 — 헤더는 모든 페이지에 있어 무조건 부르면 요청이 낭비된다.
  // getUserInfo()는 localStorage 캐시라 잔액을 담으면 리뷰 적립 후에도 옛 값이 남는다.
  const { data: profile } = useUserProfile({ enabled: loggedIn && open })

  useEffect(() => {
    setLoggedIn(isUserAuthenticated())
    const info = getUserInfo()
    if (info) setUserName(info.name)
  }, [])

  useEffect(() => {
    if (!open) return

    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const handleLogout = useCallback(async () => {
    try {
      await fetch(`${API_BASE_URL}/own/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch {
      // 로그아웃 API 실패해도 클라이언트 세션은 삭제
    }
    clearUserAuthSession()
    setLoggedIn(false)
    setOpen(false)
    router.push('/')
  }, [router])

  if (!loggedIn) {
    return (
      <Link
        href={USER_LOGIN_PATH}
        className="inline-flex h-10 items-center justify-center rounded-xl bg-brand px-4 text-sm font-bold text-white transition-colors hover:bg-brand-dark"
      >
        로그인
      </Link>
    )
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-brand px-4 text-sm font-bold text-white transition-colors hover:bg-brand-dark"
      >
        {userName ?? '내 정보'}
        <svg
          className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-30 mt-2 w-44 overflow-hidden rounded-xl border border-border bg-white shadow-lg">
          <div className="border-b border-border bg-gray-50 px-4 py-2.5">
            <p className="text-xs text-text-muted">보유 포인트</p>
            <p className="text-sm font-bold text-brand">
              {profile ? formatPoint(profile.pointBalance) : '불러오는 중...'}
            </p>
          </div>
          <Link
            href={USER_MYPAGE_PATH}
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm text-text-primary transition-colors hover:bg-gray-50"
          >
            마이페이지
          </Link>
          <a
            href={KAKAO_CHAT_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm text-text-primary transition-colors hover:bg-gray-50"
          >
            문의하기
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="block w-full px-4 py-2.5 text-left text-sm text-red-500 transition-colors hover:bg-gray-50"
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  )
}

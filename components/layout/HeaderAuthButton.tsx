'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { isUserAuthenticated, clearUserAuthSession } from '@/lib/userAuth'
import { USER_LOGIN_PATH, USER_MYPAGE_PATH, API_BASE_URL } from '@/constants/app'

export function HeaderAuthButton() {
  const router = useRouter()
  const [loggedIn, setLoggedIn] = useState(false)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLoggedIn(isUserAuthenticated())
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
        내 정보
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
        <div className="absolute right-0 top-full z-30 mt-2 w-40 overflow-hidden rounded-xl border border-border bg-white shadow-lg">
          <Link
            href={USER_MYPAGE_PATH}
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm text-text-primary transition-colors hover:bg-gray-50"
          >
            내 정보
          </Link>
          <Link
            href={USER_MYPAGE_PATH}
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm text-text-primary transition-colors hover:bg-gray-50"
          >
            마이페이지
          </Link>
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

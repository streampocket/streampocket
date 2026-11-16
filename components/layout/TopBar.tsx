'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { hasAccess } from '@/constants/adminPermissions'
import { useAdminMe } from '@/hooks/useAdminMe'
import { OtpResetRequestBell } from './OtpResetRequestBell'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': '대시보드',
  '/orders': '주문 관리',
  '/products': '상품 관리',
  '/codes': '계정 관리',
  '/alimtalk': '알림톡',
  '/settings': '설정',
  '/staff': '직원 관리',
  '/ottall/parties': '파티 관리',
  '/ottall/reviews': '리뷰 관리',
  '/ottall/message-templates': '안내 양식',
  '/gcoin/products': '배그상품 관리',
  '/gcoin/orders': '배그주문 관리',
  '/gcoin/visits': '방문자 통계',
}

type TopBarProps = {
  title?: string
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('ko-KR', {
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Seoul',
  }).format(date)
}

export function TopBar({ title }: TopBarProps) {
  const pathname = usePathname()
  const [currentTime, setCurrentTime] = useState('')
  const { data: me } = useAdminMe()
  // 초기화가 주문 권한 API라 종도 주문 권한이 있을 때만 — "보이는데 누르면 403"을 막는다
  const showOtpBell = me ? hasAccess(me, 'orders') : false

  const pageTitle =
    title ??
    Object.entries(PAGE_TITLES).find(([key]) => pathname.startsWith(key))?.[1] ??
    '스트림포켓'

  useEffect(() => {
    setCurrentTime(formatTime(new Date()))
    const timer = setInterval(() => {
      setCurrentTime(formatTime(new Date()))
    }, 60_000)
    return () => clearInterval(timer)
  }, [])

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card-bg px-6">
      <h1 className="text-heading-md min-w-0 truncate text-text-primary">{pageTitle}</h1>
      <div className="flex shrink-0 items-center gap-3">
        {showOtpBell && <OtpResetRequestBell />}
        <span className="text-caption-md text-text-muted">{currentTime}</span>
      </div>
    </header>
  )
}

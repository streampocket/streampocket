'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': '대시보드',
  '/orders': '주문 관리',
  '/products': '상품 관리',
  '/codes': '계정 관리',
  '/alimtalk': '알림톡',
  '/settings': '설정',
  '/ottall/partners': '파트너 관리',
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
      <h1 className="text-heading-md text-text-primary">{pageTitle}</h1>
      <span className="text-caption-md text-text-muted">{currentTime}</span>
    </header>
  )
}

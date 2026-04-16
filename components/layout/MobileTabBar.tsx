'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_SECTIONS } from '@/constants/navigation'
import { cn } from '@/lib/utils'

const PRIMARY_TABS = [
  { label: '대시보드', href: '/dashboard', icon: '▦' },
  { label: '주문', href: '/orders', icon: '📋' },
  { label: '리뷰게임', href: '/review-codes', icon: '🎮' },
  { label: '매출', href: '/revenue', icon: '💰' },
]

const ALL_NAV_HREFS = NAV_SECTIONS.flatMap((s) => s.items.map((i) => i.href))

export function MobileTabBar() {
  const pathname = usePathname()
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  // 경로 변경 시 바텀시트 자동 닫기
  useEffect(() => {
    setIsSheetOpen(false)
  }, [pathname])

  const isPrimaryActive = PRIMARY_TABS.some((tab) => pathname.startsWith(tab.href))
  const isMoreActive =
    !isPrimaryActive && ALL_NAV_HREFS.some((href) => pathname.startsWith(href))

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-15 items-center border-t border-border bg-card-bg md:hidden">
        {PRIMARY_TABS.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-0.5 py-2 transition-colors',
                isActive ? 'text-brand' : 'text-text-muted',
              )}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              <span className="text-caption-sm font-medium">{item.label}</span>
            </Link>
          )
        })}

        {/* 더보기 버튼 */}
        <button
          type="button"
          onClick={() => setIsSheetOpen((prev) => !prev)}
          className={cn(
            'flex flex-1 flex-col items-center justify-center gap-0.5 py-2 transition-colors',
            isMoreActive || isSheetOpen ? 'text-brand' : 'text-text-muted',
          )}
        >
          <span className="text-lg leading-none">☰</span>
          <span className="text-caption-sm font-medium">더보기</span>
        </button>
      </nav>

      {/* 바텀시트 오버레이 */}
      {isSheetOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          onClick={() => setIsSheetOpen(false)}
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)' }}
        >
          <div
            className="absolute bottom-0 left-0 right-0 rounded-t-2xl bg-card-bg pb-20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 드래그 인디케이터 */}
            <div className="flex justify-center py-3">
              <div className="h-1 w-10 rounded-full bg-gray-300" />
            </div>

            <nav className="max-h-[60vh] overflow-y-auto px-4 pb-4">
              {NAV_SECTIONS.map((section) => (
                <div key={section.title} className="mb-4">
                  <p className="text-caption-sm mb-2 px-2 font-medium text-text-muted">
                    {section.title}
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {section.items.map((item) => {
                      const isActive = pathname.startsWith(item.href)
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            'flex flex-col items-center gap-1 rounded-xl px-2 py-3 transition-colors',
                            isActive
                              ? 'bg-brand/10 text-brand'
                              : 'text-text-secondary hover:bg-gray-50',
                          )}
                        >
                          <span className="text-xl leading-none">{item.icon}</span>
                          <span className="text-caption-sm text-center font-medium">
                            {item.label.replace(' 관리', '')}
                          </span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}

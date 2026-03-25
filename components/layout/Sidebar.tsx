'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

type NavItem = {
  label: string
  href: string
  icon: string
}

type NavSection = {
  title: string
  items: NavItem[]
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: '메인',
    items: [{ label: '대시보드', href: '/dashboard', icon: '▦' }],
  },
  {
    title: '스마트스토어',
    items: [
      { label: '주문 관리', href: '/orders', icon: '📋' },
      { label: '상품 관리', href: '/products', icon: '📦' },
      { label: '계정 관리', href: '/codes', icon: '🔑' },
    ],
  },
  {
    title: '시스템',
    items: [{ label: '설정', href: '/settings', icon: '⚙' }],
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-60 flex-shrink-0 flex-col bg-sidebar">
      {/* 로고 */}
      <div className="flex h-14 items-center gap-2.5 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white">
          SP
        </div>
        <span className="text-heading-sm text-white">스트림포켓</span>
      </div>

      {/* 네비게이션 */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="mb-4">
            <p className="text-caption-sm mb-1.5 px-3 text-gray-500">{section.title}</p>
            {section.items.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'mb-0.5 flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors',
                    isActive
                      ? 'border-l-2 border-brand bg-sidebar-active text-white'
                      : 'text-gray-400 hover:bg-sidebar-hover hover:text-white',
                  )}
                >
                  <span className="text-base leading-none">{item.icon}</span>
                  <span className="text-body-md font-medium">{item.label}</span>
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* 하단 사용자 정보 */}
      <div className="border-t border-gray-800 p-4">
        <div className="mb-2 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-dark text-sm font-semibold text-white">
            A
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-caption-md truncate text-white">관리자</p>
            <p className="text-caption-sm truncate text-gray-500">admin@streampocket.com</p>
          </div>
        </div>
        <button className="text-caption-md w-full rounded-lg px-3 py-1.5 text-left text-gray-400 transition-colors hover:bg-sidebar-hover hover:text-white">
          로그아웃
        </button>
      </div>
    </aside>
  )
}

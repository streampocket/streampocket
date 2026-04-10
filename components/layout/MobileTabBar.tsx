'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const TAB_ITEMS = [
  { label: '대시보드', href: '/dashboard', icon: '▦' },
  { label: '주문', href: '/orders', icon: '📋' },
  { label: '상품', href: '/products', icon: '📦' },
  { label: '계정', href: '/codes', icon: '🔑' },
  { label: '리뷰게임', href: '/review-codes', icon: '🎮' },
  { label: '알림톡', href: '/alimtalk', icon: '💬' },
  { label: '회원', href: '/ottall/users', icon: '👤' },
  { label: '파트너', href: '/ottall/partners', icon: '🤝' },
  { label: '파티', href: '/ottall/parties', icon: '🎉' },
  { label: '결제', href: '/ottall/payments', icon: '💳' },
  { label: '설정', href: '/settings', icon: '⚙' },
]

export function MobileTabBar() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-15 items-center border-t border-border bg-card-bg md:hidden">
      {TAB_ITEMS.map((item) => {
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
    </nav>
  )
}

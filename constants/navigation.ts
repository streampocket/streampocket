import type { PageAccess } from '@/constants/adminPermissions'

export type NavItem = {
  label: string
  href: string
  icon: string
  // 이 페이지(하위 경로 포함)를 볼 수 있는 조건 — 사장은 항상 가능
  access: PageAccess
}

export type NavSection = {
  title: string
  items: NavItem[]
}

export const NAV_SECTIONS: NavSection[] = [
  {
    title: '메인',
    items: [
      { label: '대시보드', href: '/dashboard', icon: '▦', access: 'dashboard' },
      { label: '주문 관리', href: '/orders', icon: '📋', access: 'orders' },
    ],
  },
  {
    title: '스마트스토어',
    items: [
      { label: '상품 관리', href: '/products', icon: '📦', access: 'products' },
      { label: '계정 관리', href: '/codes', icon: '🔑', access: 'accounts' },
      { label: '리뷰 게임 관리', href: '/review-codes', icon: '🎮', access: 'reviewCodes' },
      { label: '매출 관리', href: '/revenue', icon: '💰', access: 'revenue' },
    ],
  },
  {
    title: 'OTTALL',
    items: [
      { label: '회원 관리', href: '/ottall/users', icon: '👤', access: 'users' },
      { label: '파티 관리', href: '/ottall/parties', icon: '🎉', access: 'parties' },
      { label: '드라마 계정 관리', href: '/ottall/drama', icon: '🎬', access: 'drama' },
      { label: '신청 관리', href: '/ottall/applications', icon: '📝', access: 'applications' },
      { label: '리뷰 관리', href: '/ottall/reviews', icon: '⭐', access: 'reviews' },
      { label: 'OTP 발급', href: '/ottall/otp', icon: '🔐', access: 'otp' },
      { label: '게시글 관리', href: '/community-admin', icon: '💬', access: 'community' },
    ],
  },
  {
    title: 'GCOIN',
    items: [
      { label: '배그상품 관리', href: '/gcoin/products', icon: '🪙', access: 'gcoinProducts' },
      { label: '배그주문 관리', href: '/gcoin/orders', icon: '📥', access: 'gcoinOrders' },
    ],
  },
  {
    title: '시스템',
    items: [
      { label: '방문자 통계', href: '/gcoin/visits', icon: '📊', access: 'visits' },
      { label: '알림톡', href: '/alimtalk', icon: '💬', access: 'alimtalk' },
      { label: '직원 관리', href: '/staff', icon: '🧑‍💼', access: 'owner' },
      { label: '설정', href: '/settings', icon: '⚙', access: 'owner' },
    ],
  },
]

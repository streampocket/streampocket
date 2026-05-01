export type NavItem = {
  label: string
  href: string
  icon: string
}

export type NavSection = {
  title: string
  items: NavItem[]
}

export const NAV_SECTIONS: NavSection[] = [
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
      { label: '리뷰 게임 관리', href: '/review-codes', icon: '🎮' },
      { label: '매출 관리', href: '/revenue', icon: '💰' },
    ],
  },
  {
    title: 'OTTALL',
    items: [
      { label: '회원 관리', href: '/ottall/users', icon: '👤' },
      { label: '파트너 관리', href: '/ottall/partners', icon: '🤝' },
      { label: '파티 관리', href: '/ottall/parties', icon: '🎉' },
      { label: '신청 관리', href: '/ottall/applications', icon: '📝' },
    ],
  },
  {
    title: '시스템',
    items: [
      { label: '알림톡', href: '/alimtalk', icon: '💬' },
      { label: '설정', href: '/settings', icon: '⚙' },
    ],
  },
]

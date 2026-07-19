'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { UserProfile } from './UserProfile'
import { PurchaseHistory } from './PurchaseHistory'
import { USER_MYPAGE_PATH } from '@/constants/app'
import type { MyPageTab } from '../_types'

const MYPAGE_TABS: { key: MyPageTab; label: string }[] = [
  { key: 'profile', label: '내 정보' },
  { key: 'purchases', label: '구매 내역' },
]

const TAB_CONTENT: Record<MyPageTab, () => React.ReactNode> = {
  profile: () => <UserProfile />,
  purchases: () => <PurchaseHistory />,
}

export function MyPageTabs() {
  const router = useRouter()
  const searchParams = useSearchParams()
  // ?tab=purchases 진입 지원 — 신청 완료 모달·알림톡 링크 등 외부에서 구매내역 탭 직행
  const [activeTab, setActiveTab] = useState<MyPageTab>(
    searchParams.get('tab') === 'purchases' ? 'purchases' : 'profile',
  )

  const handleTabChange = (tab: MyPageTab) => {
    setActiveTab(tab)
    router.replace(tab === 'purchases' ? `${USER_MYPAGE_PATH}?tab=purchases` : USER_MYPAGE_PATH, {
      scroll: false,
    })
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-heading-lg text-text-primary">마이페이지</h1>
      </div>

      {/* 탭 바 */}
      <nav className="-mx-4 mb-6 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div className="flex min-w-max border-b border-border">
          {MYPAGE_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleTabChange(tab.key)}
              className={`shrink-0 px-4 py-2.5 text-body-md font-semibold transition-colors ${
                activeTab === tab.key
                  ? 'border-b-2 border-brand text-brand'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* 탭 콘텐츠 */}
      <section>{TAB_CONTENT[activeTab]()}</section>
    </div>
  )
}

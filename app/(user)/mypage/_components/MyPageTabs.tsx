'use client'

import { useState } from 'react'
import Link from 'next/link'
import { UserProfile } from './UserProfile'
import { PurchaseHistory } from './PurchaseHistory'
import { useMyPartner } from '@/hooks/useMyPartner'
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
  const [activeTab, setActiveTab] = useState<MyPageTab>('profile')
  const { data: partner } = useMyPartner()
  const isApprovedPartner = partner?.status === 'approved'

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-heading-lg text-text-primary">마이페이지</h1>
        {isApprovedPartner && (
          <Link
            href="/party/my"
            className="inline-flex items-center gap-1 rounded-lg bg-brand/10 px-3 py-1.5 text-caption-md font-semibold text-brand transition-colors hover:bg-brand/20"
          >
            내 파티 관리
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>

      {/* 탭 바 */}
      <nav className="-mx-4 mb-6 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div className="flex min-w-max border-b border-border">
          {MYPAGE_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
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

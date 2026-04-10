'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import type { UserProviderFilter } from '../_types'

type Tab = {
  value: UserProviderFilter
  label: string
}

const TABS: Tab[] = [
  { value: 'all', label: '전체' },
  { value: 'local', label: '일반' },
  { value: 'kakao', label: '카카오' },
  { value: 'google', label: '구글' },
]

type UserFilterBarProps = {
  activeTab: UserProviderFilter
  onTabChange: (tab: UserProviderFilter) => void
  search: string
  onSearchChange: (value: string) => void
  onSearchSubmit: () => void
}

export function UserFilterBar({
  activeTab,
  onTabChange,
  search,
  onSearchChange,
  onSearchSubmit,
}: UserFilterBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchSubmit()
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-1 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => onTabChange(tab.value)}
            className={cn(
              'text-body-md shrink-0 rounded-lg px-4 py-2 font-medium transition-colors',
              activeTab === tab.value
                ? 'bg-brand text-white'
                : 'bg-gray-100 text-text-secondary hover:bg-gray-200',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="이메일, 이름, 전화번호 검색"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="text-body-md flex-1 rounded-lg border border-border bg-card-bg px-3 py-2 text-text-primary placeholder:text-text-muted focus:border-brand focus:outline-none"
        />
        <Button variant="primary" size="sm" onClick={onSearchSubmit}>
          검색
        </Button>
      </div>
    </div>
  )
}

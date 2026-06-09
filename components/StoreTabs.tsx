'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { STORE_META } from '@/constants/app'

/** 스토어 필터 카운트 (선택). 페이지마다 제공 여부가 다름. */
export type StoreTabCounts = {
  total?: number
  streampocket?: number
  pokemon_steam?: number
}

type StoreTab = {
  value: '' | 'streampocket' | 'pokemon_steam'
  label: string
  countKey: keyof StoreTabCounts
}

const TABS: StoreTab[] = [
  { value: '', label: '전체', countKey: 'total' },
  { value: 'streampocket', label: STORE_META.streampocket.label, countKey: 'streampocket' },
  { value: 'pokemon_steam', label: STORE_META.pokemon_steam.label, countKey: 'pokemon_steam' },
]

type StoreTabsProps = {
  counts?: StoreTabCounts
}

/** 멀티스토어 공통 필터 탭 — URL `?store=` 쿼리로 동작. 주문/상품/대시보드/매출에서 재사용. */
export function StoreTabs({ counts }: StoreTabsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const current = searchParams.get('store') ?? ''

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set('store', value)
    else params.delete('store')
    params.delete('page')
    router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ''}`)
  }

  return (
    <nav className="flex flex-wrap gap-2">
      {TABS.map((tab) => {
        const isActive = current === tab.value
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => handleSelect(tab.value)}
            className={cn(
              'text-caption-md rounded-lg px-3 py-1.5 font-semibold transition-colors',
              isActive ? 'bg-brand text-white' : 'bg-card-bg text-text-secondary hover:bg-gray-100',
            )}
          >
            {tab.label}
            {counts && (
              <span className={cn('ml-1.5', isActive ? 'text-white' : 'text-text-muted')}>
                {counts[tab.countKey]}
              </span>
            )}
          </button>
        )
      })}
    </nav>
  )
}

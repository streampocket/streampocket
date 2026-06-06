'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { GameStoreCounts } from '../_types'

type StoreTab = {
  value: '' | 'streampocket' | 'pokemon_steam'
  label: string
  countKey: keyof GameStoreCounts
}

const TABS: StoreTab[] = [
  { value: '', label: '전체', countKey: 'total' },
  { value: 'streampocket', label: '스트림포켓', countKey: 'streampocket' },
  { value: 'pokemon_steam', label: '포켓몬스팀', countKey: 'pokemon_steam' },
]

type StoreTabsProps = {
  counts?: GameStoreCounts
}

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
              isActive
                ? 'bg-brand text-white'
                : 'bg-card-bg text-text-secondary hover:bg-gray-100',
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

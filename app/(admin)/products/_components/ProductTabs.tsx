'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useProducts } from '../_hooks/useProducts'
import type { ProductStatus } from '@/types/domain'
import type { ProductStatusCounts } from '../_types'

const TABS: { value: ProductStatus | ''; label: string; countKey: keyof ProductStatusCounts }[] = [
  { value: '', label: '전체', countKey: 'total' },
  { value: 'active', label: '판매 중', countKey: 'active' },
  { value: 'draft', label: '임시저장', countKey: 'draft' },
  { value: 'inactive', label: '판매 중지', countKey: 'inactive' },
]

export function ProductTabs() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentStatus = searchParams.get('status') ?? ''

  const currentSearch = searchParams.get('search') ?? ''
  const { data } = useProducts({
    status: (currentStatus as ProductStatus) || undefined,
    search: currentSearch || undefined,
  })
  const counts = data?.counts

  const handleTab = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set('status', value)
    else params.delete('status')
    params.delete('page')
    router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ''}`)
  }

  return (
    <div className="flex gap-1 rounded-xl border border-border bg-card-bg p-1.5">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          onClick={() => handleTab(tab.value)}
          className={cn(
            'text-caption-md flex-1 rounded-lg px-4 py-2 font-semibold transition-colors',
            currentStatus === tab.value
              ? 'bg-brand text-white shadow-sm'
              : 'text-text-secondary hover:text-text-primary',
          )}
        >
          {tab.label}{counts ? ` (${counts[tab.countKey]})` : ''}
        </button>
      ))}
    </div>
  )
}

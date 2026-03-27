'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { ProductStatus } from '@/types/domain'

const TABS: { value: ProductStatus | ''; label: string }[] = [
  { value: '', label: '전체' },
  { value: 'active', label: '판매 중' },
  { value: 'draft', label: '임시저장' },
  { value: 'inactive', label: '판매 중지' },
]

export function ProductTabs() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentStatus = searchParams.get('status') ?? ''

  const handleTab = (value: string) => {
    const params = new URLSearchParams()
    if (value) params.set('status', value)
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
          {tab.label}
        </button>
      ))}
    </div>
  )
}

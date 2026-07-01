'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import type { ProductSort } from '../_types'

type SortDropdownProps = {
  value: ProductSort | undefined
  onChange: (sort: ProductSort | undefined) => void
}

const SORT_OPTIONS: { value: ProductSort | undefined; label: string }[] = [
  { value: undefined, label: '기본순' },
  { value: 'price_asc', label: '가격 낮은순' },
  { value: 'price_desc', label: '가격 높은순' },
]

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const currentLabel = SORT_OPTIONS.find((opt) => opt.value === value)?.label ?? '기본순'

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`정렬: ${currentLabel}`}
        className={cn(
          'flex items-center gap-1.5 rounded-full px-4 py-1.5 text-body-md font-medium transition-colors',
          value
            ? 'bg-brand text-white'
            : 'bg-gray-100 text-text-secondary hover:bg-gray-200',
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
          className="h-4 w-4"
        >
          <path d="M7 4v16M7 4 4 7M7 4l3 3" />
          <path d="M17 20V4M17 20l3-3M17 20l-3-3" />
        </svg>
        <span>{currentLabel}</span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-10 mt-2 w-32 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-lg"
        >
          {SORT_OPTIONS.map((opt) => (
            <li key={opt.label} role="option" aria-selected={opt.value === value}>
              <button
                type="button"
                onClick={() => {
                  onChange(opt.value)
                  setOpen(false)
                }}
                className={cn(
                  'w-full px-4 py-2 text-left text-body-md transition-colors hover:bg-gray-50',
                  opt.value === value
                    ? 'font-semibold text-brand'
                    : 'text-text-secondary',
                )}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

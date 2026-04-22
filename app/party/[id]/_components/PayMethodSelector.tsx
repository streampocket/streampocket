'use client'

import { PAY_METHOD_OPTIONS, type PayMethod } from '@/constants/app'
import { cn } from '@/lib/utils'

type PayMethodSelectorProps = {
  value: PayMethod
  onChange: (value: PayMethod) => void
  disabled?: boolean
}

export function PayMethodSelector({ value, onChange, disabled }: PayMethodSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {PAY_METHOD_OPTIONS.map((option) => {
        const selected = value === option.value
        return (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={cn(
              'rounded-lg border px-3 py-3 text-body-md font-medium transition-colors',
              selected
                ? 'border-brand bg-brand/10 text-brand'
                : 'border-border bg-white text-text-secondary hover:border-brand/50',
              disabled && 'cursor-not-allowed opacity-50',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

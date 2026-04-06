'use client'

import Image from 'next/image'
import { OTT_IMAGES } from '@/constants/ottImages'
import { cn } from '@/lib/utils'

type ImageSelectorProps = {
  value: string | null
  onChange: (path: string | null, label: string) => void
}

export function ImageSelector({ value, onChange }: ImageSelectorProps) {
  const handleClick = (path: string, label: string) => {
    onChange(value === path ? null : path, label)
  }

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
      {OTT_IMAGES.map((img) => (
        <button
          key={img.path}
          type="button"
          onClick={() => handleClick(img.path, img.label)}
          className={cn(
            'flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 transition-all',
            value === img.path
              ? 'border-brand bg-brand-light ring-2 ring-brand/30'
              : 'border-gray-200 hover:border-gray-300',
          )}
        >
          <div className="relative h-14 w-14 overflow-hidden rounded-lg">
            <Image
              src={img.path}
              alt={img.label}
              fill
              className="object-contain"
              sizes="56px"
            />
          </div>
          <span className={cn(
            'text-caption-md font-medium',
            value === img.path ? 'text-brand-dark' : 'text-text-secondary',
          )}>
            {img.label}
          </span>
        </button>
      ))}
    </div>
  )
}

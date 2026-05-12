'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { COMMUNITY_IMAGE_ACCEPT, COMMUNITY_IMAGE_MAX_BYTES } from '@/constants/app'
import { uploadCommunityImage } from '../_hooks/useCommunity'

type Props = {
  value: string | null
  onChange: (next: string | null) => void
  uploader?: (file: File) => Promise<string>
}

export function CommunityImageUploader({ value, onChange, uploader = uploadCommunityImage }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File): Promise<void> {
    setError(null)
    if (file.size > COMMUNITY_IMAGE_MAX_BYTES) {
      setError('이미지 용량은 5MB 이하만 업로드할 수 있어요.')
      return
    }
    setUploading(true)
    try {
      const url = await uploader(file)
      onChange(url)
    } catch (e) {
      setError(e instanceof Error ? e.message : '이미지 업로드에 실패했어요.')
    } finally {
      setUploading(false)
    }
  }

  function onPick(): void {
    inputRef.current?.click()
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept={COMMUNITY_IMAGE_ACCEPT}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) void handleFile(file)
          e.target.value = ''
        }}
      />

      {value ? (
        <div className="space-y-2">
          <div className="relative aspect-16/10 w-full overflow-hidden rounded-lg border border-border bg-gray-100">
            <Image
              src={value}
              alt="대표 이미지 미리보기"
              fill
              sizes="640px"
              className="object-cover"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              type="button"
              onClick={onPick}
              disabled={uploading}
            >
              {uploading ? '업로드 중...' : '이미지 교체'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              type="button"
              onClick={() => onChange(null)}
              disabled={uploading}
            >
              제거
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={onPick}
          disabled={uploading}
          className="w-full rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center text-text-secondary hover:border-brand hover:bg-brand-light/40 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <div className="mb-1 text-2xl" aria-hidden>
            📷
          </div>
          <div className="text-caption-md font-semibold text-gray-700">
            {uploading ? '업로드 중...' : '대표 이미지를 선택해 업로드'}
          </div>
          <div className="mt-1 text-caption-sm text-text-muted">JPG / PNG / WEBP · 최대 5MB</div>
        </button>
      )}

      {error ? <p className="text-caption-md text-danger">{error}</p> : null}
    </div>
  )
}

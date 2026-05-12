'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import {
  COMMUNITY_CONTENT_MAX_LENGTH,
  COMMUNITY_TITLE_MAX_LENGTH,
} from '@/constants/app'
import type { CommunityCategory } from '@/types/domain'
import { CommunityImageUploader } from './CommunityImageUploader'
import { MarkdownRenderer } from './MarkdownRenderer'

type SubmitPayload = {
  title: string
  content: string
  imageUrl: string | null
  category?: CommunityCategory
  isPinned?: boolean
}

type Props = {
  initialTitle?: string
  initialContent?: string
  initialImageUrl?: string | null
  initialCategory?: CommunityCategory
  initialIsPinned?: boolean
  showCategorySelect?: boolean
  submitLabel: string
  onSubmit: (payload: SubmitPayload) => Promise<void>
  uploader?: (file: File) => Promise<string>
  onCancel?: () => void
}

export function PostForm({
  initialTitle = '',
  initialContent = '',
  initialImageUrl = null,
  initialCategory = 'free',
  initialIsPinned = false,
  showCategorySelect = false,
  submitLabel,
  onSubmit,
  uploader,
  onCancel,
}: Props) {
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl)
  const [category, setCategory] = useState<CommunityCategory>(initialCategory)
  const [isPinned, setIsPinned] = useState(initialIsPinned)
  const [preview, setPreview] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault()
    setError(null)
    const trimmedTitle = title.trim()
    const trimmedContent = content.trim()
    if (!trimmedTitle) {
      setError('제목을 입력해 주세요.')
      return
    }
    if (!trimmedContent) {
      setError('내용을 입력해 주세요.')
      return
    }
    setSubmitting(true)
    try {
      await onSubmit({
        title: trimmedTitle,
        content: trimmedContent,
        imageUrl,
        ...(showCategorySelect
          ? { category, isPinned: category === 'notice' ? isPinned : false }
          : {}),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장에 실패했어요.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {showCategorySelect ? (
        <div className="space-y-2">
          <div className="space-y-1">
            <label className="text-caption-md font-semibold text-text-secondary">카테고리</label>
            <div className="flex gap-2">
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="category"
                  value="notice"
                  checked={category === 'notice'}
                  onChange={() => setCategory('notice')}
                />
                공지
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="category"
                  value="free"
                  checked={category === 'free'}
                  onChange={() => {
                    setCategory('free')
                    setIsPinned(false)
                  }}
                />
                자유
              </label>
            </div>
          </div>
          {category === 'notice' ? (
            <label className="inline-flex items-center gap-2 text-caption-md text-text-secondary">
              <input
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
              />
              <span>📌 상단 고정 (모든 페이지 상단에 노출)</span>
            </label>
          ) : null}
        </div>
      ) : null}

      <div className="space-y-1">
        <label htmlFor="title" className="text-caption-md font-semibold text-text-secondary">
          제목
        </label>
        <input
          id="title"
          type="text"
          value={title}
          maxLength={COMMUNITY_TITLE_MAX_LENGTH}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-border px-3 py-2 focus:border-brand focus:outline-none"
          placeholder="제목을 입력해 주세요"
        />
        <div className="text-right text-caption-sm text-text-muted">
          {title.length} / {COMMUNITY_TITLE_MAX_LENGTH}
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label htmlFor="content" className="text-caption-md font-semibold text-text-secondary">
            내용 (마크다운 지원 · 이미지 문법 차단)
          </label>
          <button
            type="button"
            onClick={() => setPreview((v) => !v)}
            className="text-caption-sm text-brand hover:underline"
          >
            {preview ? '편집' : '미리보기'}
          </button>
        </div>
        {preview ? (
          <div className="min-h-48 rounded-lg border border-border bg-white p-3">
            <MarkdownRenderer content={content} />
          </div>
        ) : (
          <textarea
            id="content"
            value={content}
            maxLength={COMMUNITY_CONTENT_MAX_LENGTH}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-48 w-full resize-y rounded-lg border border-border px-3 py-2 font-mono focus:border-brand focus:outline-none"
            placeholder="**굵게**, [링크](url), - 리스트 등 기본 마크다운 사용 가능"
          />
        )}
        <div className="text-right text-caption-sm text-text-muted">
          {content.length} / {COMMUNITY_CONTENT_MAX_LENGTH}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-caption-md font-semibold text-text-secondary">
          대표 이미지 (선택)
        </label>
        <CommunityImageUploader value={imageUrl} onChange={setImageUrl} uploader={uploader} />
      </div>

      {error ? <p className="text-caption-md text-danger">{error}</p> : null}

      <div className="flex gap-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? '저장 중...' : submitLabel}
        </Button>
        {onCancel ? (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
            취소
          </Button>
        ) : null}
      </div>
    </form>
  )
}

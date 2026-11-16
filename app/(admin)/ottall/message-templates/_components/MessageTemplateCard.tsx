'use client'

import { useState } from 'react'
import { CopyTextButton } from '@/components/CopyTextButton'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import { PREVIEW_MAX_CHARS, PREVIEW_MAX_LINES } from '../_constants'
import type { MessageTemplate } from '../_types'

type MessageTemplateCardProps = {
  template: MessageTemplate
  isFirst: boolean
  isLast: boolean
  reorderDisabled: boolean
  onMoveUp: () => void
  onMoveDown: () => void
  onEdit: () => void
  onDelete: () => void
}

export function MessageTemplateCard({
  template,
  isFirst,
  isLast,
  reorderDisabled,
  onMoveUp,
  onMoveDown,
  onEdit,
  onDelete,
}: MessageTemplateCardProps) {
  const [expanded, setExpanded] = useState(false)
  const isLong =
    template.content.split('\n').length > PREVIEW_MAX_LINES ||
    template.content.length > PREVIEW_MAX_CHARS

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <h3 className="text-body-md min-w-0 flex-1 break-words font-semibold text-text-primary">
          {template.name}
        </h3>
        <CopyTextButton
          label="복사"
          copiedLabel={template.name}
          getText={() => template.content}
          variant="primary"
        />
      </div>

      {/* 미리보기 — 저장된 줄바꿈 그대로 표시, 길면 3줄로 접는다 */}
      <p
        className={cn(
          'text-body-md mt-2 whitespace-pre-wrap break-words text-text-secondary',
          !expanded && 'line-clamp-3',
        )}
      >
        {template.content}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {isLong && (
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="text-caption-md mr-auto font-medium text-text-muted transition-colors hover:text-text-primary"
          >
            {expanded ? '접기 ▲' : '펼치기 ▼'}
          </button>
        )}
        <div className="ml-auto flex flex-wrap gap-1.5">
          <Button
            size="sm"
            variant="secondary"
            onClick={onMoveUp}
            disabled={isFirst || reorderDisabled}
            aria-label={`${template.name} 위로 이동`}
          >
            ▲
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={onMoveDown}
            disabled={isLast || reorderDisabled}
            aria-label={`${template.name} 아래로 이동`}
          >
            ▼
          </Button>
          <Button size="sm" variant="secondary" onClick={onEdit}>
            수정
          </Button>
          <Button size="sm" variant="danger" onClick={onDelete}>
            삭제
          </Button>
        </div>
      </div>
    </Card>
  )
}

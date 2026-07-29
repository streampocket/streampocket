'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { DecoratedAccount, DecoratedMember, MemoLine } from '../_types'

type MemoLinesProps = {
  account: DecoratedAccount
  /** 하이라이트할 검색어 (입력 그대로) */
  query: string
  onDeleteMember: (account: DecoratedAccount, member: DecoratedMember) => void
  className?: string
}

/** 검색어와 겹치는 부분만 노란색으로 표시한다 */
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <span>{text}</span>
  const lower = text.toLowerCase()
  const needle = query.toLowerCase()
  const parts: React.ReactNode[] = []
  let cursor = 0
  let found = lower.indexOf(needle, cursor)
  while (found !== -1 && needle.length > 0) {
    if (found > cursor) parts.push(<span key={`t${cursor}`}>{text.slice(cursor, found)}</span>)
    parts.push(
      <mark key={`m${found}`} className="rounded-sm bg-amber-200 px-0.5 text-amber-900">
        {text.slice(found, found + needle.length)}
      </mark>,
    )
    cursor = found + needle.length
    found = lower.indexOf(needle, cursor)
  }
  if (cursor < text.length) parts.push(<span key={`t${cursor}`}>{text.slice(cursor)}</span>)
  return <>{parts}</>
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [done, setDone] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setDone(true)
      setTimeout(() => setDone(false), 1200)
    } catch {
      toast.error('복사에 실패했습니다. 직접 선택해 주세요.')
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={`${label} 복사`}
      className={cn(
        'text-caption-sm shrink-0 cursor-pointer rounded border px-1.5 opacity-0 transition-opacity',
        'group-hover/line:opacity-100 focus-visible:opacity-100',
        done ? 'border-success text-success opacity-100' : 'border-border bg-card-bg text-text-secondary',
      )}
    >
      {done ? '복사됨' : '복사'}
    </button>
  )
}

function LineTag({ line }: { line: MemoLine }) {
  if (line.kind === 'note') {
    return <span className="text-caption-sm bg-badge-gray-bg text-badge-gray-text shrink-0 rounded px-1.5 font-semibold">메모</span>
  }
  const member = line.member
  if (!member) return null
  if (member.expired) {
    return <span className="text-caption-sm bg-badge-red-bg text-badge-red-text shrink-0 rounded px-1.5 font-semibold">만료</span>
  }
  if (member.soon) {
    return <span className="text-caption-sm bg-badge-yellow-bg text-badge-yellow-text shrink-0 rounded px-1.5 font-semibold">D-{member.daysLeft}</span>
  }
  if (!member.site) {
    return <span className="text-caption-sm bg-badge-gray-bg text-badge-gray-text shrink-0 rounded px-1.5 font-semibold">사이트?</span>
  }
  return null
}

/**
 * 메모 원문을 그대로 그린다. 카드와 목록 펼침이 이 컴포넌트를 함께 쓰고,
 * 검색 인덱스도 같은 `account.lines`에서 만들어져 "보이는 것 = 검색되는 것"이 보장된다.
 */
export function MemoLines({ account, query, onDeleteMember, className }: MemoLinesProps) {
  return (
    <div className={cn('overflow-auto px-4 py-2.5 font-mono text-[12.5px] leading-[22px] tabular-nums', className)}>
      {account.lines.map((line, index) => (
        <div
          // 줄 순서가 곧 정체성이라 index를 key로 쓴다 (같은 텍스트가 반복될 수 있음)
          key={`${line.kind}-${index}`}
          className="group/line hover:bg-gray-50 -mx-1.5 flex min-h-[22px] items-center gap-2 rounded px-1.5"
        >
          <span
            className={cn(
              'whitespace-pre',
              line.kind === 'head' && 'font-bold',
              line.kind === 'free' && 'text-text-muted',
              line.kind === 'note' && 'text-text-muted',
              line.member?.expired && 'text-text-muted line-through',
            )}
          >
            <Highlight text={line.text} query={query} />
          </span>
          {line.kind === 'credential' && line.copyLabel && (
            <CopyButton value={line.text} label={line.copyLabel} />
          )}
          {line.member && (
            <span className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover/line:opacity-100 focus-within:opacity-100">
              {/* 수정은 텍스트 편집기에서 한다. 한 명만 뺄 때는 클릭 한 번이 빨라 삭제만 남긴다 */}
              <button
                type="button"
                onClick={() => onDeleteMember(account, line.member!)}
                className="text-caption-sm border-border bg-card-bg text-danger hover:bg-red-50 cursor-pointer rounded border px-1.5"
              >
                삭제
              </button>
            </span>
          )}
          <LineTag line={line} />
        </div>
      ))}
    </div>
  )
}

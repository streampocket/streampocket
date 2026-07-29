'use client'

import { cn } from '@/lib/utils'
import { AccountActions } from './AccountActions'
import { AccountBadges } from './AccountBadges'
import { MemoLines } from './MemoLines'
import { formatHeadLine } from '../_lib/dramaView'
import type { DecoratedAccount, DecoratedMember } from '../_types'

type DramaListProps = {
  accounts: DecoratedAccount[]
  query: string
  expanded: Set<string>
  onToggle: (id: string) => void
  onEdit: (account: DecoratedAccount) => void
  onDeleteMember: (account: DecoratedAccount, member: DecoratedMember) => void
}

/** 검색어와 겹치는 부분만 노란색 표시 (목록 줄용 축약 버전) */
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>
  const index = text.toLowerCase().indexOf(query.toLowerCase())
  if (index === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, index)}
      <mark className="rounded-sm bg-amber-200 px-0.5 text-amber-900">
        {text.slice(index, index + query.length)}
      </mark>
      {text.slice(index + query.length)}
    </>
  )
}

/**
 * 목록 보기 — 한 줄에 한 계정. 171개를 훑을 때 카드보다 3배 넘게 들어간다.
 * 줄을 누르면 그 자리에서 카드와 똑같은 메모가 펼쳐진다 (MemoLines 공유).
 */
export function DramaList({
  accounts,
  query,
  expanded,
  onToggle,
  onEdit,
  onDeleteMember,
}: DramaListProps) {
  return (
    <div className="border-border bg-card-bg overflow-hidden rounded-xl border shadow-[0_1px_3px_rgba(0,0,0,.08),0_1px_2px_rgba(0,0,0,.06)]">
      {accounts.map((account) => {
        const isOpen = expanded.has(account.id)
        const head = formatHeadLine(account) ?? '(멤버십 미개설)'
        return (
          <div key={account.id}>
            <button
              type="button"
              onClick={() => onToggle(account.id)}
              aria-expanded={isOpen}
              className="border-gray-100 hover:bg-gray-50 grid w-full cursor-pointer grid-cols-[1fr_auto] items-center gap-x-2.5 gap-y-1 border-b px-3.5 py-2 text-left font-mono text-[12.5px] leading-5 tabular-nums md:grid-cols-[minmax(160px,1.05fr)_minmax(180px,1.25fr)_auto_66px_24px]"
            >
              <span className={cn('truncate', !account.opened && 'text-text-muted')}>
                <Highlight text={head} query={query} />
              </span>
              <span className="truncate">
                <Highlight text={account.email} query={query} />
              </span>
              <span className="col-span-2 flex flex-wrap gap-1 md:col-span-1 md:justify-end">
                <AccountBadges account={account} />
              </span>
              <span className="text-text-secondary text-caption-md font-sans md:text-right">
                {account.opened ? `${account.alive}/${account.capacity ?? '?'}명` : '—'}
              </span>
              <span className={cn('text-text-muted hidden text-center text-[11px] transition-transform md:block', isOpen && 'rotate-90')}>
                ▶
              </span>
            </button>

            {isOpen && (
              <div className="bg-gray-50 border-gray-100 border-b">
                <MemoLines
                  account={account}
                  query={query}
                            onDeleteMember={onDeleteMember}
                />
                <AccountActions account={account} onEdit={onEdit} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

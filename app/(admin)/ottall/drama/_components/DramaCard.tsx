'use client'

import { AccountActions } from './AccountActions'
import { AccountBadges } from './AccountBadges'
import { MemoLines } from './MemoLines'
import type { DecoratedAccount, DecoratedMember } from '../_types'

type DramaCardProps = {
  account: DecoratedAccount
  query: string
  onEdit: (account: DecoratedAccount) => void
  onDeleteMember: (account: DecoratedAccount, member: DecoratedMember) => void
}

/**
 * 계정 카드 — 높이를 고정해 격자가 어긋나지 않게 한다.
 * 파티원이 많으면 메모 영역만 안에서 스크롤되고 카드 크기는 그대로다.
 */
export function DramaCard({ account, query, onEdit, onDeleteMember }: DramaCardProps) {
  return (
    <article className="border-border bg-card-bg flex h-[322px] flex-col overflow-hidden rounded-xl border shadow-[0_1px_3px_rgba(0,0,0,.08),0_1px_2px_rgba(0,0,0,.06)]">
      <header className="border-gray-100 flex flex-wrap items-center gap-1.5 border-b px-4 py-2.5">
        <h3 className="text-heading-sm mr-auto">
          {account.opened ? (
            <>
              {account.platform} <span className="text-text-muted font-medium">· {account.capacityLabel}</span>
            </>
          ) : (
            <span className="text-text-muted font-medium">계정만 등록됨</span>
          )}
        </h3>
        <AccountBadges account={account} />
      </header>

      <MemoLines
        account={account}
        query={query}
        onDeleteMember={onDeleteMember}
        className="min-h-0 flex-1"
      />

      <AccountActions account={account} onEdit={onEdit} />
    </article>
  )
}

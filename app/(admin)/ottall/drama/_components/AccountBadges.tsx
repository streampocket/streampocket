import { Badge } from '@/components/ui/Badge'
import type { DecoratedAccount } from '../_types'

/** 카드 상단과 목록 줄이 함께 쓰는 상태 뱃지 묶음 */
export function AccountBadges({ account }: { account: DecoratedAccount }) {
  if (!account.opened) {
    return <Badge variant="gray">미개설</Badge>
  }

  return (
    <>
      {account.capacityLabel === '프라이빗' && <Badge variant="purple">프라이빗</Badge>}
      {account.free > 0 ? (
        <Badge variant="green">빈자리 {account.free}</Badge>
      ) : (
        <Badge variant="blue">정원 마감</Badge>
      )}
      {/* 며칠 지났는지는 표시하지 않는다 — 마감이면 마감 (사용자 요청) */}
      {account.duePassed ? (
        <Badge variant="red">마감</Badge>
      ) : (
        account.dueSoon && <Badge variant="yellow">D-{account.dueLeft}</Badge>
      )}
      {account.expiredCount > 0 && <Badge variant="red">만료 {account.expiredCount}</Badge>}
    </>
  )
}

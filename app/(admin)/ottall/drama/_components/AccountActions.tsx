'use client'

import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { useClearExpiredMembers, useDeleteDramaAccount } from '../_hooks/useDramaAccounts'
import type { DecoratedAccount } from '../_types'

type AccountActionsProps = {
  account: DecoratedAccount
  onEdit: (account: DecoratedAccount) => void
}

/**
 * 카드 하단과 목록 펼침이 함께 쓰는 액션 줄.
 * 파티원 추가도 「수정」 하나로 한다 — 편집기가 커서를 맨 끝에 두고 열려 바로 타이핑할 수 있다.
 */
export function AccountActions({ account, onEdit }: AccountActionsProps) {
  const clearExpired = useClearExpiredMembers()
  const deleteAccount = useDeleteDramaAccount()

  const handleClearExpired = () => {
    const names = account.members
      .filter((m) => m.expired)
      .map((m) => m.name)
      .join(', ')
    if (!window.confirm(`만료된 파티원 ${account.expiredCount}명을 지웁니다.\n\n${names}\n\n계속할까요?`)) return
    clearExpired.mutate(account.id, {
      onSuccess: (res) => toast.success(res.message),
      onError: (e) => toast.error(e instanceof Error ? e.message : '정리에 실패했습니다.'),
    })
  }

  const handleDelete = () => {
    if (!window.confirm(`계정 ${account.email}과(와) 파티원 ${account.members.length}명을 모두 지웁니다.\n되돌릴 수 없습니다. 계속할까요?`)) return
    deleteAccount.mutate(account.id, {
      onSuccess: () => toast.success('계정이 삭제되었습니다.'),
      onError: (e) => toast.error(e instanceof Error ? e.message : '삭제에 실패했습니다.'),
    })
  }

  return (
    <div className="border-gray-100 flex flex-wrap items-center gap-1.5 border-t px-4 py-2.5">
      {account.opened ? (
        <Button size="xs" variant="secondary" onClick={() => onEdit(account)}>
          수정
        </Button>
      ) : (
        // 아직 멤버십을 안 연 계정은 "무엇을 하는 버튼인지"가 더 분명하도록 라벨을 바꾼다
        <Button size="xs" onClick={() => onEdit(account)}>
          멤버십 열기
        </Button>
      )}
      <span className="ml-auto flex gap-1.5">
        {account.expiredCount > 0 && (
          <Button size="xs" variant="secondary" onClick={handleClearExpired} loading={clearExpired.isPending}>
            만료 {account.expiredCount}명 정리
          </Button>
        )}
        <Button size="xs" variant="danger" onClick={handleDelete} loading={deleteAccount.isPending}>
          삭제
        </Button>
      </span>
    </div>
  )
}

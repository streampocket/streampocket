'use client'

import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { BadgeVariant } from '@/components/ui/Badge'
import { useDisableAccount } from '../_hooks/useDisableAccount'
import { formatDate } from '@/lib/utils'
import type { SteamAccount, AccountStatus } from '@/types/domain'

type AccountDetailModalProps = {
  account: SteamAccount | null
  onClose: () => void
}

const STATUS_MAP: Record<AccountStatus, { label: string; variant: BadgeVariant }> = {
  available: { label: '사용 가능', variant: 'green' },
  reserved: { label: '선점됨', variant: 'yellow' },
  sent: { label: '발송 완료', variant: 'blue' },
  disabled: { label: '비활성화', variant: 'gray' },
}

export function AccountDetailModal({ account, onClose }: AccountDetailModalProps) {
  const { mutate: disable, isPending: isDisabling } = useDisableAccount()

  if (!account) return null

  const status = STATUS_MAP[account.status]

  const handleDisable = () => {
    disable(account.id, { onSuccess: onClose })
  }

  return (
    <Modal
      isOpen={account !== null}
      onClose={onClose}
      title="계정 상세"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            닫기
          </Button>
          {account.status === 'available' && (
            <Button variant="danger" loading={isDisabling} onClick={handleDisable}>
              비활성화
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-body-md font-semibold text-text-primary">{account.productName}</span>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
          <div>
            <dt className="text-caption-md text-text-muted">아이디</dt>
            <dd className="font-mono text-caption-md mt-0.5 text-text-primary">{account.username}</dd>
          </div>
          <div>
            <dt className="text-caption-md text-text-muted">비밀번호</dt>
            <dd className="font-mono text-caption-md mt-0.5 text-text-primary">{account.password}</dd>
          </div>
          <div>
            <dt className="text-caption-md text-text-muted">이메일</dt>
            <dd className="font-mono text-caption-md mt-0.5 text-text-secondary">{account.email}</dd>
          </div>
          <div>
            <dt className="text-caption-md text-text-muted">이메일 비밀번호</dt>
            <dd className="font-mono text-caption-md mt-0.5 text-text-secondary">{account.emailPassword}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-caption-md text-text-muted">이메일 사이트</dt>
            <dd className="text-caption-md mt-0.5 text-text-secondary">{account.emailSiteUrl}</dd>
          </div>
          <div>
            <dt className="text-caption-md text-text-muted">등록일</dt>
            <dd className="text-caption-md mt-0.5 text-text-secondary">{formatDate(account.createdAt)}</dd>
          </div>
        </dl>
      </div>
    </Modal>
  )
}

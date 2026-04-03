'use client'

import { useEffect, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { BadgeVariant } from '@/components/ui/Badge'
import { cn, formatDate } from '@/lib/utils'
import { useDisableAccount } from '../_hooks/useDisableAccount'
import { useUpdateAccount } from '../_hooks/useUpdateAccount'
import { useDeleteAccount } from '../_hooks/useDeleteAccount'
import type { SteamAccount, AccountStatus } from '@/types/domain'

type AccountDetailModalProps = {
  account: SteamAccount | null
  onClose: () => void
}

type AccountFormState = {
  username: string
  password: string
  email: string
  emailPassword: string
  emailSiteUrl: string
  secondaryEmail: string
  secondaryEmailPassword: string
}

const STATUS_MAP: Record<AccountStatus, { label: string; variant: BadgeVariant }> = {
  available: { label: '사용 가능', variant: 'green' },
  reserved: { label: '예약됨', variant: 'yellow' },
  sent: { label: '발송 완료', variant: 'blue' },
  disabled: { label: '비활성화', variant: 'gray' },
}

const inputClass = cn(
  'w-full rounded-lg border border-border bg-white px-3 py-2',
  'text-body-md text-text-primary placeholder:text-text-muted',
  'outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand-light',
)

function toFormState(account: SteamAccount): AccountFormState {
  return {
    username: account.username,
    password: account.password,
    email: account.email,
    emailPassword: account.emailPassword,
    emailSiteUrl: account.emailSiteUrl,
    secondaryEmail: account.secondaryEmail ?? '',
    secondaryEmailPassword: account.secondaryEmailPassword ?? '',
  }
}

export function AccountDetailModal({ account, onClose }: AccountDetailModalProps) {
  const { mutate: disable, isPending: isDisabling } = useDisableAccount()
  const { mutate: updateAccount, isPending: isUpdating } = useUpdateAccount(onClose)
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccount(onClose)
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState<AccountFormState>({
    username: '',
    password: '',
    email: '',
    emailPassword: '',
    emailSiteUrl: '',
    secondaryEmail: '',
    secondaryEmailPassword: '',
  })

  useEffect(() => {
    if (!account) {
      setIsEditing(false)
      setForm({
        username: '',
        password: '',
        email: '',
        emailPassword: '',
        emailSiteUrl: '',
        secondaryEmail: '',
        secondaryEmailPassword: '',
      })
      return
    }

    setIsEditing(false)
    setForm(toFormState(account))
  }, [account])

  if (!account) return null

  const status = STATUS_MAP[account.status]
  const isPending = isDisabling || isUpdating || isDeleting

  const handleDisable = () => {
    disable(account.id, { onSuccess: onClose })
  }

  const handleDelete = () => {
    const isConfirmed = window.confirm(
      '이 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
    )

    if (!isConfirmed) {
      return
    }

    deleteAccount(account.id)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    updateAccount({
      id: account.id,
      data: {
        ...form,
        secondaryEmail: form.secondaryEmail || null,
        secondaryEmailPassword: form.secondaryEmailPassword || null,
      },
    })
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setForm(toFormState(account))
  }

  const setField = <K extends keyof AccountFormState>(key: K, value: AccountFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <Modal
      isOpen={account !== null}
      onClose={onClose}
      title="계정 상세"
      footer={
        isEditing ? (
          <>
            <Button variant="secondary" onClick={handleCancelEdit} disabled={isPending}>
              취소
            </Button>
            <Button form="account-edit-form" type="submit" loading={isUpdating}>
              저장
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" onClick={onClose} disabled={isPending}>
              닫기
            </Button>
            {account.status === 'available' && (
              <Button variant="danger" loading={isDisabling} onClick={handleDisable}>
                비활성화
              </Button>
            )}
            <Button variant="secondary" onClick={() => setIsEditing(true)} disabled={isPending}>
              수정
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              loading={isDeleting}
              disabled={account.status === 'sent'}
              title={
                account.status === 'sent' ? '발송 완료된 계정은 삭제할 수 없습니다' : undefined
              }
            >
              삭제
            </Button>
          </>
        )
      }
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-body-md font-semibold text-text-primary">{account.productName}</span>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>

        {isEditing ? (
          <form id="account-edit-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-caption-md font-semibold text-text-secondary">
                  아이디
                </label>
                <input
                  className={inputClass}
                  value={form.username}
                  onChange={(event) => setField('username', event.target.value)}
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-caption-md font-semibold text-text-secondary">
                  비밀번호
                </label>
                <input
                  className={inputClass}
                  value={form.password}
                  onChange={(event) => setField('password', event.target.value)}
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-caption-md font-semibold text-text-secondary">
                  이메일
                </label>
                <input
                  className={inputClass}
                  value={form.email}
                  onChange={(event) => setField('email', event.target.value)}
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-caption-md font-semibold text-text-secondary">
                  이메일 비밀번호
                </label>
                <input
                  className={inputClass}
                  value={form.emailPassword}
                  onChange={(event) => setField('emailPassword', event.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-caption-md font-semibold text-text-secondary">
                이메일 사이트 URL
              </label>
              <input
                className={inputClass}
                value={form.emailSiteUrl}
                onChange={(event) => setField('emailSiteUrl', event.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-caption-md font-semibold text-text-secondary">
                  2차 이메일 <span className="text-text-muted">(선택)</span>
                </label>
                <input
                  className={inputClass}
                  value={form.secondaryEmail}
                  onChange={(event) => setField('secondaryEmail', event.target.value)}
                  placeholder="없으면 비워두세요"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-caption-md font-semibold text-text-secondary">
                  2차 이메일 비밀번호 <span className="text-text-muted">(선택)</span>
                </label>
                <input
                  className={inputClass}
                  value={form.secondaryEmailPassword}
                  onChange={(event) => setField('secondaryEmailPassword', event.target.value)}
                  placeholder="없으면 비워두세요"
                />
              </div>
            </div>
            <div>
              <p className="text-caption-md text-text-muted">등록일</p>
              <p className="mt-0.5 text-caption-md text-text-secondary">
                {formatDate(account.createdAt)}
              </p>
            </div>
          </form>
        ) : (
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
            <div>
              <dt className="text-caption-md text-text-muted">아이디</dt>
              <dd className="mt-0.5 font-mono text-caption-md text-text-primary">
                {account.username}
              </dd>
            </div>
            <div>
              <dt className="text-caption-md text-text-muted">비밀번호</dt>
              <dd className="mt-0.5 font-mono text-caption-md text-text-primary">
                {account.password}
              </dd>
            </div>
            <div>
              <dt className="text-caption-md text-text-muted">이메일</dt>
              <dd className="mt-0.5 font-mono text-caption-md text-text-secondary">
                {account.email}
              </dd>
            </div>
            <div>
              <dt className="text-caption-md text-text-muted">이메일 비밀번호</dt>
              <dd className="mt-0.5 font-mono text-caption-md text-text-secondary">
                {account.emailPassword}
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="text-caption-md text-text-muted">이메일 사이트 URL</dt>
              <dd className="mt-0.5 text-caption-md text-text-secondary">{account.emailSiteUrl}</dd>
            </div>
            {account.secondaryEmail && (
              <>
                <div>
                  <dt className="text-caption-md text-text-muted">2차 이메일</dt>
                  <dd className="mt-0.5 font-mono text-caption-md text-text-secondary">
                    {account.secondaryEmail}
                  </dd>
                </div>
                <div>
                  <dt className="text-caption-md text-text-muted">2차 이메일 비밀번호</dt>
                  <dd className="mt-0.5 font-mono text-caption-md text-text-secondary">
                    {account.secondaryEmailPassword}
                  </dd>
                </div>
              </>
            )}
            <div>
              <dt className="text-caption-md text-text-muted">등록일</dt>
              <dd className="mt-0.5 text-caption-md text-text-secondary">
                {formatDate(account.createdAt)}
              </dd>
            </div>
          </dl>
        )}
      </div>
    </Modal>
  )
}

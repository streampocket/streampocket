'use client'

import { useEffect, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import {
  WITHDRAWAL_REASONS,
  WITHDRAWAL_RETENTION_DAYS,
  type WithdrawalReasonCode,
} from '@/constants/app'

type WithdrawModalProps = {
  isOpen: boolean
  isPending: boolean
  onConfirm: (reason: WithdrawalReasonCode, reasonDetail?: string) => void
  onClose: () => void
}

const NOTICES = [
  `탈퇴 정보는 ${WITHDRAWAL_RETENTION_DAYS}일 동안 보관된 뒤 완전히 삭제됩니다.`,
  '이용 중이거나 승인 대기 중인 파티가 있으면 탈퇴할 수 없습니다. 파티 기간이 끝난 뒤 탈퇴해 주세요.',
  '작성하신 리뷰는 "탈퇴한 회원" 이름으로 남습니다.',
  '탈퇴 후에도 같은 이메일·전화번호로 다시 가입할 수 있습니다.',
]

export function WithdrawModal({ isOpen, isPending, onConfirm, onClose }: WithdrawModalProps) {
  const [reason, setReason] = useState<WithdrawalReasonCode | null>(null)
  const [detail, setDetail] = useState('')

  useEffect(() => {
    if (isOpen) {
      setReason(null)
      setDetail('')
    }
  }, [isOpen])

  const canSubmit =
    reason !== null && (reason !== 'other' || detail.trim().length > 0) && !isPending

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="회원 탈퇴"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose} disabled={isPending}>
            취소
          </Button>
          <Button
            variant="danger"
            loading={isPending}
            disabled={!canSubmit}
            onClick={() => {
              if (!reason) return
              onConfirm(reason, reason === 'other' ? detail.trim() : undefined)
            }}
          >
            탈퇴하기
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <ul className="space-y-1 rounded-lg bg-gray-50 p-3">
          {NOTICES.map((notice) => (
            <li key={notice} className="text-caption-md text-text-secondary">
              · {notice}
            </li>
          ))}
        </ul>

        <div className="space-y-2">
          <p className="text-body-md font-semibold text-text-primary">탈퇴 사유를 알려주세요</p>
          {WITHDRAWAL_REASONS.map((option) => (
            <label
              key={option.code}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 transition-colors hover:bg-gray-50"
            >
              <input
                type="radio"
                name="withdrawal-reason"
                checked={reason === option.code}
                onChange={() => setReason(option.code)}
                className="accent-brand"
              />
              <span className="text-body-md text-text-primary">{option.label}</span>
            </label>
          ))}
          {reason === 'other' && (
            <textarea
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="탈퇴 사유를 입력해주세요"
              maxLength={300}
              rows={3}
              className="text-body-md w-full rounded-lg border border-border bg-card-bg px-3 py-2 text-text-primary placeholder:text-text-muted focus:border-brand focus:outline-none"
            />
          )}
        </div>
      </div>
    </Modal>
  )
}

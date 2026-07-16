'use client'

import { useEffect, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

type AdminWithdrawModalProps = {
  isOpen: boolean
  userName: string
  isPending: boolean
  onConfirm: (reason: string) => void
  onClose: () => void
}

// 관리자 강제 탈퇴 — 1단계(사유 입력) → 2단계(최종 확인)의 2단계 확인 흐름
export function AdminWithdrawModal({
  isOpen,
  userName,
  isPending,
  onConfirm,
  onClose,
}: AdminWithdrawModalProps) {
  const [step, setStep] = useState<'reason' | 'confirm'>('reason')
  const [reason, setReason] = useState('')

  useEffect(() => {
    if (isOpen) {
      setStep('reason')
      setReason('')
    }
  }, [isOpen])

  if (step === 'confirm') {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="탈퇴 최종 확인"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setStep('reason')} disabled={isPending}>
              이전
            </Button>
            <Button variant="danger" loading={isPending} onClick={() => onConfirm(reason.trim())}>
              탈퇴 확정
            </Button>
          </div>
        }
      >
        <div className="space-y-3">
          <p className="text-body-md text-text-primary">
            정말 <span className="font-semibold">&apos;{userName}&apos;</span> 회원을 탈퇴
            처리할까요?
          </p>
          <p className="text-body-md text-text-secondary">
            30일 후 회원 정보가 완전히 삭제되며 되돌릴 수 없습니다.
          </p>
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-caption-md text-text-muted">입력한 사유</p>
            <p className="text-body-md mt-1 whitespace-pre-wrap text-text-primary">{reason}</p>
          </div>
        </div>
      </Modal>
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="회원 탈퇴 처리"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose} disabled={isPending}>
            취소
          </Button>
          <Button variant="danger" disabled={reason.trim().length === 0} onClick={() => setStep('confirm')}>
            탈퇴 처리
          </Button>
        </div>
      }
    >
      <div className="space-y-3">
        <p className="text-body-md text-text-secondary">
          <span className="font-medium text-text-primary">{userName}</span> 회원을 탈퇴
          처리합니다. 정보는 30일 보관 후 완전히 삭제되고, 진행 중이거나 승인 대기 중인 파티가
          있으면 처리할 수 없습니다.
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="탈퇴 처리 사유 (필수, 예: 본인 요청)"
          maxLength={300}
          rows={3}
          className="text-body-md w-full rounded-lg border border-border bg-card-bg px-3 py-2 text-text-primary placeholder:text-text-muted focus:border-brand focus:outline-none"
        />
      </div>
    </Modal>
  )
}

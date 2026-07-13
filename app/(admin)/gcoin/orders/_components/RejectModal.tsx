'use client'

import { useEffect, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import type { GcoinOrder } from '../_types'

type RejectModalProps = {
  order: GcoinOrder | null
  isPending: boolean
  onConfirm: (reason: string | null) => void
  onClose: () => void
}

export function RejectModal({ order, isPending, onConfirm, onClose }: RejectModalProps) {
  const [reason, setReason] = useState('')

  useEffect(() => {
    if (order) setReason('')
  }, [order])

  return (
    <Modal
      isOpen={order !== null}
      onClose={onClose}
      title="주문 거절"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose} disabled={isPending}>
            취소
          </Button>
          <Button
            variant="danger"
            loading={isPending}
            onClick={() => onConfirm(reason.trim() || null)}
          >
            거절
          </Button>
        </div>
      }
    >
      <div className="space-y-3">
        <p className="text-body-md text-text-secondary">
          <span className="font-medium text-text-primary">{order?.productName}</span> 주문을
          거절할까요? 거절 사유는 구매자 주문내역에 표시됩니다.
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="거절 사유 (선택, 예: 입금 미확인)"
          maxLength={500}
          rows={3}
          className="text-body-md w-full rounded-lg border border-border bg-card-bg px-3 py-2 text-text-primary placeholder:text-text-muted focus:border-brand focus:outline-none"
        />
      </div>
    </Modal>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { formatDateOnly, getTodayStringKST } from '@/lib/utils'
import type { ManualRevenue } from '@/types/domain'
import type { ManualRevenueFormData } from '../_types'

type ManualRevenueFormModalProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ManualRevenueFormData) => void
  isPending: boolean
  item?: ManualRevenue | null
}

export function ManualRevenueFormModal({ isOpen, onClose, onSubmit, isPending, item }: ManualRevenueFormModalProps) {
  const [date, setDate] = useState(getTodayStringKST())
  const [amount, setAmount] = useState('')
  const [memo, setMemo] = useState('')

  useEffect(() => {
    if (item) {
      setDate(formatDateOnly(item.date))
      setAmount(String(item.amount))
      setMemo(item.memo ?? '')
    } else {
      setDate(getTodayStringKST())
      setAmount('')
      setMemo('')
    }
  }, [item, isOpen])

  const handleSubmit = () => {
    const parsedAmount = parseInt(amount, 10)
    if (isNaN(parsedAmount) || parsedAmount < 0) return
    onSubmit({
      date,
      amount: parsedAmount,
      memo: memo || undefined,
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={item ? '수동 매출 수정' : '수동 매출 추가'}
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            취소
          </Button>
          <Button size="sm" onClick={handleSubmit} loading={isPending}>
            {item ? '수정' : '추가'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="text-body-md text-text-secondary">날짜</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-card-bg px-3 py-2 text-body-md text-text-primary focus:border-brand focus:outline-none"
          />
        </div>
        <div>
          <label className="text-body-md text-text-secondary">금액 (원)</label>
          <input
            type="number"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="예: 50000"
            className="mt-1 w-full rounded-lg border border-border bg-card-bg px-3 py-2 text-body-md text-text-primary focus:border-brand focus:outline-none"
          />
        </div>
        <div>
          <label className="text-body-md text-text-secondary">메모 (선택)</label>
          <input
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            maxLength={500}
            placeholder="예: 계좌이체 입금"
            className="mt-1 w-full rounded-lg border border-border bg-card-bg px-3 py-2 text-body-md text-text-primary focus:border-brand focus:outline-none"
          />
        </div>
      </div>
    </Modal>
  )
}

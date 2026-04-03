'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import type { Expense, ExpenseCategory } from '@/types/domain'
import type { ExpenseFormData } from '../_types'

const CATEGORY_OPTIONS: { value: ExpenseCategory; label: string }[] = [
  { value: 'game_purchase', label: '게임 구매비' },
  { value: 'country_change', label: '국가변경' },
  { value: 'review_game', label: '리뷰 게임' },
  { value: 'other', label: '기타' },
]

type ExpenseFormModalProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ExpenseFormData) => void
  isPending: boolean
  expense?: Expense | null
}

function getTodayString(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

export function ExpenseFormModal({ isOpen, onClose, onSubmit, isPending, expense }: ExpenseFormModalProps) {
  const [date, setDate] = useState(getTodayString())
  const [category, setCategory] = useState<ExpenseCategory>('game_purchase')
  const [amount, setAmount] = useState('')
  const [memo, setMemo] = useState('')

  useEffect(() => {
    if (expense) {
      setDate(expense.date.slice(0, 10))
      setCategory(expense.category)
      setAmount(String(expense.amount))
      setMemo(expense.memo ?? '')
    } else {
      setDate(getTodayString())
      setCategory('game_purchase')
      setAmount('')
      setMemo('')
    }
  }, [expense, isOpen])

  const handleSubmit = () => {
    const parsedAmount = parseInt(amount, 10)
    if (isNaN(parsedAmount) || parsedAmount < 0) return
    onSubmit({
      date,
      category,
      amount: parsedAmount,
      memo: memo || undefined,
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={expense ? '비용 수정' : '비용 추가'}
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            취소
          </Button>
          <Button size="sm" onClick={handleSubmit} loading={isPending}>
            {expense ? '수정' : '추가'}
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
          <label className="text-body-md text-text-secondary">분류</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
            className="mt-1 w-full rounded-lg border border-border bg-card-bg px-3 py-2 text-body-md text-text-primary focus:border-brand focus:outline-none"
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-body-md text-text-secondary">금액 (원)</label>
          <input
            type="number"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="예: 25000"
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
            placeholder="예: 엘든링 구매"
            className="mt-1 w-full rounded-lg border border-border bg-card-bg px-3 py-2 text-body-md text-text-primary focus:border-brand focus:outline-none"
          />
        </div>
      </div>
    </Modal>
  )
}

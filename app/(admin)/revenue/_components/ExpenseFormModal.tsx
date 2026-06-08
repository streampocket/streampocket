'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { formatDateOnly, getTodayStringKST } from '@/lib/utils'
import { STORE_FORM_OPTIONS } from '@/constants/app'
import type {
  Expense,
  ExpenseCategory,
  ExpensePayer,
  ExpenseSteamOrderItem,
  Store,
} from '@/types/domain'
import type { ExpenseFormData } from '../_types'
import { OrderPicker } from './OrderPicker'

const CATEGORY_OPTIONS: { value: ExpenseCategory; label: string }[] = [
  { value: 'game_purchase', label: '게임 구매비' },
  { value: 'country_change', label: '국가변경' },
  { value: 'review_game', label: '리뷰 게임' },
  { value: 'other', label: '기타' },
]

const PAYER_OPTIONS: { value: ExpensePayer; label: string }[] = [
  { value: 'song_donggeon', label: '송동건' },
  { value: 'im_jeongbin', label: '임정빈' },
]

type ExpenseFormModalProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ExpenseFormData) => void
  isPending: boolean
  expense?: Expense | null
}

export function ExpenseFormModal({ isOpen, onClose, onSubmit, isPending, expense }: ExpenseFormModalProps) {
  const [date, setDate] = useState(getTodayStringKST())
  const [category, setCategory] = useState<ExpenseCategory>('game_purchase')
  const [payer, setPayer] = useState<ExpensePayer>('song_donggeon')
  const [amount, setAmount] = useState('')
  const [memo, setMemo] = useState('')
  const [store, setStore] = useState<'' | Store>('')
  const [linkedOrderId, setLinkedOrderId] = useState<string | null>(null)
  const [linkedOrder, setLinkedOrder] = useState<ExpenseSteamOrderItem | null>(null)

  useEffect(() => {
    if (expense) {
      setDate(formatDateOnly(expense.date))
      setCategory(expense.category)
      setPayer(expense.payer)
      setAmount(String(expense.amount))
      setMemo(expense.memo ?? '')
      setStore(expense.store ?? '')
      setLinkedOrderId(expense.steamOrderItemId ?? null)
      setLinkedOrder(expense.steamOrderItem ?? null)
    } else {
      setDate(getTodayStringKST())
      setCategory('game_purchase')
      setPayer('song_donggeon')
      setAmount('')
      setMemo('')
      setStore('')
      setLinkedOrderId(null)
      setLinkedOrder(null)
    }
  }, [expense, isOpen])

  // 분류가 게임구매에서 다른 값으로 변경되면 주문 연결 해제 (메모는 사용자가 직접 정리)
  useEffect(() => {
    if (category !== 'game_purchase' && linkedOrderId) {
      setLinkedOrderId(null)
      setLinkedOrder(null)
    }
  }, [category, linkedOrderId])

  const handleOrderChange = (order: ExpenseSteamOrderItem | null) => {
    if (order) {
      setLinkedOrderId(order.id)
      setLinkedOrder(order)
      const buyerName = order.receiverName ?? '(수신자 미상)'
      setMemo(`${buyerName} - ${order.productName}`)
    } else {
      setLinkedOrderId(null)
      setLinkedOrder(null)
    }
  }

  const isLinked = category === 'game_purchase' && linkedOrderId !== null

  const handleSubmit = () => {
    const parsedAmount = parseInt(amount, 10)
    if (isNaN(parsedAmount) || parsedAmount < 0) return
    onSubmit({
      date,
      category,
      payer,
      amount: parsedAmount,
      memo: memo || undefined,
      steamOrderItemId: category === 'game_purchase' ? linkedOrderId : null,
      // 주문연동 비용은 서버가 주문 store로 결정하므로 null 전송. 독립 비용만 선택값('' = 공통 → null).
      store: isLinked ? null : store === '' ? null : store,
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
          <label className="text-body-md text-text-secondary">결제자</label>
          <select
            value={payer}
            onChange={(e) => setPayer(e.target.value as ExpensePayer)}
            className="mt-1 w-full rounded-lg border border-border bg-card-bg px-3 py-2 text-body-md text-text-primary focus:border-brand focus:outline-none"
          >
            {PAYER_OPTIONS.map((opt) => (
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
        {category === 'game_purchase' ? (
          <div>
            <label className="text-body-md text-text-secondary">연결 주문</label>
            <div className="mt-1">
              <OrderPicker
                selectedOrderId={linkedOrderId}
                selectedOrderSummary={linkedOrder}
                onChange={handleOrderChange}
              />
            </div>
          </div>
        ) : null}
        {isLinked ? (
          <p className="text-caption-md text-text-muted">
            연결된 주문의 스토어로 자동 분류됩니다.
          </p>
        ) : (
          <div>
            <label className="text-body-md text-text-secondary">스토어 (사업 귀속)</label>
            <select
              value={store}
              onChange={(e) =>
                setStore(
                  e.target.value === 'streampocket' || e.target.value === 'pokemon_steam'
                    ? e.target.value
                    : '',
                )
              }
              className="mt-1 w-full rounded-lg border border-border bg-card-bg px-3 py-2 text-body-md text-text-primary focus:border-brand focus:outline-none"
            >
              {STORE_FORM_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}
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

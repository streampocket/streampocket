'use client'

import { useState, useCallback } from 'react'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useExpenses } from '../_hooks/useExpenses'
import { useCreateExpense } from '../_hooks/useCreateExpense'
import { useUpdateExpense } from '../_hooks/useUpdateExpense'
import { useDeleteExpense } from '../_hooks/useDeleteExpense'
import { ExpenseFormModal } from './ExpenseFormModal'
import { formatMonthDay } from '@/lib/utils'
import type { Expense, ExpenseCategory, ExpensePayer, Store } from '@/types/domain'
import type { ExpenseFormData, ExpenseListParams } from '../_types'

const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  game_purchase: '게임 구매비',
  country_change: '국가변경',
  review_game: '리뷰 게임',
  other: '기타',
}

const PAYER_LABELS: Record<ExpensePayer, string> = {
  song_donggeon: '송동건',
  im_jeongbin: '임정빈',
}

const ALL_CATEGORIES: { value: ExpenseCategory | ''; label: string }[] = [
  { value: '', label: '전체' },
  { value: 'game_purchase', label: '게임 구매비' },
  { value: 'country_change', label: '국가변경' },
  { value: 'review_game', label: '리뷰 게임' },
  { value: 'other', label: '기타' },
]

function fmt(n: number): string {
  return n.toLocaleString('ko-KR')
}

// 행 왼쪽 색띠로 사업 귀속 구분 — 공통(null)=노랑, 스트림포켓=파랑, 포켓몬스팀=빨강.
// (Tailwind JIT 때문에 클래스 문자열은 리터럴로 둠)
const ROW_ACCENT: Record<Store, string> = {
  streampocket: 'border-l-[#3b82f6]',
  pokemon_steam: 'border-l-[#ef4444]',
}
function rowAccentClass(store: Store | null): string {
  return `border-l-4 ${store ? ROW_ACCENT[store] : 'border-l-[#FEE500]'}`
}

type ExpenseTableProps = {
  yearMonth: string
  store: string
  onYearMonthChange: (ym: string) => void
}

export function ExpenseTable({ yearMonth, store, onYearMonthChange }: ExpenseTableProps) {
  const [category, setCategory] = useState<ExpenseCategory | ''>('')
  const [page, setPage] = useState(1)
  const pageSize = 20

  const params: ExpenseListParams = {
    yearMonth,
    dateOrder: 'desc',
    page,
    pageSize,
    ...(category ? { category } : {}),
    ...(store === 'streampocket' || store === 'pokemon_steam' ? { store } : {}),
  }

  const { data, isLoading } = useExpenses(params)
  const createExpense = useCreateExpense()
  const updateExpense = useUpdateExpense()
  const deleteExpense = useDeleteExpense()

  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Expense | null>(null)

  const handleCreate = useCallback(
    (formData: ExpenseFormData) => {
      createExpense.mutate(formData, {
        onSuccess: () => {
          setFormOpen(false)
        },
      })
    },
    [createExpense],
  )

  const handleUpdate = useCallback(
    (formData: ExpenseFormData) => {
      if (!editTarget) return
      updateExpense.mutate(
        { id: editTarget.id, data: formData },
        {
          onSuccess: () => {
            setEditTarget(null)
          },
        },
      )
    },
    [editTarget, updateExpense],
  )

  const handleDelete = useCallback(
    (id: string) => {
      if (!confirm('이 비용을 삭제하시겠습니까?')) return
      deleteExpense.mutate(id)
    },
    [deleteExpense],
  )

  const items = data?.data ?? []
  const meta = data?.meta

  return (
    <>
      <Card>
        <CardHeader>
          <h2 className="text-heading-md text-text-primary">비용 내역</h2>
          <div className="flex items-center gap-3">
            <input
              type="month"
              value={yearMonth}
              onChange={(e) => {
                onYearMonthChange(e.target.value)
                setPage(1)
              }}
              className="rounded-lg border border-border bg-card-bg px-3 py-1.5 text-body-sm text-text-primary focus:border-brand focus:outline-none"
            />
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value as ExpenseCategory | '')
                setPage(1)
              }}
              className="rounded-lg border border-border bg-card-bg px-3 py-1.5 text-body-sm text-text-primary focus:border-brand focus:outline-none"
            >
              {ALL_CATEGORIES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <Button size="sm" onClick={() => setFormOpen(true)}>
              + 비용 추가
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          {isLoading ? (
            <p className="py-8 text-center text-text-muted">로딩 중...</p>
          ) : items.length === 0 ? (
            <p className="py-8 text-center text-text-muted">등록된 비용이 없습니다.</p>
          ) : (
            <>
              {/* 데스크탑 테이블 */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-body-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-text-muted">
                      <th className="px-3 py-2">날짜</th>
                      <th className="px-3 py-2">분류</th>
                      <th className="px-3 py-2">결제자</th>
                      <th className="px-3 py-2 text-right">금액</th>
                      <th className="px-3 py-2 text-right">인당</th>
                      <th className="px-3 py-2">메모</th>
                      <th className="px-3 py-2 text-center">액션</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b border-border last:border-0">
                        <td className={`px-3 py-2.5 text-text-primary ${rowAccentClass(item.store)}`}>
                          {formatMonthDay(item.date)}
                        </td>
                        <td className="px-3 py-2.5 text-text-primary">
                          {CATEGORY_LABELS[item.category]}
                        </td>
                        <td className="px-3 py-2.5 text-text-primary">
                          {PAYER_LABELS[item.payer]}
                        </td>
                        <td className="px-3 py-2.5 text-right text-text-primary">
                          {fmt(item.amount)}
                        </td>
                        <td className="px-3 py-2.5 text-right text-text-muted">
                          {fmt(Math.round(item.amount / 2))}
                        </td>
                        <td className="max-w-48 px-3 py-2.5 text-text-muted">
                          <div className="flex items-center gap-1.5">
                            {item.steamOrderItemId ? (
                              <Badge variant="indigo" className="shrink-0">
                                주문연결
                              </Badge>
                            ) : null}
                            <span className="truncate">{item.memo ?? '-'}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          <button
                            onClick={() => setEditTarget(item)}
                            className="mr-2 text-text-muted hover:text-brand"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-text-muted hover:text-red-500"
                          >
                            삭제
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 모바일 카드 */}
              <div className="space-y-3 md:hidden">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-lg border border-border bg-card-bg p-4 ${rowAccentClass(item.store)}`}
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-caption-md font-medium text-text-primary">
                        {CATEGORY_LABELS[item.category]}
                      </span>
                      <span className="text-caption-md text-text-muted">
                        {formatMonthDay(item.date)}
                      </span>
                    </div>
                    <p className="text-body-md font-semibold text-text-primary">
                      {fmt(item.amount)}원
                      <span className="ml-2 text-caption-md font-normal text-text-muted">
                        (인당 {fmt(Math.round(item.amount / 2))}원)
                      </span>
                    </p>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <span className="text-caption-md shrink-0 text-text-secondary">
                        {PAYER_LABELS[item.payer]}
                      </span>
                      <div className="flex items-center gap-1.5 min-w-0">
                        {item.steamOrderItemId ? (
                          <Badge variant="indigo" className="shrink-0">
                            주문연결
                          </Badge>
                        ) : null}
                        <span className="text-caption-md truncate text-text-muted">
                          {item.memo ?? '-'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex gap-3 border-t border-border pt-2">
                      <button
                        onClick={() => setEditTarget(item)}
                        className="text-caption-md text-text-muted hover:text-brand"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-caption-md text-text-muted hover:text-red-500"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {meta && meta.totalPages > 1 && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                  >
                    이전
                  </Button>
                  <span className="text-caption-md text-text-muted">
                    {page} / {meta.totalPages}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                    disabled={page >= meta.totalPages}
                  >
                    다음
                  </Button>
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>

      <ExpenseFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreate}
        isPending={createExpense.isPending}
      />

      <ExpenseFormModal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        onSubmit={handleUpdate}
        isPending={updateExpense.isPending}
        expense={editTarget}
      />
    </>
  )
}

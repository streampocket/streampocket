'use client'

import { useState, useCallback } from 'react'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useManualRevenues } from '../_hooks/useManualRevenues'
import { useCreateManualRevenue } from '../_hooks/useCreateManualRevenue'
import { useUpdateManualRevenue } from '../_hooks/useUpdateManualRevenue'
import { useDeleteManualRevenue } from '../_hooks/useDeleteManualRevenue'
import { ManualRevenueFormModal } from './ManualRevenueFormModal'
import { formatMonthDay } from '@/lib/utils'
import type { ManualRevenue, Store } from '@/types/domain'
import type { ManualRevenueFormData, ManualRevenueListParams } from '../_types'

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

type ManualRevenueTableProps = {
  yearMonth: string
  store: string
}

export function ManualRevenueTable({ yearMonth, store }: ManualRevenueTableProps) {
  const [page, setPage] = useState(1)
  const pageSize = 20

  const params: ManualRevenueListParams = {
    yearMonth,
    dateOrder: 'desc',
    page,
    pageSize,
    ...(store === 'streampocket' || store === 'pokemon_steam' ? { store } : {}),
  }

  const { data, isLoading } = useManualRevenues(params)
  const createItem = useCreateManualRevenue()
  const updateItem = useUpdateManualRevenue()
  const deleteItem = useDeleteManualRevenue()

  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<ManualRevenue | null>(null)

  const handleCreate = useCallback(
    (formData: ManualRevenueFormData) => {
      createItem.mutate(formData, {
        onSuccess: () => {
          setFormOpen(false)
        },
      })
    },
    [createItem],
  )

  const handleUpdate = useCallback(
    (formData: ManualRevenueFormData) => {
      if (!editTarget) return
      updateItem.mutate(
        { id: editTarget.id, data: formData },
        {
          onSuccess: () => {
            setEditTarget(null)
          },
        },
      )
    },
    [editTarget, updateItem],
  )

  const handleDelete = useCallback(
    (id: string) => {
      if (!confirm('이 수동 매출을 삭제하시겠습니까?')) return
      deleteItem.mutate(id)
    },
    [deleteItem],
  )

  const items = data?.data ?? []
  const meta = data?.meta

  return (
    <>
      <Card>
        <CardHeader>
          <h2 className="text-heading-md text-text-primary">수동 매출</h2>
          <Button size="sm" onClick={() => setFormOpen(true)}>
            + 매출 추가
          </Button>
        </CardHeader>
        <CardBody>
          {isLoading ? (
            <p className="py-8 text-center text-text-muted">로딩 중...</p>
          ) : items.length === 0 ? (
            <p className="py-8 text-center text-text-muted">등록된 수동 매출이 없습니다.</p>
          ) : (
            <>
              {/* 데스크탑 테이블 */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-body-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-text-muted">
                      <th className="px-3 py-2">날짜</th>
                      <th className="px-3 py-2 text-right">금액</th>
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
                        <td className="px-3 py-2.5 text-right text-text-primary">
                          {fmt(item.amount)}원
                        </td>
                        <td className="max-w-48 truncate px-3 py-2.5 text-text-muted">
                          {item.memo ?? '-'}
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
                      <span className="text-caption-md text-text-muted">
                        {formatMonthDay(item.date)}
                      </span>
                      <span className="text-body-md font-semibold text-text-primary">
                        {fmt(item.amount)}원
                      </span>
                    </div>
                    <p className="text-caption-md truncate text-text-muted">
                      {item.memo ?? '-'}
                    </p>
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

      <ManualRevenueFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreate}
        isPending={createItem.isPending}
      />

      <ManualRevenueFormModal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        onSubmit={handleUpdate}
        isPending={updateItem.isPending}
        item={editTarget}
      />
    </>
  )
}

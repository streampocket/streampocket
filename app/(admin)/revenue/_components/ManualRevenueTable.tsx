'use client'

import { useState, useCallback } from 'react'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useManualRevenues } from '../_hooks/useManualRevenues'
import { useCreateManualRevenue } from '../_hooks/useCreateManualRevenue'
import { useUpdateManualRevenue } from '../_hooks/useUpdateManualRevenue'
import { useDeleteManualRevenue } from '../_hooks/useDeleteManualRevenue'
import { ManualRevenueFormModal } from './ManualRevenueFormModal'
import type { ManualRevenue } from '@/types/domain'
import type { ManualRevenueFormData, ManualRevenueListParams } from '../_types'

function fmt(n: number): string {
  return n.toLocaleString('ko-KR')
}

type ManualRevenueTableProps = {
  yearMonth: string
}

export function ManualRevenueTable({ yearMonth }: ManualRevenueTableProps) {
  const [page, setPage] = useState(1)
  const pageSize = 20

  const params: ManualRevenueListParams = {
    yearMonth,
    dateOrder: 'desc',
    page,
    pageSize,
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
              <div className="overflow-x-auto">
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
                        <td className="px-3 py-2.5 text-text-primary">
                          {item.date.slice(5, 10)}
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

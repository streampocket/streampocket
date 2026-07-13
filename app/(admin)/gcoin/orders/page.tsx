'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { PAGE_SIZE } from '@/constants/app'
import { OrderFilterBar } from './_components/OrderFilterBar'
import { OrderTable } from './_components/OrderTable'
import { RejectModal } from './_components/RejectModal'
import { useAdminGcoinOrders } from './_hooks/useAdminGcoinOrders'
import { useApproveGcoinOrder, useRejectGcoinOrder } from './_hooks/useGcoinOrderActions'
import type { GcoinOrder, GcoinOrderTabStatus } from './_types'

export default function GcoinOrdersPage() {
  const [activeTab, setActiveTab] = useState<GcoinOrderTabStatus>('pending')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [rejectTarget, setRejectTarget] = useState<GcoinOrder | null>(null)

  const queryStatus = activeTab === 'all' ? undefined : activeTab
  const { data, isLoading } = useAdminGcoinOrders({
    status: queryStatus,
    search: search || undefined,
    page,
    pageSize: PAGE_SIZE,
  })
  const approveMutation = useApproveGcoinOrder()
  const rejectMutation = useRejectGcoinOrder()

  const handleTabChange = (tab: GcoinOrderTabStatus) => {
    setActiveTab(tab)
    setPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleApprove = (order: GcoinOrder) => {
    if (
      !window.confirm(
        `'${order.productName}' 주문을 승인할까요?\n승인하면 통합 주문관리에 배그 주문(순수익 0원)으로 편입됩니다.`,
      )
    )
      return
    approveMutation.mutate(order.id, {
      onSuccess: () =>
        toast.success('승인되었습니다. 주문 관리에서 순수익을 입력해주세요.'),
      onError: (err: Error) => toast.error(err.message ?? '승인에 실패했습니다.'),
    })
  }

  const handleRejectConfirm = (reason: string | null) => {
    if (!rejectTarget) return
    rejectMutation.mutate(
      { id: rejectTarget.id, reason },
      {
        onSuccess: () => {
          toast.success('거절되었습니다.')
          setRejectTarget(null)
        },
        onError: (err: Error) => toast.error(err.message ?? '거절에 실패했습니다.'),
      },
    )
  }

  return (
    <div className="space-y-4">
      <OrderFilterBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        counts={data?.counts}
        search={search}
        onSearchChange={handleSearchChange}
      />

      {isLoading ? (
        <div className="py-16 text-center">
          <p className="text-body-md text-text-muted">로딩 중...</p>
        </div>
      ) : (
        <OrderTable
          orders={data?.data ?? []}
          total={data?.total ?? 0}
          page={data?.page ?? 1}
          totalPages={data?.totalPages ?? 1}
          onPageChange={setPage}
          onApprove={handleApprove}
          onReject={setRejectTarget}
        />
      )}

      <RejectModal
        order={rejectTarget}
        isPending={rejectMutation.isPending}
        onConfirm={handleRejectConfirm}
        onClose={() => setRejectTarget(null)}
      />
    </div>
  )
}

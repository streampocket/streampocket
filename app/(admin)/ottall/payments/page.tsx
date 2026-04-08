'use client'

import { useState } from 'react'
import { PAGE_SIZE } from '@/constants/app'
import { PaymentFilterBar } from './_components/PaymentFilterBar'
import { PaymentTable } from './_components/PaymentTable'
import { PaymentDetailModal } from './_components/PaymentDetailModal'
import { useAdminPayments } from './_hooks/useAdminPayments'
import type { PaymentTabStatus } from './_types'

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState<PaymentTabStatus>('all')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [page, setPage] = useState(1)
  const [detailId, setDetailId] = useState<string | null>(null)

  const queryStatus = activeTab === 'all' ? undefined : activeTab
  const { data, isLoading } = useAdminPayments({
    status: queryStatus,
    from: from || undefined,
    to: to || undefined,
    page,
    pageSize: PAGE_SIZE,
  })

  const handleTabChange = (tab: PaymentTabStatus) => {
    setActiveTab(tab)
    setPage(1)
  }

  return (
    <div className="space-y-4">
      <PaymentFilterBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        from={from}
        to={to}
        onFromChange={setFrom}
        onToChange={setTo}
      />

      {isLoading ? (
        <div className="py-16 text-center">
          <p className="text-body-md text-text-muted">로딩 중...</p>
        </div>
      ) : (
        <PaymentTable
          payments={data?.data ?? []}
          total={data?.total ?? 0}
          page={data?.page ?? 1}
          totalPages={data?.totalPages ?? 1}
          onPageChange={setPage}
          onViewDetail={setDetailId}
        />
      )}

      <PaymentDetailModal paymentId={detailId} onClose={() => setDetailId(null)} />
    </div>
  )
}

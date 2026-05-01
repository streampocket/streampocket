'use client'

import { useState } from 'react'
import { PAGE_SIZE } from '@/constants/app'
import { ApplicationFilterBar } from './_components/ApplicationFilterBar'
import { ApplicationTable } from './_components/ApplicationTable'
import { ApplicationDetailModal } from './_components/ApplicationDetailModal'
import { useAdminApplications } from './_hooks/useAdminApplications'
import type { ApplicationTabStatus } from './_types'

export default function ApplicationsPage() {
  const [activeTab, setActiveTab] = useState<ApplicationTabStatus>('pending')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [detailId, setDetailId] = useState<string | null>(null)

  const queryStatus = activeTab === 'all' ? undefined : activeTab
  const { data, isLoading } = useAdminApplications({
    status: queryStatus,
    search: search || undefined,
    page,
    pageSize: PAGE_SIZE,
  })

  const handleTabChange = (tab: ApplicationTabStatus) => {
    setActiveTab(tab)
    setPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  return (
    <div className="space-y-4">
      <ApplicationFilterBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        search={search}
        onSearchChange={handleSearchChange}
      />

      {isLoading ? (
        <div className="py-16 text-center">
          <p className="text-body-md text-text-muted">로딩 중...</p>
        </div>
      ) : (
        <ApplicationTable
          applications={data?.items ?? []}
          total={data?.total ?? 0}
          page={data?.page ?? 1}
          totalPages={data?.totalPages ?? 1}
          onPageChange={setPage}
          onViewDetail={setDetailId}
        />
      )}

      <ApplicationDetailModal applicationId={detailId} onClose={() => setDetailId(null)} />
    </div>
  )
}

'use client'

import { useState } from 'react'
import { PAGE_SIZE } from '@/constants/app'
import { PartyFilterBar } from './_components/PartyFilterBar'
import { PartyTable } from './_components/PartyTable'
import { PartyDetailModal } from './_components/PartyDetailModal'
import { useAdminParties } from './_hooks/useAdminParties'
import type { PartyTabStatus } from './_types'

export default function PartiesPage() {
  const [activeTab, setActiveTab] = useState<PartyTabStatus>('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [detailId, setDetailId] = useState<string | null>(null)

  const queryStatus = activeTab === 'all' ? undefined : activeTab
  const { data, isLoading } = useAdminParties({
    status: queryStatus,
    search: search || undefined,
    page,
    pageSize: PAGE_SIZE,
  })

  const handleTabChange = (tab: PartyTabStatus) => {
    setActiveTab(tab)
    setPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  return (
    <div className="space-y-4">
      <PartyFilterBar
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
        <PartyTable
          parties={data?.data ?? []}
          total={data?.total ?? 0}
          page={data?.page ?? 1}
          totalPages={data?.totalPages ?? 1}
          onPageChange={setPage}
          onViewDetail={setDetailId}
        />
      )}

      <PartyDetailModal partyId={detailId} onClose={() => setDetailId(null)} />
    </div>
  )
}

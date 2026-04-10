'use client'

import { useState } from 'react'
import { PAGE_SIZE } from '@/constants/app'
import { UserFilterBar } from './_components/UserFilterBar'
import { UserTable } from './_components/UserTable'
import { UserDetailModal } from './_components/UserDetailModal'
import { useAdminUsers } from './_hooks/useAdminUsers'
import type { UserProviderFilter } from './_types'

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState<UserProviderFilter>('all')
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [detailUserId, setDetailUserId] = useState<string | null>(null)

  const queryProvider = activeTab === 'all' ? undefined : activeTab
  const { data, isLoading } = useAdminUsers({
    search: searchQuery || undefined,
    provider: queryProvider,
    page,
    pageSize: PAGE_SIZE,
  })

  const handleTabChange = (tab: UserProviderFilter) => {
    setActiveTab(tab)
    setPage(1)
  }

  const handleSearchSubmit = () => {
    setSearchQuery(searchInput)
    setPage(1)
  }

  return (
    <div className="space-y-4">
      <UserFilterBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        search={searchInput}
        onSearchChange={setSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

      {isLoading ? (
        <div className="py-16 text-center">
          <p className="text-body-md text-text-muted">로딩 중...</p>
        </div>
      ) : (
        <UserTable
          users={data?.data ?? []}
          total={data?.total ?? 0}
          page={data?.page ?? 1}
          totalPages={data?.totalPages ?? 1}
          onPageChange={setPage}
          onViewDetail={setDetailUserId}
        />
      )}

      <UserDetailModal userId={detailUserId} onClose={() => setDetailUserId(null)} />
    </div>
  )
}
